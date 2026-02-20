import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, MAX_LENGTH_CLAVE, MAX_LENGTH_DOCUMENTO } from '../utils/constants';

test.describe('Suite de Login - Banco Credicoop', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC01: Validar carga de elementos críticos', async () => {
    // Verificamos que todos los controles esenciales del formulario estén presentes
    // y visibles antes de intentar interactuar. Esto detecta fallos de carga o
    // cambios en la estructura del DOM que romperían el flujo de login.
    await expect(loginPage.getLocatorAdherente()).toBeVisible();
    await expect(loginPage.getLocatorTipoDocumento()).toBeVisible();
    await expect(loginPage.getLocatorNumeroDocumento()).toBeVisible();
    await expect(loginPage.getLocatorClave()).toBeVisible();
    await expect(loginPage.getLocatorBotonIngresar()).toBeVisible();
  });

  test('TC02: Campo clave enmascarado', async () => {
    // El campo de clave debe tener type="password" para que el navegador
    // enmascare el input y no exponga credenciales en pantalla.
    await expect(loginPage.getLocatorClave()).toHaveAttribute('type', 'password');
  });

  test('TC03: Validar longitudes máximas', async () => {
    // Comprobamos que los límites maxlength del HTML se respetan: el formulario
    // no debe aceptar más caracteres de los permitidos por negocio.
    const textoLargoClave = 'a'.repeat(20);
    const textoLargoDocumento = '1'.repeat(15);

    await loginPage.getLocatorClave().fill(textoLargoClave);
    expect(await loginPage.getLocatorClave().inputValue()).toHaveLength(MAX_LENGTH_CLAVE);

    await loginPage.getLocatorNumeroDocumento().fill(textoLargoDocumento);
    expect(await loginPage.getLocatorNumeroDocumento().inputValue()).toHaveLength(
      MAX_LENGTH_DOCUMENTO
    );
  });

  test('TC04: Intento de login vacío (Validación Frontend)', async ({ page }) => {
    // Sin completar datos, el clic en Ingresar no debería redirigir a otra página.
    // La validación frontend o del banco debe mantener al usuario en login.
    const urlAntes = page.url();
    await loginPage.clickIngresar();
    const urlDespues = page.url();
    expect(urlDespues).toBe(urlAntes);
  });

  test('TC05: Intento de login inválido (Happy path negativo)', async ({ page }) => {
    // Simulamos credenciales falsas: el sistema debe rechazar el acceso y
    // mantener al usuario en la pantalla de login (sin redirección al home).
    await loginPage.login('12345678', '01', '11111111', 'pass1234');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain(BASE_URL);
  });
});
