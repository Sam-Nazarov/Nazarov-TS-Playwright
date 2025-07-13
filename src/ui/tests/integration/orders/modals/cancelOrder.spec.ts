import { ALERTS, TAGS } from 'data';
import { ORDER_STATUSES, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration] [Cancel Order Modal]', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder();

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        status: ORDER_STATUSES.CANCELED,
      },
    };

    await mock.orderDetails(mockOrder.Order._id, mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should successfully cancel order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickCancel();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder.Order._id, updatedOrder);

      await confirmationModal.submit();

      await orderDetailsPage.waitForNotification(ALERTS.ORDER_CANCELED);

      await expect(orderDetailsPage.reopenOrderButton, 'Reopen Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be CANCELED').toHaveText(ORDER_STATUSES.CANCELED);
    },
  );

  test(
    'Should not cancel order when modal is closed',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickCancel();

      await confirmationModal.close();

      await expect(orderDetailsPage.cancelOrderButton, 'Cancel Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should NOT be CANCELED').not.toHaveText(
        ORDER_STATUSES.CANCELED,
      );
    },
  );

  test(
    'Should not cancel order when modal is canceled',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickCancel();

      await confirmationModal.cancel();

      await expect(orderDetailsPage.cancelOrderButton).toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should NOT be CANCELED').not.toHaveText(
        ORDER_STATUSES.CANCELED,
      );
    },
  );
});
