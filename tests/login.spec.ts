import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, MAX_LENGTH_CLAVE, MAX_LENGTH_DOCUMENTO } from '../utils/constants';

test.describe('Suite de Login - Banco Credicoop', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterEach(async ({ page }) => {
    // Pausa de 3 segundos (3000 milisegundos) al finalizar cada prueba.
    // Esto es ideal para la demo visual en la entrevista.
    await page.waitForTimeout(3000);
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
    // Usamos las constantes + 5 para asegurar que intentamos escribir de más.
    const textoLargoClave = 'a'.repeat(MAX_LENGTH_CLAVE + 5);
    const textoLargoDocumento = '1'.repeat(MAX_LENGTH_DOCUMENTO + 5);

    await loginPage.getLocatorClave().fill(textoLargoClave);
    expect(await loginPage.getLocatorClave().inputValue()).toHaveLength(MAX_LENGTH_CLAVE);

    await loginPage.getLocatorNumeroDocumento().fill(textoLargoDocumento);
    expect(await loginPage.getLocatorNumeroDocumento().inputValue()).toHaveLength(MAX_LENGTH_DOCUMENTO);
  });

  test('TC04: Intento de login vacío (Comportamiento del servidor)', async ({ page }) => {
      // Al hacer clic en Ingresar sin datos, el banco procesa la petición en el backend
      // y recarga la página en la ruta 'userLogin.do' adjuntando un jsessionid.
      await loginPage.clickIngresar();
      
      // Esperamos un momento para que el banco haga la redirección
      await page.waitForTimeout(2000); 
      
      // Validamos que la URL ahora contenga la ruta de login procesado
      expect(page.url()).toContain('userLogin.do');
    });

  test('TC05: Intento de login inválido (Happy path negativo)', async ({ page }) => {
    // Simulamos credenciales falsas: el sistema debe rechazar el acceso y
    // mantener al usuario en la pantalla de login (sin redirección al home).
    await loginPage.login('12345678', '01', '11111111', 'pass1234');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain(BASE_URL);
  });
});
