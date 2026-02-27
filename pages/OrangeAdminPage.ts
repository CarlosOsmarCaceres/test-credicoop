import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../utils/constants';

/**
 * Page Object para el módulo Admin de OrangeHRM.
 *
 * Agrupa las operaciones de:
 * - Navegación al menú Admin.
 * - Filtro por Status en la tabla de usuarios.
 * - Edición del estado de un registro.
 * - Eliminación del segundo registro.
 * - Acceso a los mensajes Toast de éxito.
 */
export class OrangeAdminPage {
  constructor(private readonly page: Page) {}

  // --- Locators base ---

  private get adminMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Admin' });
  }

  private get tableBody(): Locator {
    return this.page.locator('.oxd-table-body');
  }

  private get firstEditButton(): Locator {
    return this.page.locator('.oxd-table-cell-actions i.bi-pencil-fill').first();
  }

  private get statusDropdownInForm(): Locator {
    return this.page
      .locator('div.oxd-input-group', { hasText: 'Status' })
      .locator('.oxd-select-text');
  }

  private get filterStatusDropdown(): Locator {
    return this.page
      .locator('div.oxd-input-group', { hasText: 'Status' })
      .locator('.oxd-select-text');
  }

  private get searchButton(): Locator {
    return this.page.getByRole('button', { name: 'Search' });
  }

  private get toast(): Locator {
    return this.page.locator('.oxd-toast-content');
  }

  private get secondRow(): Locator {
    return this.page.locator('.oxd-table-card').nth(1);
  }

  // --- Acciones de navegación ---

  /** Navega al menú Admin y espera a que la tabla esté visible. */
  async gotoAdmin(): Promise<void> {
    await this.adminMenuLink.click();
    await this.tableBody.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  // --- Filtros y estados ---

  /** Abre el dropdown de Status en el formulario de edición y selecciona el valor indicado. */
  async setStatusInForm(status: 'Enabled' | 'Disabled'): Promise<void> {
    await this.statusDropdownInForm.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  /** Aplica un filtro por Status en la tabla de usuarios. */
  async filterByStatus(status: 'Enabled' | 'Disabled'): Promise<void> {
    await this.filterStatusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }

  /** Devuelve el texto del Status del primer registro de la tabla filtrada. */
  async getFirstResultStatusText(): Promise<string> {
    const statusCell = this.page
      .locator('.oxd-table-card')
      .first()
      .locator('.oxd-table-cell')
      .nth(4);
    return statusCell.innerText();
  }

  // --- Edición de registros ---

  /**
   * Cambia el Status del primer usuario de la lista al valor indicado
   * y guarda los cambios.
   */
  async changeFirstUserStatus(status: 'Enabled' | 'Disabled'): Promise<void> {
    await this.firstEditButton.click();
    await this.page.waitForTimeout(2000);
    await this.setStatusInForm(status);
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  // --- Eliminación de registros ---

  /**
   * Elimina el segundo usuario de la lista y confirma el modal.
   * @returns El nombre del usuario eliminado (para logs).
   */
  async deleteSecondUser(): Promise<string> {
    const row = this.secondRow;
    const userName = await row.locator('.oxd-table-cell').nth(1).innerText();

    await row.locator('.bi-trash').click();

    const modalFooter = this.page.locator('.orangehrm-modal-footer');
    await modalFooter.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();

    return userName;
  }

  /** Devuelve el locator del Toast de éxito para aserciones en los tests. */
  getToast(): Locator {
    return this.toast;
  }

  /** Devuelve la cantidad de registros actualmente visibles en la tabla. */
  async getResultsCount(): Promise<number> {
    return this.page.locator('.oxd-table-card').count();
  }
}