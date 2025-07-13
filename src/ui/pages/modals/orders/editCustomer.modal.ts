import { logStep } from 'utils';
import { Modal } from '../modal.page';

export class EditCustomerModal extends Modal {
  readonly customersList = this.modalContainer.locator('#inputCustomerOrder');
  readonly saveButton = this.modalContainer.locator('#update-customer-btn');
  readonly cancelButton = this.modalContainer.locator('#cancel-edit-customer-modal-btn');
  uniqueElement = this.modalContainer;

  @logStep('Select customer form dropdown')
  async selectCustomer(customerName: string) {
    await this.customersList.selectOption(customerName);
  }

  @logStep('Click save button')
  async clickSaveButton() {
    await this.saveButton.click();
    await this.waitForClosed();
  }
}
