import { test, expect } from '@playwright/test';

test.describe('Módulo Admin - Gestión de Usuarios @orange @admin', () => {

  // Ejecutamos el login antes de cada test de este archivo
  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verificamos que entramos al Dashboard antes de proceder
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC01: Cambiar estado de usuario a Disabled @regresion', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await page.getByRole('link', { name: 'Admin' }).click();

    // 2. Esperar a que la tabla de registros sea visible
    await expect(page.locator('.oxd-table-body')).toBeVisible({ timeout: 10000 });

    // 3. Seleccionar el botón de editar (lápiz) del primer usuario de la lista
    // El selector busca el icono dentro de la celda de acciones
    const btnEdit = page.locator('.oxd-table-cell-actions i.bi-pencil-fill').first();
    await btnEdit.click();
    await page.waitForTimeout(3000);

    // 4. Localizar el dropdown de "Status"
    // En OrangeHRM los dropdowns son divs. Buscamos el que está debajo de la etiqueta Status.
    const dropdownStatus = page.locator('div.oxd-input-group', { hasText: 'Status' }).locator('.oxd-select-text');
    await dropdownStatus.click();
    await page.waitForTimeout(3000);

    // 5. Seleccionar la opción "Disabled"
    await page.getByRole('option', { name: 'Disabled' }).click();
    await page.waitForTimeout(3000);

    // 6. Guardar cambios
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000);

    // 7. Validación: Verificar mensaje de éxito "Toast"
    const toastExito = page.locator('.oxd-toast-content');
    await expect(toastExito).toBeVisible();
    await expect(toastExito).toContainText('Successfully Updated');

  });

});