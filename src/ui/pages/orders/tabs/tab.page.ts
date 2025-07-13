import { Locator } from '@playwright/test';
import { BaseProjectPage } from 'ui/pages';

export abstract class OrderTab extends BaseProjectPage {
  readonly tabContainer = this.page.locator('#order-details-tabs-content');
  readonly title = (tabName: string): Locator => this.tabContainer.locator(`#${tabName} h4`);
}
