import { TAGS } from 'data';
import { convertCustomerToUIData } from 'data/orders';
import { customerDetails, orderInDefaultStatus, orderWithDifferentStatuses } from 'data/orders/testData';
import { expect, test } from 'fixtures';

test.describe('[Component] [Orders] [Customer Details]', () => {
  test(
    'Should open edit customer modal after clicking on the edit button',
    { tag: ['@005_O_CM_UI', TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);
      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickEditCustomerButton();
      await orderDetailsPage.editCustomerModal.waitForOpened();
    },
  );

  test(
    'Should display correct title in Customer Details card',
    { tag: ['@010_O_CM_UI', TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);

      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.customerDetailsTitle).toHaveText('Customer Details');
    },
  );

  customerDetails.forEach((el) =>
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response.Order._id, el.response);
      await orderDetailsPage.open(el.response.Order._id);
      await orderDetailsPage.waitForOpened();
      const customer = await orderDetailsPage.getCustomer();
      expect(convertCustomerToUIData(el.response.Order.customer)).toMatchObject(customer);
    }),
  );

  test(
    'Should display edit button if order is in Draft status',
    { tag: ['@003_O_CM_UI', TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDefaultStatus.Order._id, orderInDefaultStatus);

      await orderDetailsPage.open(orderInDefaultStatus.Order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).toBeVisible();
    },
  );

  orderWithDifferentStatuses.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response.Order._id, el.response);
      await orderDetailsPage.open(el.response.Order._id);
      await orderDetailsPage.waitForOpened();
      expect(orderDetailsPage.editCutomerButton).not.toBeVisible();
    });
  });
});
