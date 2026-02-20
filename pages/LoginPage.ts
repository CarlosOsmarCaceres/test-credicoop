import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object de la pantalla de login del home banking.
 *
 * Encapsular aquí todos los selectores y acciones del login permite que, si el
 * banco cambia su diseño o atributos (ids, clases, estructura), solo modifiquemos
 * este archivo y no los tests. Los tests siguen usando login(), ingresarClave(), etc.
 */
export class LoginPage extends BasePage {
  /** Selectores provisionales; centralizados para facilitar cambios de UI. */
  private readonly selectors = {
    tipoDocumento: '#tipoDoc',
    numeroDocumento: '#nroDoc',
    clave: '#clave',
    botonIngresar: 'button[type="submit"]',
    mensajeError: '.mensaje-error',
  };

  constructor(page: Page) {
    super(page);
  }

  /** Navega a la página de login (baseURL). */
  async goto(): Promise<void> {
    await this.navigate();
  }

  /** Selecciona el tipo de documento en el combo. */
  async seleccionarTipoDocumento(tipo: string): Promise<void> {
    await this.page.locator(this.selectors.tipoDocumento).selectOption(tipo);
  }

  /** Ingresa el número de documento en el campo correspondiente. */
  async ingresarNumeroDocumento(numero: string): Promise<void> {
    await this.page.locator(this.selectors.numeroDocumento).fill(numero);
  }

  /** Ingresa la clave en el campo correspondiente. */
  async ingresarClave(clave: string): Promise<void> {
    await this.page.locator(this.selectors.clave).fill(clave);
  }

  /** Hace clic en el botón Ingresar. */
  async clickIngresar(): Promise<void> {
    await this.page.locator(this.selectors.botonIngresar).click();
  }

  /** Realiza el flujo completo de login: tipo, documento, clave y enviar. */
  async login(tipo: string, numero: string, clave: string): Promise<void> {
    await this.seleccionarTipoDocumento(tipo);
    await this.ingresarNumeroDocumento(numero);
    await this.ingresarClave(clave);
    await this.clickIngresar();
  }

  /** Devuelve el Locator del campo número de documento (para asserts o acciones extra). */
  getLocatorNumeroDocumento(): Locator {
    return this.page.locator(this.selectors.numeroDocumento);
  }

  /** Devuelve el Locator del campo clave. */
  getLocatorClave(): Locator {
    return this.page.locator(this.selectors.clave);
  }

  /** Devuelve el Locator del botón Ingresar. */
  getLocatorBotonIngresar(): Locator {
    return this.page.locator(this.selectors.botonIngresar);
  }

  /** Obtiene el texto del mensaje de error mostrado en pantalla (si existe). */
  async getMensajeError(): Promise<string | null> {
    return await this.page.locator(this.selectors.mensajeError).textContent();
  }
}
