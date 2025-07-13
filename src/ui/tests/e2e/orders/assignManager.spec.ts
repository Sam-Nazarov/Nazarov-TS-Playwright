import { apiConfig } from 'config';
import { ALERTS, STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[E2E] [UI] [Orders] [Assign Manager]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const firstMangerData = { id: '6806a732d006ba3d475fc11c', name: 'Aleksandr Zhuk' };

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should be possible to assign manager to order "Draft"',
    { tag: ['@001_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(firstMangerData.id);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, firstMangerData.id),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Assigned manager name should be displayed').toBe(firstMangerData.name);
    },
  );

  test(
    'Should be possible to assign manager to order "In Process"',
    { tag: ['@002_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(firstMangerData.id);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, firstMangerData.id),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Assigned manager name should be displayed').toBe(firstMangerData.name);
    },
  );

  test(
    'Should be possible to assign manager to order "Canceled"',
    { tag: ['@003_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(firstMangerData.id);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, firstMangerData.id),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Assigned manager name should be displayed').toBe(firstMangerData.name);
    },
  );

  test(
    'Should be possible to assign manager to order "Partially Received"',
    { tag: ['@004_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(firstMangerData.id);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, firstMangerData.id),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Assigned manager name should be displayed').toBe(firstMangerData.name);
    },
  );

  test(
    'Should be possible to assign manager to order "Received"',
    { tag: ['@005_O_AM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickAddAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(firstMangerData.id);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, firstMangerData.id),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName).toBe(firstMangerData.name);
    },
  );
});
