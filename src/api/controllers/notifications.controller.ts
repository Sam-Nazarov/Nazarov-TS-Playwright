import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config';
import { INotificationsResponse, IRequestOptions } from 'types';
import { logStep } from 'utils';

export class NotificationsController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('Send get notifications request')
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.NOTIFICATIONS,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<INotificationsResponse>(options);
  }

  @logStep('Send mark notification as read request')
  async markReadById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.NOTIFICATIONS_BY_ID_READ(id),
      method: 'patch',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<INotificationsResponse>(options);
  }

  @logStep('Send mark all notifications as read request')
  async markReadAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.NOTIFICATIONS_ALL_READ,
      method: 'patch',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<INotificationsResponse>(options);
  }
}
