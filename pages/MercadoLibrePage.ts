import { Page, Locator } from '@playwright/test';
import { BASE_URL_ML, TIMEOUTS } from '../utils/constants';

/**
 * Page Object para los flujos de Mercado Libre (web desktop).
 *
 * Encapsula los selectores y acciones de alto nivel de la página:
 * - Búsqueda de productos.
 * - Selección del primer resultado.
 * - Flujo de compra / agregado al carrito.
 * - Navegación por categorías hasta la tienda Samsung.
 */
export class MercadoLibrePage {
  constructor(private readonly page: Page) {}

  /** Navega al home de Mercado Libre usando la URL base configurada. */
  async gotoHome(): Promise<void> {
    await this.page.goto(BASE_URL_ML);
  }

  /** Input principal de búsqueda en el header. */
  private get searchInput(): Locator {
    return this.page.locator('input[id="cb1-edit"]');
  }

  /** Contenedor de la grilla de resultados. */
  private get resultsGrid(): Locator {
    return this.page.locator('ol.ui-search-layout');
  }

  /** Enlace del primer resultado de la grilla. */
  private get firstResultLink(): Locator {
    return this.page.locator('ol.ui-search-layout li').first().locator('a').first();
  }

  /** Botón \"Comprar ahora\" en la ficha de producto. */
  private get buyNowButton(): Locator {
    return this.page.getByRole('button', { name: 'Comprar ahora' });
  }

  /** Botón \"Agregar al carrito\" en la ficha de producto. */
  private get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: /agregar al carrito/i });
  }

  /** Menú principal de categorías. */
  private get categoriesMenu(): Locator {
    return this.page.locator('.nav-menu-categories-link').first();
  }

  /** Opción de categoría \"Tecnología\". */
  private get tecnologiaCategory(): Locator {
    return this.page.locator('a:has-text("Tecnología")').first();
  }

  /** Subcategoría \"Celulares y Smartphones\". */
  private get celularesYSmartphonesOption(): Locator {
    return this.page.locator('a:has-text("Celulares y Smartphones")').first();
  }

  /** Tile de marca Samsung en la categoría de celulares. */
  private get samsungBrandTile(): Locator {
    return this.page.locator('h3:has-text("Samsung")').first();
  }

  /** Botón \"Ir a la tienda\" dentro de la tienda Samsung. */
  private get goToStoreButton(): Locator {
    return this.page.locator('.andes-button__content', { hasText: 'Ir a la tienda' }).first();
  }

  /** Devuelve el locator de la grilla de resultados para asserts en los tests. */
  getResultsGrid(): Locator {
    return this.resultsGrid;
  }

  /** Devuelve el locator del título principal de la página (H1). */
  getPageTitle(): Locator {
    return this.page.locator('h1');
  }

  /**
   * Ejecuta una búsqueda de producto escribiendo en el input y presionando Enter.
   * @param term Texto a buscar (por ejemplo, \"Samsung S24 Fe\").
   */
  async searchProduct(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Sobrescribe el contenido del input de búsqueda sin enviar la búsqueda.
   * Útil para marcar fin de prueba o datos de depuración.
   */
  async overwriteSearchInput(text: string): Promise<void> {
    await this.searchInput.fill(text);
  }

  /** Espera a que la grilla de resultados esté visible. */
  async waitForResultsGrid(): Promise<void> {
    await this.resultsGrid.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  /** Abre el primer resultado de la lista de productos. */
  async openFirstResult(): Promise<void> {
    await this.firstResultLink.click();
  }

  /** Hace clic en el botón \"Comprar ahora\" del producto. */
  async clickBuyNow(): Promise<void> {
    await this.buyNowButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.buyNowButton.click();
  }

  /** Hace clic en el botón \"Agregar al carrito\" del producto. */
  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.addToCartButton.click();
  }

  /**
   * Navega por el menú de categorías hasta la tienda Samsung:
   * Categorías → Tecnología → Celulares y Smartphones → Samsung → Ir a la tienda.
   */
  async navigateToSamsungStoreViaCategories(): Promise<void> {
    await this.categoriesMenu.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.categoriesMenu.hover();

    await this.tecnologiaCategory.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.tecnologiaCategory.hover();

    await this.celularesYSmartphonesOption.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.MEDIUM,
    });
    await this.celularesYSmartphonesOption.click();

    await this.samsungBrandTile.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.samsungBrandTile.click();

    await this.goToStoreButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.goToStoreButton.click();
  }
}

