import { ALERTS, TAGS } from 'data';
import { generateDeliveryData, ORDER_STATUSES, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration][Process Order Modal]', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder({ delivery: generateDeliveryData() });

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        status: ORDER_STATUSES.IN_PROCESS,
      },
    };

    await mock.orderDetails(mockOrder.Order._id, mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should successfully process order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickProcess();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder.Order._id, updatedOrder);

      await confirmationModal.submit();

      await orderDetailsPage.waitForNotification(ALERTS.ORDER_PROCESS);
      await expect(orderDetailsPage.processOrderButton, 'Process Order button should NOT be visible').not.toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be IN PROCESS').toHaveText(ORDER_STATUSES.IN_PROCESS);
    },
  );

  test(
    'Should not process order when modal is closed',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickProcess();

      await confirmationModal.close();

      await expect(orderDetailsPage.processOrderButton, 'Process Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be DRAFT').toHaveText(ORDER_STATUSES.DRAFT);
    },
  );

  test(
    'Should not process order when modal is canceled',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickProcess();

      await confirmationModal.cancel();

      await expect(orderDetailsPage.processOrderButton, 'Process Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be DRAFT').toHaveText(ORDER_STATUSES.DRAFT);
    },
  );
});
