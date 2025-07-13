import { logStep } from 'utils';
import { SalesPortalPage } from '../salePortal.page';
import { AssignManagerModal } from '../modals/orders/assignManager.modal';
import { ConfirmationModal } from '../modals/orders/confirmation.modal';
import { EditCustomerModal } from '../modals/orders/editCustomer.modal';
import { EditProductsModal } from '../modals/orders/editProducts.modal';
import { DeliveryTab } from './tabs/delivery.tab';
import { CommentsTab } from './tabs/comments.tab';
import { HistoryTab } from './tabs/history.tab';

export class OrderDetailsPage extends SalesPortalPage {
  //modals
  readonly confirmationModal = new ConfirmationModal(this.page);
  readonly assignManagerModal = new AssignManagerModal(this.page);
  readonly processModal = this.confirmationModal;
  readonly cancelModal = this.confirmationModal;
  readonly reopenModal = this.confirmationModal;
  readonly unassignModal = this.confirmationModal;
  readonly editCustomerModal = new EditCustomerModal(this.page);
  readonly editProductsModal = new EditProductsModal(this.page);

  uniqueElement = this.page.locator('#order-details-body');

  readonly title = this.page.locator('h2');
  readonly orderInfoContainer = this.page.locator('#order-info-container');
  readonly orderNumber = this.orderInfoContainer.locator('span.fst-italic').first();
  readonly assignedManagerName = this.orderInfoContainer.locator('#assigned-manager-link');
  readonly editAssignedManagerButton = this.orderInfoContainer.getByTitle('Edit Assigned Manager');
  readonly removeAssignedManagerButton = this.orderInfoContainer.getByTitle('Remove Assigned Manager');
  readonly noAssignedManagerText = this.orderInfoContainer.getByText('Click to select manager');
  readonly refreshOrderButton = this.page.locator('#refresh-order');
  readonly cancelOrderButton = this.page.locator('#cancel-order');
  readonly reopenOrderButton = this.page.locator('#reopen-order');
  readonly processOrderButton = this.page.locator('#process-order');
  readonly receiveButton = this.page.locator('#start-receiving-products');
  readonly cancelReceivingButton = this.page.locator('#cancel-receiving');
  readonly saveReceivingButton = this.page.locator('#save-received-products');
  readonly selectAllProductsCheckBox = this.page.getByRole('checkbox', { name: 'Select All' });
  readonly singleProductCheckBox = this.page.getByRole('checkbox', { name: 'Received' });
  readonly productBodiesLocator = '#products-section .accordion-body';
  readonly productHeadersLocator = '#products-section .accordion-header';
  readonly statusTextLocator = '.received-label';
  readonly productDetailsLocator = '.c-details';
  readonly productDetailKeyLocator = '.strong-details';
  readonly productDetailValueLocator = '.s-span';
  readonly customerBodyLocator = '#customer-section .p-3';
  readonly customerDetailsLocator = '.c-details';
  readonly customerKeyLocator = '.strong-details';
  readonly customerValueLocator = '.s-span';
  readonly editCutomerButton = this.page.locator('#edit-customer-pencil');
  readonly editProductsButton = this.page.locator('#edit-products-pencil');
  readonly expandProductDetailsArrow = this.page.locator('#products-accordion-section .accordion-button');
  readonly productDetailsTitle = this.page.locator('#products-section .modal-title');
  readonly customerDetailsTitle = this.page.locator('#customer-section h4.modal-title');

  readonly orderValuesContainer = this.orderInfoContainer.locator('div.h-m-width');
  readonly orderValues = this.orderValuesContainer.locator('span:not(.fw-bold)');
  readonly status = this.orderValues.nth(0);
  readonly totalPrice = this.orderValues.nth(1);
  readonly deliveryDate = this.orderValues.nth(2);
  readonly createdOn = this.orderValues.nth(3);

  //tabs
  readonly deliveryTab = new DeliveryTab(this.page);
  readonly deliveryTabButton = this.page.locator('#delivery-tab');
  readonly commentsTab = new CommentsTab(this.page);
  readonly commentsTabButton = this.page.locator('#comments-tab');
  readonly historyTab = new HistoryTab(this.page);
  readonly historyTabButton = this.page.locator('#history-tab');

  @logStep('Open Order Details page via URL')
  async open(id: string) {
    await this.openPage('ORDER_DETAILS', id);
    await this.waitForOpened();
  }

  @logStep('Get Order Values')
  async getOrderValues() {
    const [orderNumber, status, totalPrice, deliveryDate, createdOn] = await Promise.all([
      this.orderNumber.innerText(),
      this.status.innerText(),
      this.totalPrice.innerText(),
      this.deliveryDate.innerText(),
      this.createdOn.innerText(),
    ]);
    let assignedManagerName = '';
    if (await this.assignedManagerName.isVisible()) assignedManagerName = await this.assignedManagerName.innerText();
    else assignedManagerName = await this.noAssignedManagerText.innerText();

    return { orderNumber, assignedManagerName, status, totalPrice, deliveryDate, createdOn };
  }

