import { ICredentials } from 'types/signIn.types';
import { logStep } from 'utils';
import { BaseProjectPage } from './baseProject.page';

export class SignInPage extends BaseProjectPage {
  readonly emailInput = this.page.locator('#emailinput');
  readonly passwordInput = this.page.locator('#passwordinput');
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });

  readonly uniqueElement = this.loginButton;

  @logStep('UI: Fill Credentials ')
  async fillCredentials({ username, password }: Partial<ICredentials>) {
    if (username) {
      await this.emailInput.fill(username);
    }
    if (password) {
      await this.passwordInput.fill(password);
    }
  }

  @logStep('UI: Click Login Button')
  async clickLoginButton() {
    await this.loginButton.click();
  }
}
