import { Page } from '@playwright/test';

/**
 * Clase base para todas las páginas del patrón Page Object Model (POM).
 *
 * Centraliza el comportamiento común: navegación, espera de carga y acceso al
 * objeto Page de Playwright. Las páginas concretas (LoginPage, HomePage, etc.)
 * heredan de BasePage y evitan repetir este código, manteniendo los tests
 * más legibles y fáciles de mantener.
 */
export abstract class BasePage {
  /** Instancia de Page de Playwright; las subclases la usan para locators y acciones. */
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega a la ruta indicada (relativa al baseURL del config) o al baseURL si path está vacío.
   * @param path - Ruta relativa al baseURL (ej. 'login') o '' para ir al home.
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Espera a que la página termine de cargar (red en estado idle).
   * Útil después de navegaciones o acciones que recargan la página.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
