import { apiConfig } from 'config';
import { ALERTS, STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';

test.describe('[E2E] [UI] [Orders] [Assign Manager]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const firstMangerData = { id: '6806a732d006ba3d475fc11c', name: 'Aleksandr Zhuk' };
  const secondUserId = { id: '6840b3b41c508c5d5e50fd51', name: 'a a' };

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should be possible to edit manager in order',
    { tag: ['@001_O_EM_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, firstMangerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditAssignManager();
      await orderDetailsPage.assignManagerModal.waitForOpened();
      await orderDetailsPage.assignManagerModal.select(secondUserId.id);
      const response = await orderDetailsPage.interceptResponse(
        apiConfig.ENDPOINTS.ASSIGN_MANAGER(order._id, secondUserId.id),
        async () => await orderDetailsPage.assignManagerModal.submit(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
      const orderValues = await orderDetailsPage.getOrderValues();
      expect(orderValues.assignedManagerName, 'Updated manager name should be displayed').toBe(secondUserId.name);
    },
  );
});
