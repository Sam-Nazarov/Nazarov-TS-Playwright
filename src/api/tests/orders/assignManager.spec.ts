import { USER_ID } from 'config';
import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { ORDER_HISTORY_ACTIONS } from 'data/orders';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Assign Manager | status Draft]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const managerID = USER_ID;

  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should assign manager with all valid data (token, valid orderId, managerId)',
    {
      tag: ['@001_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const response = await ordersController.assignManager(order._id, managerID, token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager ID matches the expected managerID', () => {
        expect.soft(response.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should reassign manager with all valid data (token, valid orderId, managerId)',
    {
      tag: ['@002_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      await ordersController.assignManager(order._id, managerID, token);
      const secondAssignResponse = await ordersController.assignManager(order._id, managerID, token);
      validateResponse(secondAssignResponse, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, secondAssignResponse.body);

      await test.step('Validated that Reassigned manager ID matches the expected managerID', () => {
        expect.soft(secondAssignResponse.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(secondAssignResponse.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(secondAssignResponse.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should not assign manager with invalid token',
    {
      tag: ['@003_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const incorrectToken = '12345';
      const response = await ordersController.assignManager(order._id, managerID, incorrectToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager with missing token',
    {
      tag: ['@004_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const emptyToken = '';
      const response = await ordersController.assignManager(order._id, managerID, emptyToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager with missing orderId',
    {
      tag: ['@005_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const emptyOrderId = '';
      const response = await ordersController.assignManager(emptyOrderId, managerID, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(emptyOrderId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager with invalid orderId format (not hex24, 12-byte string, int)',
    {
      tag: ['@006_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const invalidOrderId = '12345';
      const response = await ordersController.assignManager(invalidOrderId, managerID, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(invalidOrderId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager with non-existent orderId (valid format)',
    {
      tag: ['@007_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const nonexistentOrderId = generateID();
      const response = await ordersController.assignManager(nonexistentOrderId, managerID, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.ORDER_NOT_FOUND(nonexistentOrderId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager without managerId',
    {
      tag: ['@010_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const emptyManagerId = '';
      const response = await ordersController.assignManager(order._id, emptyManagerId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.MANAGER_NOT_FOUND(emptyManagerId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager with invalid managerId',
    {
      tag: ['@011_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const invalidManagerId = '12345';
      const response = await ordersController.assignManager(order._id, invalidManagerId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.MANAGER_NOT_FOUND(invalidManagerId));
      validateSchema(errorResponseSchema, response.body);
    },
  );

  test(
    'Should not assign manager with nonexistent managerId',
    {
      tag: ['@012_O_COMM_PUT_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const nonexistentManagerId = generateID();
      const response = await ordersController.assignManager(order._id, nonexistentManagerId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.MANAGER_NOT_FOUND(nonexistentManagerId));
      validateSchema(errorResponseSchema, response.body);
    },
  );
});

test.describe('[API] [Orders] [Assign Manager with all valid data| Other statuses]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const managerID = USER_ID;

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should assign manager | Status: Canceled Order',
    {
      tag: ['@013_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createCanceled(token);
      const response = await ordersController.assignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager ID matches the expected managerID', () => {
        expect.soft(response.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager | Status: Draft with delivery',
    {
      tag: ['@014_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createDraftWithDelivery(token);
      const response = await ordersController.assignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);
      await test.step('Validated that assigned manager ID matches the expected managerID', () => {
        expect.soft(response.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager | Status: Inprocess Order',
    {
      tag: ['@015_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createInProcess(token);
      const response = await ordersController.assignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager ID matches the expected managerID', () => {
        expect.soft(response.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager | Status: Partialy Received Order',
    {
      tag: ['@016_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createPartiallyReceived(token);
      const response = await ordersController.assignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager ID matches the expected managerID', () => {
        expect.soft(response.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager | Status: Received',
    {
      tag: ['@017_O_M_A_PUT_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController, ordersApiService }) => {
      order = await ordersApiService.createReceived(token);
      const response = await ordersController.assignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body);

      await test.step('Validated that assigned manager ID matches the expected managerID', () => {
        expect.soft(response.body.Order.assignedManager, "Assigned manager isn't found").toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Validated that order history contains MANAGER_ASSIGNED action', () => {
        expect.soft(response.body.Order.history[0].action).toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );
});
