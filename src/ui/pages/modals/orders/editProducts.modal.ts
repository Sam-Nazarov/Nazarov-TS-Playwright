import { logStep } from 'utils';
import { Modal } from '../modal.page';

export class EditProductsModal extends Modal {
  readonly addProductButton = this.modalContainer.locator('#add-product-btn');
  readonly saveButton = this.modalContainer.locator('#update-products-btn');
  readonly cancelButton = this.modalContainer.locator('#cancel-edit-products-modal-btn');
  readonly totalPrice = this.modalContainer.locator('#total-price-order-modal');
  readonly deleteButtonSelector = '.del-btn-modal';
  readonly productsSection = this.modalContainer.locator('#edit-products-section ');
  readonly productDropdown = this.modalContainer.locator('select');
  uniqueElement = this.modalContainer;

  @logStep('Click add prodduct button')
  async add() {
    await this.addProductButton.click();
  }

  @logStep('Click delete product button')
  async delete(productName: string) {
    for (let i = 0; i < (await this.productDropdown.count()); i++) {
      const select = this.productDropdown.nth(i);
      const selectedProduct = await select.inputValue();

      if (selectedProduct === productName) {
        const container = select.locator('..').locator('..');
        await container.locator(this.deleteButtonSelector).click();
        return;
      }
    }
  }

  @logStep('Select product')
  async selectProduct(newProdcutName: string, currentProductName: string) {
    for (let i = 0; i < (await this.productDropdown.count()); i++) {
      const select = this.productDropdown.nth(i);
      const selectedProduct = await select.inputValue();

      if (selectedProduct === currentProductName) {
        await select.selectOption(newProdcutName);
        return;
      }
    }
  }

  @logStep('Click save button')
  async clickSaveButton() {
    await this.saveButton.click();
    await this.waitForClosed();
  }
}
