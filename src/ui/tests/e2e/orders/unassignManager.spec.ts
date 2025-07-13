import { apiConfig } from 'config';
import { ALERTS, STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[E2E] [UI] [Orders] [Assign Manager]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const userId = '6806a732d006ba3d475fc11c';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });
  test(
    'Should be possible to unassign manager from order "Draft"',
    { tag: ['@001_O_UM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, userId, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickUnassignManager();
      await orderDetailsPage.unassignModal.waitForOpened();
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.UNASSIGN_MANAGER(order._id),
        async () => await orderDetailsPage.unassignModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Manager name should not be displayed').toBe('Click to select manager');
    },
  );

  test(
    'Should be possible to unassign manager from order "In Process"',
    { tag: ['@002_O_UM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, userId, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickUnassignManager();
      await orderDetailsPage.unassignModal.waitForOpened();
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.UNASSIGN_MANAGER(order._id),
        async () => await orderDetailsPage.unassignModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Manager name should not be displayed').toBe('Click to select manager');
    },
  );

  test(
    'Should be possible to unassign manager from order "Canceled"',
    { tag: ['@003_O_UM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, userId, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickUnassignManager();
      await orderDetailsPage.unassignModal.waitForOpened();
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.UNASSIGN_MANAGER(order._id),
        async () => await orderDetailsPage.unassignModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Manager name should not be displayed').toBe('Click to select manager');
    },
  );

  test(
    'Should be possible to unassign manager from order "Partially Received"',
    { tag: ['@004_O_UM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, userId, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickUnassignManager();
      await orderDetailsPage.unassignModal.waitForOpened();
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.UNASSIGN_MANAGER(order._id),
        async () => await orderDetailsPage.unassignModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Manager name should not be displayed').toBe('Click to select manager');
    },
  );

  test(
    'Should be possible to unassign manager from order "Received"',
    { tag: ['@005_O_UM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, userId, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickUnassignManager();
      await orderDetailsPage.unassignModal.waitForOpened();
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.UNASSIGN_MANAGER(order._id),
        async () => await orderDetailsPage.unassignModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Manager name should not be displayed').toBe('Click to select manager');
    },
  );
});
