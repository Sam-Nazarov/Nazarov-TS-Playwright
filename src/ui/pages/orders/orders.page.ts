import { logStep } from 'utils/reporter.utils';
import { SalesPortalPage } from '..';
import { CreateOrderModal } from '../modals/orders/createOrder.modal';
import { ConfirmationModal } from '../modals/orders';

export class OrdersPage extends SalesPortalPage {
  readonly createOrderModal = new CreateOrderModal(this.page);
  private readonly confirmationModal = new ConfirmationModal(this.page);
  readonly reopenModal = this.confirmationModal;

  readonly uniqueElement = this.page.locator(`[data-name="table-orders"]`);
  readonly createOrderButton = this.page.locator('[name="add-button"]');

  readonly tableRow = this.page.locator('#table-orders tbody tr');
  readonly tableRowByOrderNumber = (orderNumber: string) =>
    this.tableRow.filter({ has: this.page.getByText(orderNumber) });
  readonly detailsButton = (orderNumber: string) =>
    this.tableRowByOrderNumber(orderNumber).locator('a[title="Details"]');
  readonly reopenButton = (orderNumber: string) =>
    this.tableRowByOrderNumber(orderNumber).locator('button[title="Reopen"]');

  @logStep('Open Orders page via URL')
  async open() {
    await this.openPage('ORDERS');
    await this.waitForOpened();
  }

  @logStep('Click Order Details button in table')
  async clickOrderDetails(orderNumber: string) {
    await this.detailsButton(orderNumber).click();
  }

  @logStep('Click Reopen Order button in table')
  async clickReopenOrder(orderNumber: string) {
    await this.reopenButton(orderNumber).click();
  }

  @logStep('Click Create Order button')
  async clickCreateButton() {
    await this.createOrderButton.click();
    await this.createOrderModal.waitForOpened();
  }

  async getOrderFromTable(orderNumber: string) {
    const [_id, email, price, delivery, status, assignedManager, createdOn] =
      await this.tableRowByOrderNumber(orderNumber).allInnerTexts();
    return {
      _id,
      email,
      price,
      delivery,
      status,
      assignedManager,
      createdOn,
    };
  }
}
