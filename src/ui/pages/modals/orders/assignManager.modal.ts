import { expect, Locator } from '@playwright/test';
import { logStep } from 'utils';
import { Modal } from '../modal.page';

export class AssignManagerModal extends Modal {
  readonly confirmButton = this.modalContainer.locator('#update-manager-btn');
  readonly cancelButton = this.modalContainer.locator('#cancel-edit-manager-modal-btn');
  readonly managerList = this.modalContainer.locator('#manager-list');
  readonly searchInput = this.modalContainer.locator('#manager-search-input');
  readonly activeManager = this.managerList.locator('li[data-managerid].active');
  readonly managerID = (managerId: string) => this.managerList.locator(`li[data-managerid="${managerId}"]`);
  readonly managerItem = this.managerList.locator('li.list-group-item');
  uniqueElement = this.modalContainer;

  @logStep('Check Select Manager')
  async checkActiveManager(managerItem: Locator) {
    await expect(managerItem).toHaveClass(/active/);
  }

  @logStep('Get list of managers on AssignManagerModal')
  async getManagersList() {
    await expect(this.managerList).toBeVisible();
  }

  @logStep('Select manager on AssignManagerModal')
  async select(managerId: string) {
    await expect(this.managerList).toBeVisible();
    const managerItem = this.managerID(managerId);
    await managerItem.click();
    await this.checkActiveManager(managerItem);
  }

  @logStep('Get active manager info')
  async getActiveManagerInfo() {
    const activeInfo = await this.activeManager.innerText();
    return activeInfo.trim();
  }

  @logStep('Click SubmitButton on AssignManagerModal')
  async submit() {
    await this.confirmButton.click();
    await this.waitForClosed();
  }

  @logStep('Search and Select manager on AssignManagerModal')
  async search(value: string) {
    await this.searchInput.fill(value);
    const managerFirstItem = this.managerItem.filter({ hasText: value }).first();
    await expect(managerFirstItem).toBeVisible();
    await managerFirstItem.click();
    await this.checkActiveManager(managerFirstItem);
  }

  @logStep('Fill Search field on AssignManagerModal')
  async fillSearch(value: string) {
    await this.searchInput.fill(value);
  }

  @logStep('Get manager info on AssignManagerModal')
  async getManager(managerId: string) {
    await expect(this.managerList).toBeVisible();
    const managerItem = this.managerList.locator(`li[data-managerid="${managerId}"]`);
    const info = await managerItem.innerText();
    return info.trim();
  }
}
