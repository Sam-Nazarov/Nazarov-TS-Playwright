import { IOrderResponse } from 'types';
import { Modal } from '../modal.page';
import { logStep } from 'utils/reporter.utils';
import { apiConfig } from 'config';
import numeral from 'numeral';

export class CreateOrderModal extends Modal {
  readonly uniqueElement = this.page.locator(`#add-order-modal`);
  readonly title = this.uniqueElement.locator('h5.modal-title');
  readonly closeButton = this.uniqueElement.locator('button.btn-close');
  readonly customerDropdown = this.uniqueElement.locator('#inputCustomerOrder');
  readonly productDropdown = this.uniqueElement.locator(`select[name="Product"]`);
  readonly removeProductDropdownButton = this.uniqueElement.locator('.del-btn-modal');
  readonly addProductButton = this.uniqueElement.locator('#add-product-btn');
  readonly createButton = this.uniqueElement.locator('#create-order-btn');
  readonly cancelButton = this.uniqueElement.locator('#cancel-order-modal-btn');
  readonly totalPrice = this.uniqueElement.locator('#total-price-order-modal');
  readonly deleteProductButton = this.uniqueElement.locator('button.del-btn-modal');

  @logStep('Select customer in dropdown on Create Order Modal')
  async selectCustomer(customerName: string) {
    await this.customerDropdown.selectOption(customerName);
  }

  @logStep('Get customers in dropdown on Create Order Modal')
  async getCustomersInDropdown() {
    return this.customerDropdown.locator('option').allInnerTexts();
  }

  @logStep('Get products in dropdown on Create Order Modal')
  async getProductsInDropdown(dropdownIndex = 0) {
    return this.productDropdown.nth(dropdownIndex).locator('option').allInnerTexts();
  }

  @logStep('Select product in dropdown on Create Order Modal')
  async selectProduct(productName: string, dropdownIndex = 0) {
    await this.productDropdown.nth(dropdownIndex).selectOption(productName);
  }

  @logStep('Select products in all dropdowns on Create Order Modal')
  async selectProducts(...productsNames: string[]) {
    const maxProducts = productsNames.length > 5 ? 5 : productsNames.length;
    for (let i = 0; i < maxProducts; i++) {
      if (i > 0) await this.addProductButton.click();
      await this.selectProduct(productsNames[i], i);
    }
  }

  @logStep('Click Create button on Create Order Modal')
  async clickCreate() {
    await this.createButton.click();
    await this.waitForClosed();
  }

  @logStep('Submit order on Create Order Modal')
  async submit() {
    const response = await this.interceptResponse<IOrderResponse, unknown[]>(
      apiConfig.ENDPOINTS.ORDERS,
      this.clickCreate.bind(this),
    );
    await this.waitForClosed();
    return response;
  }

  @logStep('Get total price')
  async getTotalPrice(): Promise<number> {
    const price = await this.totalPrice.textContent();
    return numeral(price?.trim()).value() ?? 0;
  }

  @logStep('Click Add Product button on Create Order Modal')
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep('Click Delete Product button on Create Order Modal')
  async clickDeleteProductButton(index: number = 0) {
    await this.deleteProductButton.nth(index).click();
  }
}
