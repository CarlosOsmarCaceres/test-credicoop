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
    await page.screenshot({ path: 'screenshots/cambio-estado-previo.png' });
    
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
  test('TC02: Filtrar usuarios por estado Disabled', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await page.getByRole('link', { name: 'Admin' }).click();

    // 2. Localizar el dropdown de "Status" en la sección de filtros (arriba)
    // Usamos el mismo selector robusto que en el test anterior
    const filterStatusDropdown = page.locator('div.oxd-input-group', { hasText: 'Status' }).locator('.oxd-select-text');
    await filterStatusDropdown.click();
    await page.waitForTimeout(2000);

    // 3. Seleccionar la opción "Disabled"
    await page.getByRole('option', { name: 'Disabled' }).click();
    await page.waitForTimeout(2000);

    // 4. Hacer clic en el botón "Search"
    await page.getByRole('button', { name: 'Search' }).click();

    // 5. Esperar a que la tabla se actualice (un pequeño delay o esperar al spinner)
    await page.waitForTimeout(2000); 

    // 6. Validación: Verificar que el primer resultado de la tabla sea "Disabled"
    // Buscamos dentro de la tabla la celda que corresponde al status (suele ser la 4ta o 5ta columna)
    const primerResultadoStatus = page.locator('.oxd-table-card').first().locator('.oxd-table-cell').nth(4);
    
    await expect(primerResultadoStatus).toContainText('Disabled');

    // 7. Opcional: Contar si hay resultados
    const registrosCount = await page.locator('.oxd-table-card').count();
    console.log(`Se encontraron ${registrosCount} usuarios con estado Disabled.`);

    await page.waitForTimeout(2000);
    expect(registrosCount).toBeGreaterThan(0);
  });
  test('TC03: Cambiar estado de Disabled a Enabled para el primer registro @regresion', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await page.getByRole('link', { name: 'Admin' }).click();

    // 2. Filtrar por Status "Disabled" para obtener la lista de candidatos
    const filterStatusDropdown = page.locator('div.oxd-input-group', { hasText: 'Status' }).locator('.oxd-select-text');
    await filterStatusDropdown.click();
    await page.getByRole('option', { name: 'Disabled' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(2000);

    // 3. Definir cuántos registros vamos a procesar (en este caso 3)
    const cantidadAProcesar = 1;

    for (let i = 0; i < cantidadAProcesar; i++) {
      // Re-escaneamos la tabla en cada iteración porque el DOM cambia al navegar
      // Seleccionamos el botón editar del primer registro disponible tras cada cambio
      const btnEdit = page.locator('.oxd-table-cell-actions i.bi-pencil-fill').first();
      
      // Si no hay más registros disabled, rompemos el bucle
      if (await btnEdit.count() === 0) {
        console.log("No hay suficientes registros Disabled para procesar.");
        break;
      }

      await btnEdit.click();
      await page.waitForTimeout(2000);

      // 4. Cambiar Status a "Enabled"
      const dropdownStatus = page.locator('div.oxd-input-group', { hasText: 'Status' }).locator('.oxd-select-text');
      await dropdownStatus.click();
      await page.getByRole('option', { name: 'Enabled' }).click();
      await page.waitForTimeout(1000);

      // 5. Guardar cambios
      await page.getByRole('button', { name: 'Save' }).click();
      
      // Esperamos el mensaje de éxito y que la navegación termine
      await expect(page.locator('.oxd-toast-content')).toContainText('Successfully Updated');
      await page.waitForTimeout(2000);

      // 6. Volver a la lista filtrada para el siguiente usuario
      // OrangeHRM suele volver a la lista general, así que re-filtramos si es necesario
      if (i < cantidadAProcesar - 1) {
        await page.getByRole('link', { name: 'User Management' }).click();
        await filterStatusDropdown.click();
        await page.getByRole('option', { name: 'Disabled' }).click();
        await page.getByRole('button', { name: 'Search' }).click();
        await page.waitForTimeout(2000);
      }
    }

    console.log(`Se procesaron ${cantidadAProcesar} registros correctamente.`);
  });
  test('TC04: Eliminar el segundo usuario de la lista @regresion @test', async ({ page }) => {
    // 1. Navegar al menú lateral "Admin"
    await page.getByRole('link', { name: 'Admin' }).click();

    // 2. Esperar a que la tabla cargue
    await expect(page.locator('.oxd-table-body')).toBeVisible({ timeout: 10000 });

    // 3. Identificar el SEGUNDO registro de la lista
    // .nth(1) selecciona el segundo elemento (ya que .first() o .nth(0) es el primero)
    const segundaFila = page.locator('.oxd-table-card').nth(1);
    
    // Capturamos el nombre para el log antes de borrarlo
    const userNameAEliminar = await segundaFila.locator('.oxd-table-cell').nth(1).innerText();
    console.log(`Intentando eliminar al segundo usuario: ${userNameAEliminar}`);

    // 4. Hacer clic en el icono de eliminar (basurero) de esa fila específica
    await segundaFila.locator('.bi-trash').click();

    // 5. Manejar el Modal de Confirmación
    // OrangeHRM abre un diálogo para confirmar. Buscamos el botón "Yes, Delete"
    const modalConfirmacion = page.locator('.orangehrm-modal-footer');
    await expect(modalConfirmacion).toBeVisible();
    
    await page.getByRole('button', { name: 'Yes, Delete' }).click();

    // 6. Validación: Verificar el mensaje Toast de éxito
    const toastExito = page.locator('.oxd-toast-content');
    await expect(toastExito).toBeVisible();
    // HACER SCREENSHOT DEL MENSAJE VERDE DE ÉXITO
    await page.screenshot({ path: 'screenshots/usuario-eliminado.png', fullPage: true });
    await expect(toastExito).toContainText('Successfully Deleted');
    await page.waitForTimeout(3000);

    console.log(`[Éxito] El usuario ${userNameAEliminar} ha sido eliminado.`);
  });

});