  @logStep('Get customer from order')
  async getCustomer(): Promise<Record<string, string>> {
    const numberOfCustomerDetails = await this.page
      .locator(this.customerBodyLocator)
      .locator(this.customerDetailsLocator)
      .count();
    const customer: Record<string, string> = {};
    for (let i = 0; i < numberOfCustomerDetails; i++) {
      const customerDetailRow = this.page.locator(this.customerBodyLocator).locator(this.customerDetailsLocator).nth(i);
      const key = await customerDetailRow.locator(this.customerKeyLocator).textContent();
      const value = await customerDetailRow.locator(this.customerValueLocator).last().textContent();
      customer[key!.trim()] = value!.trim();
    }
    return customer;
  }

  @logStep('Get products from order')
  async getProducts(): Promise<Record<string, string>[]> {
    const numberOfProducts = await this.page.locator(this.productBodiesLocator).count();
    const products: Record<string, string>[] = [];
    for (let i = 0; i < numberOfProducts; i++) {
      const product: Record<string, string> = {};

      const header = this.page.locator(this.productHeadersLocator).nth(i);
      const status = await header.locator(this.statusTextLocator).textContent();
      product['status'] = status!.trim();

      const productDetails = this.page.locator(this.productBodiesLocator).nth(i).locator(this.productDetailsLocator);
      const numberOfProductDetails = await productDetails.count();

      for (let j = 0; j < numberOfProductDetails; j++) {
        const productDetailRow = productDetails.nth(j);
        const key = await productDetailRow.locator(this.productDetailKeyLocator).textContent();
        const value = await productDetailRow.locator(this.productDetailValueLocator).last().textContent();
        product[key!.trim()] = value!.trim();
      }

      products.push(product);
    }
    return products;
  }

  @logStep('Mark Single Product')
  async markSingleProduct(productName: string, action: 'check' | 'uncheck') {
    const productRow = this.page.locator('.accordion-header', {
      hasText: productName,
    });
    const checkbox = productRow.locator('input[type="checkbox"]');
    if (action === 'check') {
      await checkbox.check();
    } else await checkbox.uncheck();
  }

  @logStep('Select All products')
  async markAllproducts(action: 'check' | 'uncheck') {
    if (action === 'check') {
      await this.selectAllProductsCheckBox.check();
    } else await this.selectAllProductsCheckBox.uncheck();
  }

  @logStep('Click Receive Button')
  async clickReceiveButton() {
    await this.receiveButton.click();
    await this.waitForSpinner();
  }

  @logStep('Click on Cancel Button in Product Section')
  async clickCancelButton() {
    await this.cancelReceivingButton.click();
    await this.waitForSpinner();
  }

  @logStep('Click on Save Button in Product Section')
  async clickSaveButton() {
    await this.saveReceivingButton.click();
    await this.waitForSpinner();
  }

  @logStep('Click Process Button')
  async clickProcess() {
    await this.processOrderButton.click();
    await this.processModal.waitForOpened();
  }

  @logStep('Click Cancel Button')
  async clickCancel() {
    await this.cancelOrderButton.click();
    await this.cancelModal.waitForOpened();
  }

  @logStep('Click Reopen Button')
  async clickReopen() {
    await this.reopenOrderButton.click();
    await this.reopenModal.waitForOpened();
  }

  @logStep('Click Refresh Button')
  async clickRefresh() {
    await this.refreshOrderButton.click();
  }

  @logStep('Click Add Assigned Manager Button')
  async clickAddAssignManager() {
    await this.noAssignedManagerText.click();
    await this.assignManagerModal.waitForOpened();
  }

  @logStep('Click Edit Assigned Manager Button')
  async clickEditAssignManager() {
    await this.editAssignedManagerButton.click();
    await this.assignManagerModal.waitForOpened();
  }

  @logStep('Click Remove Assigned Manager Button')
  async clickUnassignManager() {
    await this.removeAssignedManagerButton.click();
    await this.unassignModal.waitForOpened();
  }

  @logStep('Click оn Assigned Manager link')
  async clickAssignManagerLink() {
    await this.assignedManagerName.click();
  }

  @logStep('Click edit customer button')
  async clickEditCustomerButton() {
    await this.editCutomerButton.click();
    await this.editCustomerModal.waitForOpened();
  }

  @logStep('Click edit products button')
  async clickEditProductsButton() {
    await this.editProductsButton.click();
    await this.editProductsModal.waitForOpened();
  }

  @logStep('Click Delivery Tab Button')
  async clickDeliveryTab() {
    await this.deliveryTabButton.click();
    await this.deliveryTab.waitForOpened();
  }

  @logStep('Click Comments Tab Button')
  async clickCommentsTab() {
    await this.commentsTabButton.click();
    await this.commentsTab.waitForOpened();
  }

  @logStep('Click History Tab Button')
  async clickHistoryTab() {
    await this.historyTabButton.click();
    await this.historyTab.waitForOpened();
  }
}
