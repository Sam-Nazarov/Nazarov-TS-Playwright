import { apiConfig } from 'config';
import { ALERTS, TAGS } from 'data';
import { convertCustomerToUIData } from 'data/orders';
import {
  getAllCustomersResponselist,
  errorResponseForCustomerDetailsInOrder,
  orderInDefaultStatus,
  errorResponseForUpdateCustomer,
} from 'data/orders/testData';
import { expect, test } from 'fixtures';

test.describe('[Integration] [Orders] [Customer Details]', () => {
  test(
    'Should send correct request after clicking edit customer in order (getAllCustomers)',
    { tag: ['@009_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      const request = await orderDetailsPage.interceptRequest(apiConfig.ENDPOINTS.CUSTOMERS_ALL, () =>
        orderDetailsPage.editCutomerButton.click(),
      );
      expect(request.url()).toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL);
    },
  );

  errorResponseForCustomerDetailsInOrder.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(el.Response, el.statusCode);
      await orderDetailsPage.editCutomerButton.click();
      await orderDetailsPage.waitForNotification(ALERTS.UPDATE_CUSTOMRE_IS_UNABLE);
    });
  });

  test(
    'Should update Customer Details after updating customer',
    { tag: ['@013_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(getAllCustomersResponselist);
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.selectCustomer(getAllCustomersResponselist.Customers[1].name);
      const UpdatedOrder = structuredClone(orderInDefaultStatus);
      UpdatedOrder.Order.customer = getAllCustomersResponselist.Customers[1];
      await mock.orderDetails(UpdatedOrder.Order._id, UpdatedOrder);
      await orderDetailsPage.editCustomerModal.clickSaveButton();
      await orderDetailsPage.waitForOpened();
      expect(convertCustomerToUIData(UpdatedOrder.Order.customer)).toMatchObject(await orderDetailsPage.getCustomer());
    },
  );

  test(
    'Should display notification after successful update',
    { tag: ['@014_O_CM_UI', TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(getAllCustomersResponselist);
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.selectCustomer(getAllCustomersResponselist.Customers[1].name);
      const UpdatedOrder = structuredClone(orderInDefaultStatus);
      UpdatedOrder.Order.customer = getAllCustomersResponselist.Customers[1];
      await mock.orderDetails(UpdatedOrder.Order._id, UpdatedOrder);
      await orderDetailsPage.editCustomerModal.clickSaveButton();
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_UPDATED);
    },
  );

  errorResponseForUpdateCustomer.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await mock.allCustomers(getAllCustomersResponselist);
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.selectCustomer(getAllCustomersResponselist.Customers[1].name);
      await mock.orderDetails(orderInDefaultStatus.Order._id, el.response, el.statusCode);
      await orderDetailsPage.editCustomerModal.saveButton.click();
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.waitForNotification(ALERTS.UPDATE_CUSTOMER_FAILED);
    });
  });
});
