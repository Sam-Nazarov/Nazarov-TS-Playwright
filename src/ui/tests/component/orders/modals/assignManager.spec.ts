import { TAGS } from 'data';
import { modalTitle, mockManager, generateMockOrder } from 'data/orders';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';

test.describe('[UI] [Orders] [Component] Assign New Manager Modal', async () => {
  let mockOrder: IOrderResponse;

  test.beforeEach(async ({ orderDetailsPage, mock }) => {
    mockOrder = generateMockOrder();

    await mock.users({
      Users: [mockManager],
      IsSuccess: true,
      ErrorMessage: null,
    });
    await mock.orderDetails(mockOrder.Order._id, mockOrder);
    await orderDetailsPage.open(mockOrder.Order._id);
  });

  test(
    'Should display all buttons & title modal',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();
      await assignManagerModal.select(mockManager._id);

      await expect.soft(assignManagerModal.title).toContainText(modalTitle.assignManager);
      await expect.soft(assignManagerModal.confirmButton).toBeVisible();
      await expect.soft(assignManagerModal.confirmButton).toBeEnabled();
      await expect.soft(assignManagerModal.cancelButton).toBeVisible();
      await expect.soft(assignManagerModal.cancelButton).toBeEnabled();
      await expect.soft(assignManagerModal.closeButton).toBeVisible();
      await expect.soft(assignManagerModal.closeButton).toBeEnabled();
    },
  );

  test('Should disable Save button when no manager selected', async ({ assignManagerModal, orderDetailsPage }) => {
    await orderDetailsPage.clickAddAssignManager();
    await assignManagerModal.getManagersList();
    await expect(assignManagerModal.confirmButton).toBeDisabled();
  });

  test(
    'Should display  Manager via Search',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ orderDetailsPage, assignManagerModal }) => {
      await orderDetailsPage.clickAddAssignManager();

      const mockinfo = `${mockManager.firstName} ${mockManager.lastName} (${mockManager.username})`;

      await assignManagerModal.search(mockManager.firstName);
      const infoByFirstName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByFirstName, 'Search by firstName and verify result').toBe(mockinfo);

      await assignManagerModal.search(mockManager.lastName);
      const infoByLastName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByLastName, 'Search by lastName and verify result').toBe(mockinfo);

      await assignManagerModal.search(mockManager.username);
      const infoByUserName = await assignManagerModal.getManager(mockManager._id);
      expect.soft(infoByUserName, 'Search by username and verify result').toBe(mockinfo);
    },
  );

  test(
    ' Should disable Save button if  no search manager  result',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ assignManagerModal, orderDetailsPage }) => {
      await orderDetailsPage.clickAddAssignManager();
      await assignManagerModal.fillSearch('abc');
      await expect(assignManagerModal.confirmButton).toBeDisabled();
    },
  );
});
