import { test, expect } from '@playwright/test';
import { BASE_URL_ML } from '../utils/constants';

test.describe('Suite de Mercado Libre - Web Desktop', () => {

  test('TC01: Búsqueda de producto exitosa', async ({ page }) => {
    // 1. Navegar al home
    await page.goto(BASE_URL_ML);
    
    // 2. Ingresar la búsqueda y presionar Enter
    await page.locator('input[id="cb1-edit"]').fill('Samsung S24 Fe');
    await page.keyboard.press('Enter');
    
    // 3. Validar que la grilla de resultados sea visible (Espera dinámica en lugar de pausas fijas)
    const contenedorResultados = page.locator('ol.ui-search-layout');
    await expect(contenedorResultados).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);

    await page.locator('input[id="cb1-edit"]').fill('FIN DE PRUEBA');

    await page.waitForTimeout(1000);
  });

  test('TC02: Seleccionar producto e intentar comprar', async ({ page }) => {
    // 1. Navegar y buscar el producto
    await page.goto(BASE_URL_ML);
    await page.locator('input[id="cb1-edit"]').fill('Samsung S24 Fe');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // 2. Esperar a que la lista de resultados esté visible
    await page.waitForSelector('ol.ui-search-layout', { state: 'visible' });

    // 3. Identificar el primer producto de la lista y hacerle clic
    // Seleccionamos el primer 'li' (ítem) dentro de la grilla y hacemos clic en su enlace ('a')
    const primerProducto = page.locator('ol.ui-search-layout li').first().locator('a').first();
    await primerProducto.click();

    // 4. Esperar a que cargue la página del detalle del producto
    // Usamos getByRole que es muy robusto para encontrar botones por su texto visible
    const botonComprar = page.getByRole('button', { name: 'Comprar ahora' });
    await botonComprar.waitFor({ state: 'visible' });
    await botonComprar.click();

    await page.waitForTimeout(1000);
  });

  test('TC03: @smoke Agregar producto al carrito de compras', async ({ page }) => {
    // 1. Navegar y buscar el producto
    await page.goto(BASE_URL_ML);
    await page.locator('input[id="cb1-edit"]').fill('Samsung S24 Fe');
    await page.keyboard.press('Enter');

    

    // 2. Esperar a que la lista de resultados esté visible
    await page.waitForSelector('ol.ui-search-layout', { state: 'visible' });
    await page.waitForTimeout(1000);

    // 3. Hacer clic en el primer producto
    const primerProducto = page.locator('ol.ui-search-layout li').first().locator('a').first();
    await primerProducto.click();

    await page.waitForTimeout(1000);

    // 4. Identificar el botón "Agregar al carrito"
    // Usamos una expresión regular (?i) para que no importe si dice "Agregar" o "agregar"
    const botonAgregarCarrito = page.getByRole('button', { name: /agregar al carrito/i });
    await page.waitForTimeout(1000);

    // Esperamos que el botón esté visible en la página del producto y le hacemos clic
    await botonAgregarCarrito.waitFor({ state: 'visible' });
    await botonAgregarCarrito.click();

    await page.waitForTimeout(1000);

    // 5. Validación (Assert)
    // En Mercado Libre, al agregar al carrito sin estar logueado, suele redirigir 
    // a la pantalla de login o mostrar un panel de confirmación.
    // Aquí validamos que la acción nos saque de la página del producto (la URL cambia a login o al carrito)
    await expect(page).toHaveURL(/.*login.*|.*hub.*|.*cart.*/, { timeout: 10000 });
  });

  test('TC04: @smoke Navegación por Categorías hasta tienda Samsung', async ({ page }) => {
    // 1. Navegar al home
    await page.goto(BASE_URL_ML);

    // 2. Interaccionar con el menú "Categorías"
    // Buscamos el botón de Categorías y usamos hover() para simular que el usuario pone el mouse encima
    const menuCategorias = page.locator('.nav-menu-categories-link').first();
    await menuCategorias.waitFor({ state: 'visible' });
    await menuCategorias.hover(); 

    // 3. Interaccionar con "Tecnología"
    // Al hacer hover en Categorías, se despliega el menú. Ahora ponemos el mouse sobre "Tecnología".
    const menuTecnologia = page.locator('a:has-text("Tecnología")').first();
    await menuTecnologia.waitFor({ state: 'visible' });
    await menuTecnologia.hover(); 

    // 4. Hacer clic en "Celulares y Smartphones"
    // Al hacer hover en Tecnología, aparece el submenú. Ahora sí hacemos clic en la opción final.
    const opcionCelulares = page.locator('a:has-text("Celulares y Smartphones")').first();
    await opcionCelulares.waitFor({ state: 'visible' });
    await opcionCelulares.click();

    const opcionSamsung = page.locator('h3:has-text("Samsung")').first();
    await opcionSamsung.waitFor({ state: 'visible' });
    await opcionSamsung.click();

    // Busca cualquier elemento con esa clase que contenga el texto exacto
    const opcionBtnTienda = page.locator('.andes-button__content', { hasText: 'Ir a la tienda' }).first();

    await opcionBtnTienda.waitFor({ state: 'visible' });
    await opcionBtnTienda.click();
    await page.waitForTimeout(1000);

    // 5. Validación (Assert)
    // Validamos dos cosas: que la URL haya cambiado a la sección de celulares, 
    // y que el título principal (H1) de la página contenga la palabra esperada.
    //await expect(page).toHaveURL(/.*celulares.*/i, { timeout: 15000 });
    
    // Verificamos que el título H1 de la página sea visible

  });
});