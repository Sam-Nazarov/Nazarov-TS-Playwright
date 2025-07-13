import { expect } from 'fixtures';
import { BaseProjectPage } from '../baseProject.page';
import { logStep } from 'utils';
import { Locator } from '@playwright/test';

export abstract class Modal extends BaseProjectPage {
  readonly modalContainer = this.page.locator('div[role="dialog"]');
  readonly title = this.modalContainer.locator('.modal-title');
  readonly closeButton = this.modalContainer.locator('button[aria-label="Close"]');
  abstract cancelButton: Locator;

  @logStep('Click on modal close button')
  async close() {
    await this.closeButton.click();
    await this.waitForClosed();
  }

  @logStep('Wait for Modal to be Closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }

  @logStep('Click cancel button')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForClosed();
  }
}
