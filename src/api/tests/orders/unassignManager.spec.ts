import { USER_ID } from 'config';
import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { ORDER_HISTORY_ACTIONS } from 'data/orders';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Unassign Manager | status Draft]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const managerID = USER_ID;
  let orderWithManager: IOrderFromResponse;

  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
    orderWithManager = await ordersApiService.assignManager(order._id, managerID, token);
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should unassign manager with all valid data (token, orderId)',
    {
      tag: ['@001_O_M_UN_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const response = await ordersController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should not unassign manager with invalid token',
    {
      tag: ['@002_O_M_UN_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const incorrectToken = '12345';
      const response = await ordersController.unassignManager(orderWithManager._id, incorrectToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not unassign manager with missing token',
    {
      tag: ['@003_O_M_UN_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const emptyToken = '';
      const response = await ordersController.unassignManager(orderWithManager._id, emptyToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not unassign manager with missing orderId',
    {
      tag: ['@004_O_M_UN_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const emptyOrderId = '';
      const response = await ordersController.unassignManager(emptyOrderId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(emptyOrderId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not unassign manager with invalid orderId format (not hex24, 12-byte string, int)',
    {
      tag: ['@005_O_M_UN_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const invalidOrderId = '12345';
      const response = await ordersController.unassignManager(invalidOrderId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(invalidOrderId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not unassign manager with  nonexistent orderId valid format',
    {
      tag: ['@006_O_M_UN_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const nonexistentOrderId = generateID();
      const response = await ordersController.unassignManager(nonexistentOrderId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(nonexistentOrderId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should allow unassigning when no manager is assigned (no error, history added)',
    {
      tag: ['@007_O_M_UN_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const response = await ordersController.unassignManager(order._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );
});

test.describe('[API] [Orders] [Unassign Manager  with all valid data| Other statuses]', () => {
  let token = '';
  const managerID = USER_ID;

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should unassign manager | Status: Canceled Order',
    {
      tag: ['@008_O_M_UN_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const order = await ordersApiService.createCanceled(token);
      const orderWithManager = await ordersApiService.assignManager(order._id, managerID, token);
      const response = await ordersController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager | Status: Draft with delivery',
    {
      tag: ['@009_O_M_UN_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const order = await ordersApiService.createDraftWithDelivery(token);
      const orderWithManager = await ordersApiService.assignManager(order._id, managerID, token);
      const response = await ordersController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager | Status: Inprocess Order',
    {
      tag: ['@010_O_M_UN_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const order = await ordersApiService.createInProcess(token);
      const orderWithManager = await ordersApiService.assignManager(order._id, managerID, token);
      const response = await ordersController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager | Status: Partially Received Order',
    {
      tag: ['@011_O_M_UN_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const order = await ordersApiService.createPartiallyReceived(token);
      const orderWithManager = await ordersApiService.assignManager(order._id, managerID, token);
      const response = await ordersController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager  | Status: Received',
    {
      tag: ['@012_O_M_UN_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      const order = await ordersApiService.createReceived(token);
      const orderWithManager = await ordersApiService.assignManager(order._id, managerID, token);
      const response = await ordersController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );
});
