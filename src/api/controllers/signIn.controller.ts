import { RequestApi } from 'api/apiClients/request';
import { APIRequestContext } from '@playwright/test';
import { apiConfig } from 'config';
import { ICredentials, ILoginResponse, IRequestOptions } from 'types';
import { logStep } from 'utils';

export class SignInController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('Send Login request')
  async login(body: ICredentials) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.LOGIN,
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      data: body,
    };
    return await this.request.send<ILoginResponse>(options);
  }
}
