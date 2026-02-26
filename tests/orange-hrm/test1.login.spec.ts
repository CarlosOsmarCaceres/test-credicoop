import { test, expect } from '@playwright/test';

test.describe('Módulo de Autenticación - OrangeHRM @orange @login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
  });

  test('TC01: Login exitoso @smoke', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.oxd-topbar-header-title')).toContainText('Dashboard');
  });

  
  test('TC02: Navegación por teclado (Accesibilidad)', async ({ page }) => {
    await page.focus('input[name="username"]');
    await page.keyboard.type('Admin');
    await page.keyboard.press('Tab');
    await page.keyboard.type('admin123');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/.*dashboard/);
});

  test('TC03: Recuperación de contraseña', async ({ page }) => {
    await page.locator('.orangehrm-login-forgot-header').click();
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByRole('button', { name: 'Reset Password' }).click();

    /* await expect(page.locator('.orangehrm-forgot-password-title')).toContainText('successfully'); */
});
    // Data-Driven Testing para Casos Negativos (TC03, TC04, TC07)
    const escenariosInvalidos = [
    { usuario: 'UsuarioInexistente', clave: 'admin123', desc: 'Inexistente TC04' },
    { usuario: 'Admin', clave: 'ClaveMal', desc: 'Clave Errónea TC05' },
    { usuario: 'admin', clave: 'ADMIN123', desc: 'Case Sensitive TC06' },
    ];

    for (const escenario of escenariosInvalidos) {
    test(`Login fallido: ${escenario.desc}`, async ({ page }) => {
        await page.getByPlaceholder('Username').fill(escenario.usuario);    
        await page.getByPlaceholder('Password').fill(escenario.clave);
  
        await page.getByRole('button', { name: 'Login' }).click();
  

        const alerta = page.locator('.oxd-alert-content-text');
        await expect(alerta).toBeVisible();
        await expect(alerta).toContainText('Invalid credentials');
  
    });
    }
});