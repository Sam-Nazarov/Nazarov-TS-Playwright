import { ALERTS, TAGS } from 'data';
import { mockManager, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration][Unassign Manager Modal] ', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder({ assignedManager: mockManager });

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        assignedManager: null,
      },
    };

    await mock.users({
      Users: [mockManager],
      IsSuccess: true,
      ErrorMessage: null,
    });

    await mock.orderDetails(mockOrder.Order._id, mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });
  test(
    'Should successfully unassigning  manager from order',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ confirmationModal, orderDetailsPage, mock }) => {
      await orderDetailsPage.clickUnassignManager();
      await mock.unassignManager(updatedOrder);
      await mock.orderDetails(updatedOrder.Order._id, updatedOrder);

      await confirmationModal.submit();
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_UNASSIGNED);

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
      await expect(
        orderDetailsPage.removeAssignedManagerButton,
        'Remove Assigned Manager button should NOT be visible',
      ).not.toBeVisible();
      await expect(
        orderDetailsPage.editAssignedManagerButton,
        'Edit Assigned Manager button should NOT be visible',
      ).not.toBeVisible();
    },
  );

  test(
    'Should not unassign manager when modal is closed',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickUnassignManager();

      await confirmationModal.close();

      const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await expect(
        orderDetailsPage.removeAssignedManagerButton,
        'Remove Assigned Manager button should be visible',
      ).toBeVisible();
      await expect(
        orderDetailsPage.editAssignedManagerButton,
        'Edit Assigned Manager button should be visible',
      ).toBeVisible();
    },
  );

  test(
    'Should not unassign manager when modal is canceled',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, confirmationModal }) => {
      await orderDetailsPage.clickUnassignManager();

      await confirmationModal.cancel();

      const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await expect(
        orderDetailsPage.removeAssignedManagerButton,
        'Remove Assigned Manager button should be visible',
      ).toBeVisible();
      await expect(
        orderDetailsPage.editAssignedManagerButton,
        'Edit Assigned Manager button should be visible',
      ).toBeVisible();
    },
  );
});
