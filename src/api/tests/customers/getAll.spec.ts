import { expect, test } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateResponse } from 'utils/validations/responseValidation.utils';
import { TAGS } from 'data/tags.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { API_ERRORS } from 'data/errors.data';
import { errorResponseSchema } from 'data/schemas/errorResponse.schema';
import { validateSchema } from 'utils/validations/schemaValidation.utils';
import { allCustomersSchema } from 'data/schemas/customers/allCustomers.schema';

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
    'Should GET All Customers without params ( no pagination, filters or sorting)',
    { tag: ['@1_C_GET_ALL_API', TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const responseGetAll = await customersController.getAll(token);
      validateResponse(responseGetAll, STATUS_CODES.OK, true, null);
      validateSchema(allCustomersSchema, responseGetAll.body);
      const productFromResponse = responseGetAll.body.Customers.find((cust) => cust._id === customer._id);
      expect.soft(productFromResponse).toEqual(customer);
    },
  );

  test(
    'Should NOT  GET  All  customers   with empty  authorization token',
    { tag: ['@3_C_GET_ALL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const emptyToken = '';
      const responseGetID = await customersController.getAll(emptyToken);
      validateResponse(responseGetID, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );

  test(
    'Should NOT  GET  All  customers   with incorrect / invalid  authorization token',
    { tag: ['@4_C_GET_ALL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const incorrectToken = '12345';
      const responseGetID = await customersController.getAll(incorrectToken);
      validateResponse(responseGetID, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );
});
