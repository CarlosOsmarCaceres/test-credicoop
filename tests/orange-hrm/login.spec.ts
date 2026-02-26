import { test, expect } from '@playwright/test';

test.describe('Módulo de Autenticación - OrangeHRM', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('TC01: Login exitoso con credenciales válidas @orange', async ({ page }) => {
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Username').fill('Admin');
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Password').fill('admin123');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(3000);

    // Validación: El título del dashboard debe ser visible
    const header = page.locator('.oxd-topbar-header-title');
    await expect(header).toContainText('Dashboard');
    await page.waitForTimeout(3000);
  });

  test('TC05: Validar campos requeridos al dejar vacíos @orange @regresion', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(1000);

    // Verificamos que aparezca el mensaje "Required" debajo de los inputs
    const errorMessages = page.locator('.oxd-input-group__message');
    await expect(errorMessages.first()).toContainText('Required');
    expect(await errorMessages.count()).toBe(2);
    await page.waitForTimeout(3000);
  });

});