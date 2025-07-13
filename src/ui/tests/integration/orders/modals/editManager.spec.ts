import { ALERTS, TAGS } from 'data';
import { generateMockOrder, mockManager, secondMockManager } from 'data/orders/mock.data';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Integration] Edit Assigned Manager Modal', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder({ assignedManager: mockManager });

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        assignedManager: secondMockManager,
      },
    };

    await mock.users({
      Users: [mockManager, secondMockManager],
      IsSuccess: true,
      ErrorMessage: null,
    });

    await mock.orderDetails(mockOrder.Order._id, mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should change assigned manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal, mock }) => {
      await orderDetailsPage.clickEditAssignManager();

      await assignManagerModal.select(secondMockManager._id);

      await mock.assignManager(updatedOrder);
      await mock.orderDetails(updatedOrder.Order._id, updatedOrder);
      await assignManagerModal.submit();

      const mockManagerName = `${secondMockManager.firstName} ${secondMockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
    },
  );

  test(
    'Should close modal without assign new Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      await assignManagerModal.close();

      const currentManagerName = `${mockManager.firstName} ${mockManager.lastName}`;

      await expect(orderDetailsPage.assignedManagerName, 'Verify current Manager on OrderDetailPage').toHaveText(
        currentManagerName,
      );
    },
  );

  test(
    'Should Cancel without assign new Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickEditAssignManager();

      await assignManagerModal.cancel();

      const currentManagerName = `${mockManager.firstName} ${mockManager.lastName}`;

      await expect(orderDetailsPage.assignedManagerName, 'Verify current Manager on OrderDetailPage').toHaveText(
        currentManagerName,
      );
    },
  );
});
