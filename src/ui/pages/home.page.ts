import { Locator } from '@playwright/test';
import { logStep } from 'utils';
import { SalesPortalPage } from './salePortal.page';
import { CardName } from 'types';

export class HomePage extends SalesPortalPage {
  readonly title = this.page.locator('.welcome-text');
  readonly customersCardButton = this.page.locator('#customers-from-home');
  readonly productsCardButton = this.page.locator('#products-from-home');
  readonly ordersCardButton = this.page.locator('#orders-from-home');

  readonly uniqueElement = this.title;

  @logStep('Open Home page via URL')
  async open() {
    await this.openPage('HOME');
    await this.waitForOpened();
  }

  @logStep('Click on Module button')
  async clickCardButton(cardName: CardName) {
    const cardButtons: Record<CardName, Locator> = {
      Customers: this.customersCardButton,
      Products: this.productsCardButton,
      Orders: this.ordersCardButton,
    };

    await cardButtons[cardName].click();
  }
}
