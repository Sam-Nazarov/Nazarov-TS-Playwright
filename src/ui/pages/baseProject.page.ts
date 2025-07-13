import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { logStep } from 'utils';
import { ROUTES } from 'config';

export abstract class BaseProjectPage extends BasePage {
  abstract uniqueElement: Locator;

  readonly spinner = this.page.locator('.spinner-border');
  readonly notification = this.page.locator('.toast-body');

  @logStep('Open Page by route')
  async openPage(page: keyof typeof ROUTES, id?: string) {
    const route = ROUTES[page];
    if (typeof route === 'string') {
      await this.page.goto(route);
    } else {
      if (!id) throw new Error('Id was not provided');
      await this.page.goto(route(id));
    }
  }

  @logStep('UI: Wait for Page to Open')
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible();
    await this.waitForSpinner();
  }

  @logStep('UI: Wait for Spinner to Disappear')
  async waitForSpinner() {
    await expect(this.spinner).toHaveCount(0);
  }

  @logStep('UI: Check Notification text')
  async waitForNotification(text: string) {
    await expect(this.notification.last()).toHaveText(text);
  }
}
