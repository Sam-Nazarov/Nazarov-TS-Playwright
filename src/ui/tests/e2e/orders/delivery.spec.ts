import { ALERTS, TAGS } from 'data';
import { COUNTRIES } from 'data/customers';
import { DELIVERY_CONDITIONS, generateDeliveryData, SHOP_ADDRESS_BY_COUNTRY } from 'data/orders';
import { expect, test } from 'fixtures';
import { generateValidDeliveryDate, getRandromEnumValue } from 'utils';
import _ from 'lodash';

test.describe('[E2E] [Orders] [Delivery]', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    "Schdeule delivery with type 'Delivery' and 'Home' Location",
    { tag: ['@1_O_DLVR_E2E', TAGS.E2E, TAGS.REGRESSION, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersApiService, orderDetailsPage, deliveryPage }) => {
      const order = await ordersApiService.createDraft(token);
      const delivery = {
        condition: DELIVERY_CONDITIONS.DELIVERY,
        finalDate: generateValidDeliveryDate(),
      };
      const expectedDelivery = {
        ...delivery,
        address: {
          country: order.customer.country,
          city: order.customer.city,
          street: order.customer.street,
          house: order.customer.house,
          flat: order.customer.flat,
        },
      };

      await orderDetailsPage.open(order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();

      await orderDetailsPage.deliveryTab.clickDeliveryButton();
      await deliveryPage.waitForOpened();
      await deliveryPage.fillInputs({ ...delivery, location: 'Home' });
      await deliveryPage.clickSave();

      await orderDetailsPage.waitForNotification(ALERTS.DELIVERY_SAVED);
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actualDelivery = await orderDetailsPage.deliveryTab.getDeliveryInfo();

      test.step("Delivery contains corresponding date&type\nAddress corresponds to customer's address", () => {
        expect(actualDelivery).toEqual(expectedDelivery);
      });
    },
  );

  test(
    "Edit delivery to delivery with type 'Delivery' and 'Other' location",
    { tag: ['@2_O_DLVR_E2E', TAGS.E2E, TAGS.REGRESSION, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersApiService, orderDetailsPage, deliveryPage }) => {
      const order = await ordersApiService.createDraftWithDelivery(token);
      const expectedDelivery = generateDeliveryData({
        condition: DELIVERY_CONDITIONS.DELIVERY,
        finalDate: generateValidDeliveryDate(),
      });

      await orderDetailsPage.open(order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();

      await orderDetailsPage.deliveryTab.clickDeliveryButton();
      await deliveryPage.waitForOpened();
      await deliveryPage.fillInputs({ ...expectedDelivery, location: 'Other' });
      await deliveryPage.clickSave();

      await orderDetailsPage.waitForNotification(ALERTS.DELIVERY_SAVED);
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actualDelivery = await orderDetailsPage.deliveryTab.getDeliveryInfo();

      test.step('Delivery contains corresponding date&type\nAddress corresponds to edited address', () => {
        expect(actualDelivery).toEqual(expectedDelivery);
      });
    },
  );

  test(
    "Edit delivery to delivery with type 'Pickup'",
    { tag: ['@3_O_DLVR_E2E', TAGS.E2E, TAGS.REGRESSION, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersApiService, orderDetailsPage, deliveryPage }) => {
      const order = await ordersApiService.createDraftWithDelivery(token);
      const country = getRandromEnumValue(COUNTRIES);
      const delivery = {
        condition: DELIVERY_CONDITIONS.PICK_UP,
        finalDate: generateValidDeliveryDate(),
        address: {
          country,
        },
      };
      const expectedDelivery = _.merge(delivery, { address: SHOP_ADDRESS_BY_COUNTRY[country] });

      await orderDetailsPage.open(order._id);
      await orderDetailsPage.clickDeliveryTab();
      await orderDetailsPage.deliveryTab.waitForOpened();

      await orderDetailsPage.deliveryTab.clickDeliveryButton();
      await deliveryPage.waitForOpened();
      await deliveryPage.fillInputs({ ...delivery, location: 'Other' });
      await deliveryPage.clickSave();

      await orderDetailsPage.waitForNotification(ALERTS.DELIVERY_SAVED);
      await orderDetailsPage.deliveryTab.waitForOpened();
      const actualDelivery = await orderDetailsPage.deliveryTab.getDeliveryInfo();

      test.step('Delivery contains corresponding date&type\nAddress corresponds to pickup address for chosen country', () => {
        expect(actualDelivery).toEqual(expectedDelivery);
      });
    },
  );
});
