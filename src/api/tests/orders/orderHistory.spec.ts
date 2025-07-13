import { USER_ID } from 'config';
import { STATUS_CODES, TAGS } from 'data';
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderFromResponse, IOrderHistoryItem } from 'types';
import _ from 'lodash';
import { extractIds } from 'utils';

type TestOrderHistoryItem = Omit<IOrderHistoryItem, 'performer' | 'changedOn'> & { performer: string };

function prepareExpected(order: IOrderFromResponse, action: ORDER_HISTORY_ACTIONS): TestOrderHistoryItem {
  return {
    status: order.status,
    customer: order.customer._id,
    products: order.products,
    total_price: order.total_price,
    delivery: order.delivery,
    action,
    performer: USER_ID,
    assignedManager: order.assignedManager,
  };
}

function prepareActual(item: IOrderHistoryItem): TestOrderHistoryItem {
  return {
    ..._.omit(item, ['changedOn']),
    performer: item.performer._id,
  };
}

async function checkHistoryItem(order: IOrderFromResponse, action: ORDER_HISTORY_ACTIONS) {
  const expected = prepareExpected(order, action);
  let createdHistoryItem: IOrderHistoryItem | undefined;

  test.step('Find created history item', () => {
    createdHistoryItem = order.history.find((item) => item.action === action);
    expect(createdHistoryItem, "History item isn't found").toBeDefined();
  });

  const actual = prepareActual(createdHistoryItem!);

  test.step('Validate created history item', () => {
    expect(actual, 'History item is invalid').toEqual(expected);
  });
}

test.describe('[API] [Orders] [History]', () => {
  let token = '';
  let newProductId = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService, productsApiService, productsController }) => {
    await ordersApiService.clear(token);

    if (newProductId) {
      const isProductExists = (await productsController.getById(newProductId, token)).status === STATUS_CODES.OK;
      if (isProductExists) {
        await productsApiService.delete(newProductId, token);
      }
    }
  });

  test(
    'Should store a record if order has been created',
    { tag: ['@001_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createDraft(token);

      await checkHistoryItem(order, ORDER_HISTORY_ACTIONS.CREATED);
    },
  );

  test(
    'Should store a record if customer has been changed',
    { tag: ['@002_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createDraft(token);
      const updatedOrder = await ordersApiService.updateByCustomer(order._id, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.CUSTOMER_CHANGED);
    },
  );

  test(
    'Should store a record if product has been added',
    { tag: ['@003_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService, productsApiService }) => {
      const order = await ordersApiService.createDraft(token);
      newProductId = (await productsApiService.create(token))._id;
      const updatedBody = {
        products: [...extractIds(order.products), newProductId],
        customer: order.customer._id,
      };
      const updatedOrder = await ordersApiService.updateOrder(order._id, updatedBody, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED);
    },
  );

  test(
    'Should store a record if product has been deleted',
    { tag: ['@004_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createDraft(token, { productCount: 2 });
      const updatedBody = {
        products: [order.products[0]._id],
        customer: order.customer._id,
      };
      const updatedOrder = await ordersApiService.updateOrder(order._id, updatedBody, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED);
    },
  );

  test(
    'Should store a record if order has been moved to in process status',
    { tag: ['@005_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const draftOrder = await ordersApiService.createDraftWithDelivery(token);
      const inProcessOrder = await ordersApiService.updateStatus(draftOrder._id, ORDER_STATUSES.IN_PROCESS, token);

      await checkHistoryItem(inProcessOrder, ORDER_HISTORY_ACTIONS.PROCESSED);
    },
  );

  test(
    'Should store a record if delivery has been added',
    { tag: ['@006_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const draftOrder = await ordersApiService.createDraft(token);
      const draftWithDelivery = await ordersApiService.updateDelivery(draftOrder._id, token);

      await checkHistoryItem(draftWithDelivery, ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED);
    },
  );

  test(
    'Should store a record if delivery has been edited',
    { tag: ['@007_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createDraftWithDelivery(token);
      const updatedOrder = await ordersApiService.updateDelivery(order._id, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.DELIVERY_EDITED);
    },
  );

  test(
    'Shoud store a record if order has been partially received',
    { tag: ['@008_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createInProcess(token, { productCount: 2 });
      const updatedOrder = await ordersApiService.receiveProduct(order._id, [order.products[0]._id], token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.RECEIVED);
    },
  );

  test(
    'Should store a record if order has been fully received',
    { tag: ['@009_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createInProcess(token, { productCount: 2 });
      const productIds = extractIds(order.products);
      const updatedOrder = await ordersApiService.receiveProduct(order._id, productIds, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
    },
  );

  test(
    'Should store a record if order has been canceled',
    { tag: ['@010_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createInProcess(token);
      const updatedOrder = await ordersApiService.updateStatus(order._id, ORDER_STATUSES.CANCELED, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.CANCELED);
    },
  );

  test(
    'Should store a record if manager has been assigned',
    { tag: ['@011_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createInProcess(token);
      const updatedOrder = await ordersApiService.assignManager(order._id, USER_ID, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
    },
  );

  test(
    'Should store a record if manager has been unassigned',
    { tag: ['@012_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createInProcess(token);
      let updatedOrder = await ordersApiService.assignManager(order._id, USER_ID, token);
      updatedOrder = await ordersApiService.unassignManager(updatedOrder._id, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
    },
  );

  test(
    'Should store a record if order has been reopened',
    { tag: ['@013_O_OH_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersApiService }) => {
      const order = await ordersApiService.createCanceled(token);
      const updatedOrder = await ordersApiService.updateStatus(order._id, ORDER_STATUSES.DRAFT, token);

      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.REOPENED);
    },
  );
});
