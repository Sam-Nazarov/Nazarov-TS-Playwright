import { expect, test } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateResponse } from 'utils/validations/responseValidation.utils';
import { TAGS } from 'data/tags.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { API_ERRORS } from 'data/errors.data';
import { generateID } from 'utils';
import { errorResponseSchema } from 'data/schemas/errorResponse.schema';
import { validateSchema } from 'utils/validations/schemaValidation.utils';
import { customerSchema } from 'data/schemas/customers/customer.schema';

test.describe('[API] [Customers] [GET by ID]', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeEach(async ({ signInApiService, customersApiService }) => {
    token = await signInApiService.getAuthToken();

    customer = await customersApiService.create(token);
  });

  test.afterEach(async ({ customersController }) => {
    if (!customer._id) return;
    else await customersController.delete(customer._id, token);
  });

  test(
    'Should GET  the customer by correct ID',
    { tag: ['@1_C_GET_ID_API', TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const responseGetID = await customersController.getById(customer._id, token);
      validateResponse(responseGetID, STATUS_CODES.OK, true, null);
      validateSchema(customerSchema, responseGetID.body);
      expect.soft(responseGetID.body.Customer).toEqual(customer);
    },
  );

  test(
    'Should NOT GET customer with a non-existent ID',
    { tag: ['@2_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const nonexistentID = generateID();
      const responseGetID = await customersController.getById(nonexistentID, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, API_ERRORS.CUSTOMER_NOT_FOUND(nonexistentID));
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );

  test(
    ' Should NOT GET customer with INVALID  format ID',
    { tag: ['@3_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const invalidID = '123';
      const responseGetID = await customersController.getById(invalidID, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, API_ERRORS.CUSTOMER_NOT_FOUND(invalidID));
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );

  test(
    'Should NOT GET  customer with correct ID  and  empty  authorization token',
    { tag: ['@4_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const emptyToken = '';
      const responseGetID = await customersController.getById(customer._id, emptyToken);
      validateResponse(responseGetID, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );
  test(
    'Should NOT GET  customer with correct ID  and  incorrect / invalid  authorization token',
    { tag: ['@5_C_GET_ID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const incorrectToken = '12345';
      const responseGetID = await customersController.getById(customer._id, incorrectToken);
      validateResponse(responseGetID, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );
});
