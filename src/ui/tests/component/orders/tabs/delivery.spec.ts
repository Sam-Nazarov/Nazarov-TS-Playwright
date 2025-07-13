import { TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { ORDER_STATUSES, generateDeliveryData } from 'data/orders';
import { generateProductData } from 'data/products';
import { test, expect } from 'fixtures';
import _ from 'lodash';
import { IOrderResponse } from 'types';
import { generateID } from 'utils';

test.describe('[UI] [Orders] [Component] Delivery tab', () => {
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

  test(
    'Title should be "Delivery Information"',
    { tag: ['@1_O_DLVR_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ mock, orderDetailsPage }) => {
      await mock.orderDetails(mockOrder.Order._id, mockOrder);

      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();

      await expect(orderDetailsPage.deliveryTab.deliveryTitle).toHaveText('Delivery Information');
    },
  );

  test(
    "Button 'Edit Delivery' should lead to Edit Delivery page",
    { tag: ['@2_O_DLVR_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ mock, orderDetailsPage }) => {
      const expected = `#/orders/${mockOrder.Order._id}/edit-delivery`;
      await mock.orderDetails(mockOrder.Order._id, mockOrder);

      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actual = await orderDetailsPage.deliveryTab.deliveryBtn.getAttribute('href');

      expect(actual).toBe(expected);
    },
  );

  test(
    "Button 'Schedule Delivery' should lead to Schedule Delivery page",
    { tag: ['@3_O_DLVR_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ mock, orderDetailsPage }) => {
      const expected = `#/orders/${mockOrder.Order._id}/schedule-delivery`;
      const updMockOrder = _.merge(mockOrder, { Order: { delivery: null } });
      await mock.orderDetails(mockOrder.Order._id, updMockOrder);

      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actual = await orderDetailsPage.deliveryTab.deliveryBtn.getAttribute('href');

      expect(actual).toBe(expected);
    },
  );
});
