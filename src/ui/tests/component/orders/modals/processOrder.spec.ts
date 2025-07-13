import { TAGS } from 'data';
import { generateDeliveryData, modalDescription, modalTitle, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Component] Process Order Modal', async () => {
  let mockOrder: IOrderResponse;
  test(
    'Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder({ delivery: generateDeliveryData() });

      await mock.orderDetails(mockOrder.Order._id, mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickProcess();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.processOrder);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.processOrder);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );
});
