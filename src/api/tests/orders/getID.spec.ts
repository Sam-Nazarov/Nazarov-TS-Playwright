import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';
import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { errorResponseSchema, orderSchema } from 'data/schemas';

test.describe('[API] [Orders] [GET by ID]', () => {
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should get order with valid id and token',
    { tag: ['@001_O_GET_API', TAGS.SMOKE, TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const responseGetID = await ordersController.getById(order._id, token);
      validateResponse(responseGetID, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, responseGetID.body);
      expect.soft(responseGetID.body.Order).toEqual(order);
    },
  );

  test(
    'Should not get order with non-existent id (hex format)',
    { tag: ['@002_O_GET_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const nonexistentID = generateID();
      const responseGetID = await ordersController.getById(nonexistentID, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(nonexistentID));
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );

  test(
    'Should not get order with invalid id format (not hex, 12-byte string, int)',
    { tag: ['@003_O_GET_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const invalidID = '123';
      const responseGetID = await ordersController.getById(invalidID, token);
      validateResponse(responseGetID, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(invalidID));
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );

  test(
    'Should not get order with invalid token',
    { tag: ['@005_O_GET_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const incorrectToken = '12345';
      const responseGetID = await ordersController.getById(order._id, incorrectToken);
      validateResponse(responseGetID, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );

  test(
    'Should not get order without token',
    { tag: ['@006_O_GET_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const emptyToken = '';
      const responseGetID = await ordersController.getById(order._id, emptyToken);
      validateResponse(responseGetID, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, responseGetID.body);
    },
  );
});
