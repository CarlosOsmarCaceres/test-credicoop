import { Page, Locator } from '@playwright/test';
import { BASE_URL_ORANGE } from '../utils/constants';

/**
 * Page Object para la pantalla de login de OrangeHRM.
 *
 * Encapsula las interacciones de autenticación:
 * - Login con usuario/clave.
 * - Navegación mediante teclado (accesibilidad).
 * - Flujo de recuperación de contraseña.
 */
export class OrangeLoginPage {
  constructor(private readonly page: Page) {}

  /** Navega directamente a la pantalla de login de OrangeHRM. */
  async gotoLogin(): Promise<void> {
    await this.page.goto(BASE_URL_ORANGE + 'web/index.php/auth/login');
  }

  private get usernameInput(): Locator {
    return this.page.getByPlaceholder('Username');
  }

  private get passwordInput(): Locator {
    return this.page.getByPlaceholder('Password');
  }

  private get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  private get forgotPasswordLink(): Locator {
    return this.page.locator('.orangehrm-login-forgot-header');
  }

  private get resetPasswordButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset Password' });
  }

  /** Locator del título principal del Dashboard tras login exitoso. */
  getDashboardTitle(): Locator {
    return this.page.locator('.oxd-topbar-header-title');
  }

  /** Locator del mensaje de error para credenciales inválidas. */
  getInvalidCredentialsAlert(): Locator {
    return this.page.locator('.oxd-alert-content-text');
  }

  /** Realiza el login estándar usando usuario y contraseña. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Realiza el flujo de login utilizando únicamente teclado.
   * Útil para pruebas de accesibilidad.
   */
  async loginWithKeyboard(username: string, password: string): Promise<void> {
    await this.page.focus('input[name="username"]');
    await this.page.keyboard.type(username);
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.type(password);
    await this.page.keyboard.press('Enter');
  }

  /** Abre el flujo de recuperación de contraseña. */
  async goToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /** Completa el formulario de recuperación de contraseña para un usuario dado. */
  async resetPasswordFor(username: string): Promise<void> {
    await this.goToForgotPassword();
    await this.usernameInput.fill(username);
    await this.resetPasswordButton.click();
  }
}

