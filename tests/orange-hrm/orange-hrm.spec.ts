import { test, expect } from '@playwright/test';
import { OrangeLoginPage } from '../../pages/OrangeLoginPage';
import { OrangeAdminPage } from '../../pages/OrangeAdminPage';
import { TIMEOUTS } from '../../utils/constants';

test.describe('Modulo Login - Web @orange', () => {
  let loginPage: OrangeLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new OrangeLoginPage(page);
    await loginPage.gotoLogin();
  });

    // Data-Driven Testing para Casos Negativos (TC04, TC05, TC06)
  const escenariosInvalidos = [
    { usuario: 'UsuarioInexistente', clave: 'admin123', desc: 'UsuarioInexistente TC01' },
    { usuario: 'Admin', clave: 'ClaveMal', desc: 'Clave error Password TC02' },
    { usuario: 'admin', clave: 'ADMIN123', desc: 'Case Sensitive TC03' },
  ];

  for (const escenario of escenariosInvalidos) {
    test(`Login fallido: ${escenario.desc}`, async ({ page }) => {
      await page.waitForTimeout(2000);
      await loginPage.login(escenario.usuario, escenario.clave);
      await page.waitForTimeout(2000);
      const alerta = loginPage.getInvalidCredentialsAlert();
      await expect(alerta).toBeVisible();
      await expect(alerta).toContainText('Invalid credentials');
      await page.waitForTimeout(2000);
    });
  }

  test('TC04: Login exitoso', async ({ page }) => {
    await page.waitForTimeout(2000);
    await loginPage.login(
      process.env.ORANGE_USER ?? 'Admin',
      process.env.ORANGE_PASS ?? 'admin123',
    );
    await page.waitForTimeout(2000);

    await expect(loginPage.getDashboardTitle()).toContainText('Dashboard');
    await page.screenshot({ path: 'screenshots/login-exitoso.png' });
    await page.waitForTimeout(2000);
  });

  test('TC05: Navegación por teclado (Accesibilidad)', async ({ page }) => {
    await loginPage.loginWithKeyboard(
      process.env.ORANGE_USER ?? 'Admin',
      process.env.ORANGE_PASS ?? 'admin123',
    );
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForTimeout(2000);
  });

  test('TC06: Recuperación de contraseña', async ({ page }) => {
    await loginPage.resetPasswordFor(process.env.ORANGE_USER ?? 'Admin');
    // Aquí se podrían agregar asserts adicionales sobre el mensaje de éxito.
    await page.waitForTimeout(2000);
  });


});

test.describe('Módulo Admin - Gestión de Usuarios @orange', () => {
  let loginPage: OrangeLoginPage;
  let adminPage: OrangeAdminPage;

  // Ejecutamos el login antes de cada test de este archivo
  test.beforeEach(async ({ page }) => {
    loginPage = new OrangeLoginPage(page);
    adminPage = new OrangeAdminPage(page);

    await loginPage.gotoLogin();
    await loginPage.login(
      process.env.ORANGE_USER ?? 'Admin',
      process.env.ORANGE_PASS ?? 'admin123',
    );

    // Verificamos que entramos al Dashboard antes de proceder
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC07: Cambiar estado de usuario a Disabled', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await adminPage.gotoAdmin();

    // 2. Editar el primer usuario y cambiar su estado a Disabled
    await adminPage.changeFirstUserStatus('Disabled');
    await page.screenshot({ path: 'screenshots/cambio-estado-previo.png' });
    await page.waitForTimeout(2000);
    // 3. Validación: Verificar mensaje de éxito "Toast"
    const toastExito = adminPage.getToast();
    await expect(toastExito).toBeVisible();
    await expect(toastExito).toContainText('Successfully Updated');
    await page.waitForTimeout(2000);
  });

  test('TC08: Filtrar usuarios por estado Disabled', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await adminPage.gotoAdmin();

    // 2. Filtrar por Status "Disabled"
    await adminPage.filterByStatus('Disabled');
    await page.waitForTimeout(2000);
    // 3. Validación: Verificar que el primer resultado de la tabla sea "Disabled"
    const primerResultadoStatus = await adminPage.getFirstResultStatusText();
    expect(primerResultadoStatus).toContain('Disabled');



    // 4. Opcional: Contar si hay resultados
    const registrosCount = await adminPage.getResultsCount();
    console.log(`Se encontraron ${registrosCount} usuarios con estado Disabled.`);
    expect(registrosCount).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
  });

  test('TC09: Cambiar estado de Disabled a Enabled para el primer registro', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await adminPage.gotoAdmin();

    // 2. Filtrar por Status "Disabled" para obtener la lista de candidatos
    await adminPage.filterByStatus('Disabled');

    // 3. Cambiar el estado del primer registro a Enabled
    await adminPage.changeFirstUserStatus('Enabled');
    await page.waitForTimeout(2000);
    // 4. Validar Toast de éxito
    const toastExito = adminPage.getToast();
    await expect(toastExito).toContainText('Successfully Updated');
    await page.waitForTimeout(2000);
    console.log('Se procesó 1 registro correctamente.');
  });

  test('TC10: Eliminar el segundo usuario de la lista @or', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await adminPage.gotoAdmin();

    // 2. Eliminar el segundo registro de la tabla
    const userNameAEliminar = await adminPage.deleteSecondUser();
    console.log(`Intentando eliminar al segundo usuario: ${userNameAEliminar}`);
    await page.waitForTimeout(2000);

    // 3. Validación: Verificar el mensaje Toast de éxito
    const toastExito = adminPage.getToast();
    await expect(toastExito).toBeVisible();

    // HACER SCREENSHOT DEL MENSAJE VERDE DE ÉXITO
    await page.screenshot({ path: 'screenshots/usuario-eliminado.png', fullPage: true });
    await expect(toastExito).toContainText('Successfully Deleted');
    await page.waitForTimeout(2000);
  });

  test('TC11: Registrar un usuario nuevo @test', async ({ page }) => {
    await adminPage.gotoAdmin();

    const username = `nuevo_${Date.now()}`;
    await adminPage.addNewUser({
      userRole: 'ESS',
      employeeName: 'Andres Gomez Morales',
      username,
      status: 'Enabled',
      password: 'NuevoPass123!',
    });

    const toastExito = adminPage.getToast();
    await expect(toastExito).toBeVisible({ timeout: TIMEOUTS.LONG });
    await expect(toastExito).toContainText('Successfully Saved');
  });
});

