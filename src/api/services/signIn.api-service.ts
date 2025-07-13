import { APIRequestContext } from '@playwright/test';
import { SignInController } from 'api/controllers';
import { USER_LOGIN, USER_PASSWORD } from 'config';
import { STATUS_CODES } from 'data';
import { logStep } from 'utils';
import { validateResponse } from 'utils/validations';
import { Page } from '@playwright/test';

export class SignInApiService {
  private controller: SignInController;
  page: Page;
  constructor(request: APIRequestContext, page: Page) {
    this.controller = new SignInController(request);
    this.page = page;
  }

  @logStep('Login and get token via API')
  async loginAsLocalUser() {
    const response = await this.controller.login({
      username: USER_LOGIN,
      password: USER_PASSWORD,
    });
    validateResponse(response, STATUS_CODES.OK, true, null);
    const token = response.headers['authorization'];
    return token;
  }

  @logStep('Get auth token from cookies')
  async getAuthToken() {
    return (await this.page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
  }
}
