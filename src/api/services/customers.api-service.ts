import { APIRequestContext } from '@playwright/test';
import { CustomersController } from 'api/controllers/customers.controller';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { customerSchema } from 'data/schemas';
import { STATUS_CODES } from 'data/statusCodes.data';
import { ICustomer } from 'types/customer.types';
import { logStep } from 'utils';
import { validateResponse, validateDeleteResponse, validateSchema } from 'utils/validations';

export class CustomersApiService {
  private controller: CustomersController;
  constructor(request: APIRequestContext) {
    this.controller = new CustomersController(request);
  }

  @logStep('Create customer and get created customer via API')
  async create(token: string, customData?: Partial<ICustomer>) {
    const body = generateCustomerData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    validateSchema(customerSchema, response.body);
    return response.body.Customer;
  }

  @logStep('Delete customer via API')
  async delete(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateDeleteResponse(response);
  }
}
