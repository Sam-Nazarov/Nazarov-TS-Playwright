import { test } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateDeleteResponse, validateResponse } from 'utils/validations/responseValidation.utils';
import { TAGS } from 'data/tags.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { API_ERRORS } from 'data/errors.data';
import { IResponse, IResponseFields } from 'types/api.types';
import { generateID } from 'utils';
import { errorResponseSchema } from 'data/schemas/errorResponse.schema';
import { validateSchema } from 'utils/validations/schemaValidation.utils';

test.describe('[API] [Customers] [Delete]', () => {
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
    'Should DELETE the customer by correct ID',
    { tag: ['@1_C_DL_API', TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const responseDelete = await customersController.delete(customer._id, token);
      validateDeleteResponse(responseDelete);

      const responseGetID = await customersController.getById(customer._id, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, API_ERRORS.CUSTOMER_NOT_FOUND(customer._id));
    },
  );

  test(
    'Should NOT delete customer with a non-existent ID',
    { tag: ['@3_C_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const nonexistentID = generateID();
      const responseDelete = await customersController.delete(nonexistentID, token);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.CUSTOMER_NOT_FOUND(nonexistentID),
      );
      validateSchema(errorResponseSchema, responseDelete.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    'Should NOT delete customer with an invalid ID',
    { tag: ['@4_C_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const invalidID = '123';
      const responseDelete = await customersController.delete(invalidID, token);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.CUSTOMER_NOT_FOUND(invalidID),
      );
      validateSchema(errorResponseSchema, responseDelete.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    'Should NOT delete  customer with correct ID  and  empty  authorization token',
    { tag: ['@6_C_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const emptyToken = '';
      const responseDelete = await customersController.delete(customer._id, emptyToken);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.EMPTY_TOKEN,
      );
      validateSchema(errorResponseSchema, responseDelete.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    'Should NOT delete  customer with correct ID  and  incorrect / invalid  authorization token',
    { tag: ['@7_C_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController }) => {
      const incorrectToken = '12345';
      const responseDelete = await customersController.delete(customer._id, incorrectToken);
      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.INVALID_TOKEN,
      );
      validateSchema(errorResponseSchema, responseDelete.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    'Should return 400 error when customer is added to order',
    { tag: ['@8_C_DL_API', TAGS.API, TAGS.REGRESSION] },
    async ({ customersController, productsApiService, ordersApiService, ordersController }) => {
      const product = (await productsApiService.create(token))._id;
      const orderId = (await ordersController.create({ customer: customer._id, products: [product] }, token)).body.Order
        ._id;

      const responseDelete = await customersController.delete(customer._id, token);

      validateResponse(
        responseDelete as unknown as IResponse<IResponseFields>,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.CUSTOMER_IN_ORDER,
      );
      validateSchema(errorResponseSchema, responseDelete.body as unknown as IResponse<IResponseFields>);

      await ordersApiService.deleteOrder(orderId, token);
      await productsApiService.delete(product, token);
    },
  );
});
