import { APIRequestContext } from '@playwright/test';
import { NotificationsController } from 'api/controllers';
import { STATUS_CODES } from 'data';
import { notificationsSchema } from 'data/schemas';
import { logStep } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

export class NotificationsApiService {
  private controller: NotificationsController;

  constructor(request: APIRequestContext) {
    this.controller = new NotificationsController(request);
  }

  @logStep("Get authenticated user's notifications list via API")
  async getAll(token: string, read?: boolean) {
    const response = await this.controller.getAll(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(notificationsSchema, response.body);
    return typeof read === 'undefined'
      ? response.body.Notifications
      : response.body.Notifications.filter((notification) => notification.read === read);
  }

  @logStep("Mark notification as read and get authenticated user's notifications list via API")
  async readById(id: string, token: string) {
    const response = await this.controller.markReadById(id, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(notificationsSchema, response.body);
    return response.body.Notifications;
  }

  @logStep("Mark all notifications as read and get authenticated user's notifications list via API")
  async readAll(token: string) {
    const response = await this.controller.markReadAll(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(notificationsSchema, response.body);
    return response.body.Notifications;
  }
}
