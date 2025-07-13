import { TAGS } from 'data';
import { orderInDraftStatus, orderInProcessStatus } from 'data/orders/testData';
import { expect, test } from 'fixtures';

test.describe('[Component] [Orders] [Product Details]', () => {
  test(
    'Product Details should be colapsed after openning the page',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      expect(orderDetailsPage.expandProductDetailsArrow).toHaveAttribute('aria-expanded', 'false');
    },
  );

  test(
    'Product Details should be expanded after clicking on the arror',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      await orderDetailsPage.expandProductDetailsArrow.click();
      expect(orderDetailsPage.expandProductDetailsArrow).toHaveAttribute('aria-expanded', 'true');
    },
  );

  test(
    'Should display correct title for Product details section',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      expect(orderDetailsPage.productDetailsTitle).toHaveText('Requested Products');
    },
  );

  test(
    'Should open Products Modal after clicking on the edit button',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      await orderDetailsPage.editProductsButton.click();
      await orderDetailsPage.editProductsModal.waitForOpened();
    },
  );

  test(
    'Should display select options after clicking Receive button',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInProcessStatus.Order._id, orderInProcessStatus);
      await orderDetailsPage.open(orderInProcessStatus.Order._id);
      await orderDetailsPage.clickReceiveButton();
      expect.soft(orderDetailsPage.selectAllProductsCheckBox).toBeVisible();
      expect.soft(orderDetailsPage.singleProductCheckBox).toBeVisible();
      expect.soft(orderDetailsPage.cancelReceivingButton).toBeVisible();
      expect.soft(orderDetailsPage.saveReceivingButton).toBeVisible();
      expect.soft(orderDetailsPage.saveReceivingButton).toBeDisabled();
    },
  );

  test(
    'Should select all products after clicing on the Select all checkbox',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInProcessStatus.Order._id, orderInProcessStatus);
      await orderDetailsPage.open(orderInProcessStatus.Order._id);
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.selectAllProductsCheckBox.click();
      expect(orderDetailsPage.singleProductCheckBox).toBeChecked();
    },
  );

  test(
    'Sould be enabled if receive checkbox is checked',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInProcessStatus.Order._id, orderInProcessStatus);
      await orderDetailsPage.open(orderInProcessStatus.Order._id);
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.selectAllProductsCheckBox.click();
      expect(orderDetailsPage.saveReceivingButton).toBeEnabled();
    },
  );

  test(
    'Should not displayed select options after clicking on Cancel button',
    { tag: [TAGS.UI, TAGS.COMPONENT] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInProcessStatus.Order._id, orderInProcessStatus);
      await orderDetailsPage.open(orderInProcessStatus.Order._id);
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.clickCancelButton();
      expect.soft(orderDetailsPage.selectAllProductsCheckBox).not.toBeVisible();
      expect.soft(orderDetailsPage.singleProductCheckBox).not.toBeVisible();
      expect.soft(orderDetailsPage.cancelReceivingButton).not.toBeVisible();
      expect.soft(orderDetailsPage.saveReceivingButton).not.toBeVisible();
      expect.soft(orderDetailsPage.receiveButton).toBeVisible();
    },
  );
});
