import { test, expect } from '@playwright/test';

test.describe('Suite de Mercado Libre - Web Desktop', () => {

  test('TC01: Búsqueda de producto exitosa', async ({ page }) => {
    // 1. Navegar al home
    await page.goto('https://www.mercadolibre.com.ar/');
    
    // 2. Ingresar la búsqueda y presionar Enter
    await page.locator('input[id="cb1-edit"]').fill('Samsung S24 Fe');
    await page.keyboard.press('Enter');
    
    // 3. Validar que la grilla de resultados sea visible (Espera dinámica en lugar de pausas fijas)
    const contenedorResultados = page.locator('ol.ui-search-layout');
    await expect(contenedorResultados).toBeVisible({ timeout: 15000 });
  });

  test('TC02: Seleccionar producto e intentar comprar', async ({ page }) => {
    // 1. Navegar y buscar el producto
    await page.goto('https://www.mercadolibre.com.ar/');
    await page.locator('input[id="cb1-edit"]').fill('Samsung S24 Fe');
    await page.keyboard.press('Enter');

    // 2. Esperar a que la lista de resultados esté visible
    await page.waitForSelector('ol.ui-search-layout', { state: 'visible' });

    // 3. Identificar el primer producto de la lista y hacerle clic
    // Seleccionamos el primer 'li' (ítem) dentro de la grilla y hacemos clic en su enlace ('a')
    const primerProducto = page.locator('ol.ui-search-layout li').first().locator('a').first();
    await primerProducto.click();

    // 4. Esperar a que cargue la página del detalle del producto
    // Usamos getByRole que es muy robusto para encontrar botones por su texto visible
    const botonComprar = page.getByRole('button', { name: 'Comprar ahora' });
    
    // 5. Hacer clic en Comprar
    await botonComprar.waitFor({ state: 'visible' });
    await botonComprar.click();

    // 6. Validación (Assert): Como no estamos logueados, Mercado Libre nos debe pedir iniciar sesión.
    // Validamos que la URL cambie y contenga la palabra "login" o "hub" de autenticación.
    await expect(page).toHaveURL(/.*login.*|.*hub.*/, { timeout: 30000 });
  });

});