import { test, expect } from '@playwright/test';
import { MercadoLibrePage } from '../../pages/MercadoLibrePage';

test.describe('Suite de Mercado Libre - Web', () => {
  let mlPage: MercadoLibrePage;

  test.beforeEach(async ({ page }) => {
    mlPage = new MercadoLibrePage(page);
  });

  test('TC01: Búsqueda de producto exitosa Samsung S24 Fe', async ({ page }) => {
    // 1. Navegar al home
    await mlPage.gotoHome();

    // 2. Ingresar la búsqueda y presionar Enter
    await mlPage.searchProduct('Samsung S24 Fe');

    // 3. Validar que la grilla de resultados sea visible (espera dinámica)
    await mlPage.waitForResultsGrid();
    await page.waitForTimeout(2000);

    // 4. Escribir un texto de cierre de prueba en el buscador
    await mlPage.overwriteSearchInput('FIN DE PRUEBA');
    await page.waitForTimeout(2000);
  });

  test('TC02: Seleccionar producto e intentar comprar', async ({ page }) => {
    // 1. Navegar y buscar el producto
    await mlPage.gotoHome();
    await mlPage.searchProduct('Samsung S24 Fe');
    await page.waitForTimeout(2000);

    // 2. Esperar a que la lista de resultados esté visible
    await mlPage.waitForResultsGrid();

    // 3. Identificar el primer producto de la lista y hacerle clic
    await mlPage.openFirstResult();

    // 4. Esperar a que cargue la página del detalle del producto y hacer clic en "Comprar ahora"
    await mlPage.clickBuyNow();
    await page.waitForTimeout(2000);
  });

  test('TC03: Agregar producto al carrito de compras', async ({ page }) => {
    // 1. Navegar y buscar el producto
    await mlPage.gotoHome();
    await mlPage.searchProduct('Samsung S24 Fe');

    // 2. Esperar a que la lista de resultados esté visible
    await mlPage.waitForResultsGrid();
    await page.waitForTimeout(2000);

    // 3. Hacer clic en el primer producto
    await mlPage.openFirstResult();
    await page.waitForTimeout(2000);

    // 4. Identificar el botón "Agregar al carrito" y hacer clic
    await mlPage.clickAddToCart();
    await page.waitForTimeout(2000);

    // 5. Validación (Assert)
    // En Mercado Libre, al agregar al carrito sin estar logueado, suele redirigir 
    // a la pantalla de login o mostrar un panel de confirmación.
    // Aquí validamos que la acción nos saque de la página del producto (la URL cambia a login o al carrito)
    await expect(page).toHaveURL(/.*login.*|.*hub.*|.*cart.*/, { timeout: 20000 });
  });

  test('TC04: Navegación por Categorías hasta tienda Samsung', async ({ page }) => {
    // 1. Navegar al home
    await mlPage.gotoHome();

    // 2. Navegar por Categorías → Tecnología → Celulares y Smartphones → Samsung → Ir a la tienda
    await mlPage.navigateToSamsungStoreViaCategories();
    await page.waitForTimeout(2000);

    // Aquí pueden agregarse asserts adicionales sobre la URL o el título de la tienda.
  });
});