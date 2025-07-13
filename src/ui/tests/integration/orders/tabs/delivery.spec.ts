import { generateCustomerData } from 'data/customers';
import { generateProductData } from 'data/products';
import { convertToDate, generateID } from 'utils';
import { expect, test } from 'fixtures';
import { TAGS } from 'data';
import { deliveryTabTestdata } from 'data/orders/testData';
import { generateDeliveryData, ORDER_STATUSES } from 'data/orders';
import { DeliveryHistoryUI, IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration] Delivery tab', () => {
  deliveryTabTestdata.forEach(async ({ statusName, idTag, isBtn, btnName, mockOrder }) => {
    test(
      `Delivery button is ${isBtn ? `visible with ${btnName} text` : 'not visible'} for order in ${statusName} status`,
      { tag: [idTag, TAGS.UI, TAGS.INTEGRATION, TAGS.REGRESSION] },
      async ({ orderDetailsPage, mock }) => {
        await mock.orderDetails(mockOrder._id, {
          Order: {
            customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
            products: [{ ...generateProductData(), _id: generateID(), received: false }],
            createdOn: new Date().toISOString(),
            total_price: 100,
            comments: [],
            history: [],
            assignedManager: null,
            ...mockOrder,
          },
          IsSuccess: true,
          ErrorMessage: null,
        });

        await orderDetailsPage.open(mockOrder._id);
        await orderDetailsPage.clickDeliveryTab();
        await orderDetailsPage.deliveryTab.waitForOpened();

        await expect.soft(orderDetailsPage.deliveryTab.deliveryBtn).toBeVisible({ visible: isBtn });
        if (isBtn) {
          await expect.soft(orderDetailsPage.deliveryTab.deliveryBtn).toHaveText(btnName);
        }
      },
    );
  });

  test(
    'Should display "-" for each field if Delivery is null',
    { tag: ['@7_O_DLVR_INTGR', TAGS.UI, TAGS.INTEGRATION, TAGS.REGRESSION] },
    async ({ mock, orderDetailsPage }) => {
      const mockOrder: IOrderResponse = {
        Order: {
          customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
          products: [{ ...generateProductData(), _id: generateID(), received: false }],
          createdOn: new Date().toISOString(),
          total_price: 100,
          comments: [],
          history: [],
          assignedManager: null,
          status: ORDER_STATUSES.DRAFT,
          delivery: null,
          _id: generateID(),
        },
        IsSuccess: true,
        ErrorMessage: null,
      };
      const expectedValues: DeliveryHistoryUI = {
        condition: '-',
        finalDate: '-',
        address: {
          country: '-',
          city: '-',
          street: '-',
          house: '-',
          flat: '-',
        },
      };
      await mock.orderDetails(mockOrder.Order._id, mockOrder);

      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actualValues = await orderDetailsPage.deliveryTab.getDeliveryInfo();

      expect.soft(actualValues).toEqual(expectedValues);
    },
  );

  test(
    'Should display delivery info correctly',
    { tag: ['@8_O_DLVR_INTGR', TAGS.UI, TAGS.INTEGRATION, TAGS.REGRESSION] },
    async ({ mock, orderDetailsPage }) => {
      const mockOrder: IOrderResponse = {
        Order: {
          customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
          products: [{ ...generateProductData(), _id: generateID(), received: false }],
          createdOn: new Date().toISOString(),
          total_price: 100,
          comments: [],
          history: [],
          assignedManager: null,
          status: ORDER_STATUSES.DRAFT,
          delivery: generateDeliveryData(),
          _id: generateID(),
        },
        IsSuccess: true,
        ErrorMessage: null,
      };
      const expectedValues: DeliveryHistoryUI = {
        ...(mockOrder.Order.delivery as DeliveryHistoryUI),
        finalDate: convertToDate(mockOrder.Order.delivery!.finalDate),
      };
      await mock.orderDetails(mockOrder.Order._id, mockOrder);

      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actualValues = await orderDetailsPage.deliveryTab.getDeliveryInfo();

      expect.soft(actualValues).toEqual(expectedValues);
    },
  );
});
