import { TAGS } from 'data';
import { modalDescription, modalTitle, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Component] Cancel Order Modal', async () => {
  let mockOrder: IOrderResponse;

  test(
    '[Cancel modal] Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder();

      await mock.orderDetails(mockOrder.Order._id, mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);

      await orderDetailsPage.clickCancel();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.cancelOrder);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.cancelOrder);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );
});
