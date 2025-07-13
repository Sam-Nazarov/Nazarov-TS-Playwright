import { ALERTS, TAGS } from 'data';
import { DELIVERY_CONDITIONS, ORDER_STATUSES } from 'data/orders';
import { test, expect } from 'fixtures';
import { IOrderFromResponse } from 'types';
import { generateValidDeliveryDate } from 'utils';

test.describe('[E2E] [UI] [Orders] [Status Change]', () => {
  let token = '';
  let order: IOrderFromResponse;
  const managerData = { id: '68196484d006ba3d4760a076', name: 'Barys Kotau' };

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });
  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should cancel order on Draft',
    { tag: ['@001_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.cancelModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;

      expect(status, 'Verify order status is Cancelled').toBe(ORDER_STATUSES.CANCELED);
      await expect(orderDetailsPage.reopenOrderButton, 'Verify Reopen button is shown').toBeVisible();
    },
  );

  test(
    'Should reopen cancelled order to Draft',
    { tag: ['@002_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createCanceled(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickReopen();
      await orderDetailsPage.reopenModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_REOPEN);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Draft').toBe(ORDER_STATUSES.DRAFT);
      await expect(orderDetailsPage.cancelOrderButton, 'Verify Cancel button is shown').toBeVisible();
    },
  );

  test(
    'Should cancel an order on Draft with delivery',
    { tag: ['@003_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraftWithDelivery(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.cancelModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Cancelled').toBe(ORDER_STATUSES.CANCELED);
      await expect(orderDetailsPage.reopenOrderButton, 'Verify Reopen button is visible').toBeVisible();
    },
  );

  test(
    'Should cancel an order In progress',
    { tag: ['@004_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.cancelModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Cancelled').toBe(ORDER_STATUSES.CANCELED);
      await expect(orderDetailsPage.reopenOrderButton, 'Verify Reopen button is visible').toBeVisible();
    },
  );

  test(
    'Should cancel an order In process',
    { tag: ['@005_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickCancel();
      await orderDetailsPage.cancelModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Cancelled').toBe(ORDER_STATUSES.CANCELED);
      await expect(orderDetailsPage.reopenOrderButton, 'Verify Reopen is visible').toBeVisible();
    },
  );

  test(
    'Should move the order from Draft to Draft with delivery',
    { tag: ['@006_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage, deliveryPage }) => {
      order = await ordersApiService.createDraft(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.clickDeliveryButton();
      const delivery = {
        condition: DELIVERY_CONDITIONS.DELIVERY,
        finalDate: generateValidDeliveryDate(),
      };
      await deliveryPage.fillInputs({ ...delivery, location: 'Home' });
      await deliveryPage.clickSave();
      await orderDetailsPage.waitForNotification(ALERTS.DELIVERY_SAVED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Draft').toBe(ORDER_STATUSES.DRAFT);
    },
  );

  test(
    'Should move an order from draft to In process',
    { tag: ['@007_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraftWithDelivery(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickProcess();
      await orderDetailsPage.processModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_PROCESS);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is In Process').toBe(ORDER_STATUSES.IN_PROCESS);
    },
  );

  test(
    'Should Receive order from In process with all products',
    { tag: ['@008_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token);
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.markAllproducts('check');
      await orderDetailsPage.clickSaveButton();
      await orderDetailsPage.waitForNotification(ALERTS.PRODUCTS_RECEIVED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Received').toBe(ORDER_STATUSES.RECEIVED);
    },
  );

  test(
    'Should Partially Receive order from In process with part of the products',
    { tag: ['@009_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createInProcess(token, { productCount: 2 });
      order = await ordersApiService.assignManager(order._id, managerData.id, token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.markSingleProduct(order.products[1].name, 'check');
      await orderDetailsPage.clickSaveButton();
      await orderDetailsPage.waitForNotification(ALERTS.PRODUCTS_RECEIVED);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Partially received').toBe(ORDER_STATUSES.PARTIALLY_RECEIVED);
    },
  );

  test(
    'Should Reopen from Orders list',
    { tag: ['@010_O_SC_E2E', TAGS.E2E] },
    async ({ ordersApiService, ordersPage, orderDetailsPage }) => {
      order = await ordersApiService.createCanceled(token);
      await ordersPage.openPage('ORDERS');
      await ordersPage.clickReopenOrder(order._id);
      await ordersPage.waitForOpened();
      await ordersPage.reopenModal.submit();
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_REOPEN);
      const status = (await orderDetailsPage.getOrderValues()).status;
      expect(status, 'Verify order status is Draft').toBe(ORDER_STATUSES.DRAFT);
    },
  );
});
