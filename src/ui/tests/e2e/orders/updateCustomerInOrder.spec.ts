import { apiConfig } from 'config';
import { ALERTS, STATUS_CODES, TAGS } from 'data';
import { test, expect } from 'fixtures';
import { ICustomerFromResponse, IOrderFromResponse } from 'types';
import { convertCustomerToUIData } from 'data/orders';

test.describe('[E2E] [UI] [Orders] [Update Customer In Order]', () => {
  let token = '';
  let order: IOrderFromResponse;
  let customer: ICustomerFromResponse;
  test.beforeEach(async ({ signInApiService, customersApiService }) => {
    token = await signInApiService.getAuthToken();
    customer = await customersApiService.create(token);
  });
  test.afterEach(async ({ ordersApiService, customersApiService }) => {
    await ordersApiService.clear(token);
    await customersApiService.delete(customer._id, token);
  });
  test(
    'Sould update customer if order is in Draft status',
    { tag: ['@001_O_UC_E2E', TAGS.E2E] },
    async ({ ordersApiService, orderDetailsPage }) => {
      order = await ordersApiService.createDraft(token);
      await orderDetailsPage.openPage('ORDER_DETAILS', order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.waitForOpened();
      await orderDetailsPage.editCustomerModal.selectCustomer(customer.name);
      const response = await orderDetailsPage.interceptResponse(apiConfig.ENDPOINTS.ORDERS_BY_ID(order._id), async () =>
        orderDetailsPage.editCustomerModal.clickSaveButton(),
      );
      expect(response.status).toBe(STATUS_CODES.OK);
      await orderDetailsPage.waitForOpened();
      orderDetailsPage.waitForNotification(ALERTS.ORDER_UPDATED);
      expect(await orderDetailsPage.getCustomer(), 'New products should match expected').toMatchObject(
        convertCustomerToUIData(customer),
      );
    },
  );
});
