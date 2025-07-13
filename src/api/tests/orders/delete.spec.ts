import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { errorResponseSchema } from 'data/schemas';
import { test } from 'fixtures';
import { IOrderFromResponse, IResponse, IResponseFields } from 'types';
import { generateID } from 'utils';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Delete]', () => {
  let token = '';
  let order: IOrderFromResponse;
  let deleteResponse: IResponse<object | null>;

  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
  });

  test.afterEach(async ({ customersApiService, productsApiService, ordersApiService }) => {
    if (deleteResponse.status === STATUS_CODES.DELETED) {
      await customersApiService.delete(order.customer._id, token);
      await Promise.all(order.products.map((product) => productsApiService.delete(product._id, token)));
    } else {
      ordersApiService.clear(token);
    }
  });

  test(
    'Should delete order with valid id and token',
    { tag: ['@001_O_DELETE_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      deleteResponse = await ordersController.delete(order._id, token);
      validateDeleteResponse(deleteResponse as IResponse<null>);
      const getOrderByIdResponse = await ordersController.getById(order._id, token);
      validateResponse(getOrderByIdResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(order._id));
    },
  );

  test(
    'Should not delete order with invalid id (hex format)',
    { tag: ['@002_O_DELETE_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const invalidIdHexFormat = generateID();
      deleteResponse = await ordersController.delete(invalidIdHexFormat, token);
      validateResponse(
        deleteResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.ORDER_NOT_FOUND(invalidIdHexFormat),
      );
      validateSchema(errorResponseSchema, deleteResponse.body as unknown as IResponse<IResponseFields>);
      const getOrderByIdResponse = await ordersController.getById(order._id, token);
      validateResponse(getOrderByIdResponse, STATUS_CODES.OK, true, null);
    },
  );

  test(
    'Should not delete order with invalid id format',
    { tag: ['@003_O_DELETE_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const invalidId = '123';
      deleteResponse = await ordersController.delete(invalidId, token);
      validateResponse(
        deleteResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.ORDER_NOT_FOUND(invalidId),
      );
      validateSchema(errorResponseSchema, deleteResponse.body as unknown as IResponse<IResponseFields>);
      const getOrderByIdResponse = await ordersController.getById(order._id, token);
      validateResponse(getOrderByIdResponse, STATUS_CODES.OK, true, null);
    },
  );

  test(
    'Should not delete order without id',
    { tag: ['@004_O_DELETE_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const emptyId = '';
      deleteResponse = await ordersController.delete(emptyId, token);
      validateResponse(
        deleteResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.ORDER_NOT_FOUND(emptyId),
      );
      validateSchema(errorResponseSchema, deleteResponse.body as unknown as IResponse<IResponseFields>);
      const getOrderByIdResponse = await ordersController.getById(order._id, token);
      validateResponse(getOrderByIdResponse, STATUS_CODES.OK, true, null);
    },
  );

  test(
    'Should not delete order with invalid token',
    { tag: ['@005_O_DELETE_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const invalidToken = 'invalid_tokem';
      deleteResponse = await ordersController.delete(order._id, invalidToken);
      validateResponse(
        deleteResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.INVALID_TOKEN,
      );
      validateSchema(errorResponseSchema, deleteResponse.body as unknown as IResponse<IResponseFields>);
      const getOrderByIdResponse = await ordersController.getById(order._id, token);
      validateResponse(getOrderByIdResponse, STATUS_CODES.OK, true, null);
    },
  );

  test(
    'Should not delete order without token',
    { tag: ['@006_O_DELETE_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const emptyToken = '';
      deleteResponse = await ordersController.delete(order._id, emptyToken);
      validateResponse(
        deleteResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.UNAUTHORIZED,
        false,
        API_ERRORS.EMPTY_TOKEN,
      );
      validateSchema(errorResponseSchema, deleteResponse.body as unknown as IResponse<IResponseFields>);
      const getOrderByIdResponse = await ordersController.getById(order._id, token);
      validateResponse(getOrderByIdResponse, STATUS_CODES.OK, true, null);
    },
  );
});
