import { TAGS } from 'data';
import { modalDescription, modalTitle, mockManager, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Component] Unassign Manager Modal', async () => {
  let mockOrder: IOrderResponse;
  test(
    'Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      mockOrder = generateMockOrder({ assignedManager: mockManager });

      await mock.users({
        Users: [mockManager],
        IsSuccess: true,
        ErrorMessage: null,
      });

      await mock.orderDetails(mockOrder.Order._id, mockOrder);
      await orderDetailsPage.open(mockOrder.Order._id);
      await orderDetailsPage.clickUnassignManager();

      await expect.soft(confirmationModal.title).toContainText(modalTitle.unassignManager);
      await expect.soft(confirmationModal.description).toContainText(modalDescription.unassignManager);
      await expect.soft(confirmationModal.confirmButton).toBeVisible();
      await expect.soft(confirmationModal.confirmButton).toBeEnabled();
      await expect.soft(confirmationModal.cancelButton).toBeVisible();
      await expect.soft(confirmationModal.cancelButton).toBeEnabled();
      await expect.soft(confirmationModal.closeButton).toBeVisible();
      await expect.soft(confirmationModal.closeButton).toBeEnabled();
    },
  );
});
