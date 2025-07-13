import { ALERTS, TAGS } from 'data';
import { ORDER_STATUSES, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration] [Reopen Order Modal]', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder({ status: ORDER_STATUSES.CANCELED });

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        status: ORDER_STATUSES.DRAFT,
      },
    };

    await mock.orderDetails(mockOrder.Order._id, mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should successfully reopen order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickReopen();

      await mock.changeOrderStatus(updatedOrder);
      await mock.orderDetails(updatedOrder.Order._id, updatedOrder);

      await confirmationModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.ORDER_REOPEN);

      await expect(orderDetailsPage.cancelOrderButton, 'Cancel Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should NOT be CANCELED').not.toHaveText(
        ORDER_STATUSES.CANCELED,
      );
    },
  );

  test(
    'Should not reopen canceled order when modal is closed',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickReopen();

      await confirmationModal.close();

      await expect(orderDetailsPage.reopenOrderButton, 'Reopen Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be CANCELED').toHaveText(ORDER_STATUSES.CANCELED);
    },
  );

  test(
    'Should not reopen canceled order when modal is canceled',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickReopen();

      await confirmationModal.cancel();

      await expect(orderDetailsPage.reopenOrderButton, 'Reopen Order button should be visible').toBeVisible();
      await expect(orderDetailsPage.status, 'Order status should be CANCELED').toHaveText(ORDER_STATUSES.CANCELED);
    },
  );
});
