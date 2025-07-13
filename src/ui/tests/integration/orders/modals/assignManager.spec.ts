import { ALERTS, TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { generateDeliveryData, ORDER_STATUSES } from 'data/orders';
import { generateMockOrder, mockManager, secondMockManager } from 'data/orders/mock.data';
import { generateProductData } from 'data/products';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';
import { generateID } from 'utils';

test.describe('[UI] [Orders] [Integration] Assign New Manager Modal', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder();

    updatedOrder = {
      ...mockOrder,
      Order: {
        ...mockOrder.Order,
        assignedManager: mockManager,
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
    'Assign a New Manager',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal, mock }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.select(mockManager._id);

      const managerInfo = await assignManagerModal.getManager(mockManager._id);

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      expect.soft(managerInfo, 'Selected manager info should match mocked manager').toBe(mockinfo);

      await mock.assignManager(updatedOrder);
      await mock.orderDetails(updatedOrder.Order._id, updatedOrder);

      await assignManagerModal.submit();

      const mockManagerName = `${mockManager.firstName} ${mockManager.lastName}`;
      await expect
        .soft(orderDetailsPage.assignedManagerName, 'Verify Manager name on orderDetailsPage')
        .toHaveText(mockManagerName);
      await orderDetailsPage.waitForNotification(ALERTS.MANAGER_ASSIGNED);
    },
  );

  test(
    'Should not assign manager when modal is closed',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.close();

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
    },
  );

  test(
    'Should not assign manager when modal is canceled',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      await assignManagerModal.cancel();

      await expect(orderDetailsPage.noAssignedManagerText, 'Verify no manager was assigned after closing').toHaveText(
        'Click to select manager',
      );
    },
  );
});

test.describe('[UI] [Orders] [Integration] Edit Assigned Manager Modal', async () => {
  let mockOrder: IOrderResponse;
  let updatedOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = {
      Order: {
        customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
        products: [{ ...generateProductData(), _id: generateID(), received: false }],
        createdOn: new Date().toISOString(),
        total_price: 100,
        comments: [],
        history: [],
        assignedManager: mockManager,
        status: ORDER_STATUSES.DRAFT,
        delivery: generateDeliveryData(),
        _id: generateID(),
      },
      IsSuccess: true,
      ErrorMessage: null,
    };

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
