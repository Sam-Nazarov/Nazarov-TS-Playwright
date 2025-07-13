import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from 'data/orders';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { extractIds, generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Mark Products as Received | from status In Process]', () => {
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should mark all (1>) products as received',
    {
      tag: ['@001_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 5 });
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is RECEIVED', () => {
        expect.soft(response.body.Order.status, 'Order status is not RECEIVED').toEqual(ORDER_STATUSES.RECEIVED);
      });
      await test.step('Validated order history has RECEIVED_ALL action', () => {
        expect
          .soft(response.body.Order.history[0].action, 'Order history action is not RECEIVED_ALL')
          .toBe(ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
      });

      await test.step('Validated order history has RECEIVED status', () => {
        expect
          .soft(response.body.Order.history[0].status, 'Order history status is not RECEIVED')
          .toBe(ORDER_STATUSES.RECEIVED);
      });

      await test.step('Validated all products are marked as received', () => {
        expect
          .soft(
            response.body.Order.products.every((product) => product.received),
            'Not all products are marked as received',
          )
          .toBeTruthy();
      });
    },
  );

  test(
    'Should mark ONE product as received',
    {
      tag: ['@002_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 1 });
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is RECEIVED', () => {
        expect.soft(response.body.Order.status, 'Order status is not RECEIVED').toEqual(ORDER_STATUSES.RECEIVED);
      });

      await test.step('Validated order history has RECEIVED_ALL action and RECEIVED status', () => {
        expect
          .soft(response.body.Order.history[0].action, 'Order history first action is not RECEIVED_ALL')
          .toBe(ORDER_HISTORY_ACTIONS.RECEIVED_ALL);

        expect
          .soft(response.body.Order.history[0].status, 'Order history first status is not RECEIVED')
          .toBe(ORDER_STATUSES.RECEIVED);
      });

      await test.step('Validated product is marked as received', () => {
        expect.soft(response.body.Order.products[0].received, 'Product is not marked as received').toBeTruthy();
      });
    },
  );

  test(
    'Should mark some products (one from two) as  PARTIALLY received',
    {
      tag: ['@003_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 2 });
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, [prodID[0]], token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is PARTIALLY_RECEIVED', () => {
        expect
          .soft(response.body.Order.status, 'Order status is not PARTIALLY_RECEIVED')
          .toEqual(ORDER_STATUSES.PARTIALLY_RECEIVED);
      });

      await test.step('Validated first history action and status', () => {
        expect
          .soft(response.body.Order.history[0].action, 'First order history action is not RECEIVED')
          .toBe(ORDER_HISTORY_ACTIONS.RECEIVED);

        expect
          .soft(response.body.Order.history[0].status, 'First order history status is not PARTIALLY_RECEIVED')
          .toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
      });

      await test.step('Validated first product is received', () => {
        expect.soft(response.body.Order.products[0].received, 'First product is not marked as received').toBeTruthy();
      });

      await test.step('Validated second history action and status', () => {
        expect
          .soft(response.body.Order.history[1].action, 'Second order history action is not PROCESSED')
          .toBe(ORDER_HISTORY_ACTIONS.PROCESSED);

        expect
          .soft(response.body.Order.history[1].status, 'Second order history status is not IN_PROCESS')
          .toBe(ORDER_STATUSES.IN_PROCESS);
      });

      await test.step('Validated second product is not received', () => {
        expect
          .soft(response.body.Order.products[1].received, 'Second product is unexpectedly marked as received')
          .toBeFalsy();
      });
    },
  );

  test(
    'Should mark some products (one from three) twice as  PARTIALLY received',
    {
      tag: ['@004_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 3 });
      const prodID = extractIds(order.products);
      await ordersController.receiveProduct(order._id, [prodID[0]], token);
      const responseSecond = await ordersController.receiveProduct(order._id, [prodID[1]], token);

      validateResponse(responseSecond, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, responseSecond.body);

      await test.step('Validated order status is PARTIALLY_RECEIVED', () => {
        expect
          .soft(responseSecond.body.Order.status, 'Order status is not PARTIALLY_RECEIVED')
          .toEqual(ORDER_STATUSES.PARTIALLY_RECEIVED);
      });

      await test.step('Validated first history action is RECEIVED', () => {
        expect
          .soft(responseSecond.body.Order.history[0].action, 'First order history action is not RECEIVED')
          .toBe(ORDER_HISTORY_ACTIONS.RECEIVED);
      });

      await test.step('Validated first history status is PARTIALLY_RECEIVED', () => {
        expect
          .soft(responseSecond.body.Order.history[0].status, 'First order history status is not PARTIALLY_RECEIVED')
          .toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
      });

      await test.step('Validated first product is received', () => {
        expect
          .soft(responseSecond.body.Order.products[0].received, 'First product is not marked as received')
          .toBeTruthy();
      });

      await test.step('Validated second history action is PROCESSED', () => {
        expect
          .soft(responseSecond.body.Order.history[2].action, 'Second order history action is not PROCESSED')
          .toBe(ORDER_HISTORY_ACTIONS.PROCESSED);
      });

      await test.step('Validated second history status is IN_PROCESS', () => {
        expect
          .soft(responseSecond.body.Order.history[2].status, 'Second order history status is not IN_PROCESS')
          .toBe(ORDER_STATUSES.IN_PROCESS);
      });

      await test.step('Validated third product is not received', () => {
        expect
          .soft(responseSecond.body.Order.products[2].received, 'Third product is unexpectedly marked as received')
          .toBeFalsy();
      });
    },
  );

  test(
    'Should not mark as received if product does not exist in order',
    {
      tag: ['@005_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      const nonExistentProdID = [generateID()];
      const response = await ordersController.receiveProduct(order._id, nonExistentProdID, token);

      validateResponse(
        response,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IS_NOT_REQUESTED(nonExistentProdID[0]),
      );
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received if productID does not valid',
    {
      tag: ['@006_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      const invalidProdID = ['123'];
      const response = await ordersController.receiveProduct(order._id, invalidProdID, token);

      validateResponse(
        response,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IS_NOT_REQUESTED(invalidProdID[0]),
      );
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received if productID is empty',
    {
      tag: ['@007_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      const emptyProdID = [''];
      const response = await ordersController.receiveProduct(order._id, emptyProdID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.PRODUCT_IS_NOT_REQUESTED(emptyProdID[0]));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received with empty token',
    {
      tag: ['@008_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const emptyToken = '';
      order = await ordersApiService.createInProcess(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, emptyToken);

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received with invalid token',
    {
      tag: ['@009_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const invalidToken = '12345';
      order = await ordersApiService.createInProcess(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, invalidToken);

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );
});

test.describe('[API] [Orders] [Mark Products as Received | from  Partialy Received]', () => {
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should mark all products as received',
    {
      tag: ['@010_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated order status is RECEIVED', () => {
        expect.soft(response.body.Order.status, 'Order status is not RECEIVED').toEqual(ORDER_STATUSES.RECEIVED);
      });

      await test.step('Validated order history has RECEIVED_ALL action', () => {
        expect
          .soft(response.body.Order.history[0].action, 'Order history action is not RECEIVED_ALL')
          .toBe(ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
      });

      await test.step('Validated order history has RECEIVED status', () => {
        expect
          .soft(response.body.Order.history[0].status, 'Order history status is not RECEIVED')
          .toBe(ORDER_STATUSES.RECEIVED);
      });

      await test.step('Validated all products are marked as received', () => {
        expect
          .soft(
            response.body.Order.products.every((product) => product.received),
            'Not all products are marked as received',
          )
          .toBeTruthy();
      });
    },
  );

  test(
    'Should not mark as received if product does not exist in order',
    {
      tag: ['@011_O_MR_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      const nonExistentProdID = [generateID()];
      const response = await ordersController.receiveProduct(order._id, nonExistentProdID, token);

      validateResponse(
        response,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IS_NOT_REQUESTED(nonExistentProdID[0]),
      );
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received if productID does not valid',
    {
      tag: ['@012_O_MR_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      const invalidProdID = ['123'];
      const response = await ordersController.receiveProduct(order._id, invalidProdID, token);

      validateResponse(
        response,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.PRODUCT_IS_NOT_REQUESTED(invalidProdID[0]),
      );
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received if productID is empty',
    {
      tag: ['@013_O_MR_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      const emptyProdID = [''];
      const response = await ordersController.receiveProduct(order._id, emptyProdID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.PRODUCT_IS_NOT_REQUESTED(emptyProdID[0]));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received with empty token',
    {
      tag: ['@014_O_MR_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const emptyToken = '';
      order = await ordersApiService.createPartiallyReceived(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, emptyToken);

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark as received with invalid token',
    {
      tag: ['@015_O_MR_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const invalidToken = '12345';
      order = await ordersApiService.createPartiallyReceived(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, invalidToken);

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );
});

test.describe('[API] [Orders] [Mark as Received - Forbidden Statuses: DRAFT, CANCELED, DRAFT WITH DELIVERY, RECEIVED]', () => {
  let token = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should not mark products as received — Order status: DRAFT',
    {
      tag: ['@016_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createDraft(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark products as received - Order status: Draft with Delivery',
    {
      tag: ['@017_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createDraftWithDelivery(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark products as received - Order status: Canceled',
    {
      tag: ['@018_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createCanceled(token);
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, prodID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark products as received — Order status: Received',
    {
      tag: ['@019_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      const prodID = extractIds(order.products);
      const orderReceived = await ordersApiService.receiveProduct(order._id, prodID, token);
      const response = await ordersController.receiveProduct(orderReceived._id, prodID, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );
  test(
    'Should not mark products as partialy received — Order status: DRAFT',
    {
      tag: ['@020_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createDraft(token, { productCount: 2 });
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, [prodID[0]], token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark products as partialy received - Order status: Draft with Delivery',
    {
      tag: ['@021_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createDraftWithDelivery(token, { productCount: 2 });
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, [prodID[0]], token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not mark products as partialy received - Order status: Canceled',
    {
      tag: ['@022_O_MR_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createCanceled(token, { productCount: 2 });
      const prodID = extractIds(order.products);
      const response = await ordersController.receiveProduct(order._id, [prodID[0]], token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_STATUS_INVALID);
      validateSchema(errorResponseSchema, response.body);
    },
  );
});
