import { Modal } from '../modal.page';
import { logStep } from 'utils';

export class ConfirmationModal extends Modal {
  readonly description = this.modalContainer.locator('.modal-body-text p');
  readonly confirmButton = this.modalContainer.locator('button[type="submit"]');
  readonly cancelButton = this.modalContainer.locator('button.btn-secondary');
  uniqueElement = this.modalContainer;

  @logStep('Click SubmitButton')
  async submit() {
    await this.confirmButton.click();
    await this.waitForClosed();
  }
}
