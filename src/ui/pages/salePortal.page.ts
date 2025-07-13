import { HeaderItem } from 'types';
import { logStep } from 'utils';
import { Locator } from '@playwright/test';
import { BaseProjectPage } from './baseProject.page';

export abstract class SalesPortalPage extends BaseProjectPage {
  readonly uniqueElement = this.page.locator('#main-header');

  readonly homeNavButton = this.page.getByRole('link', { name: 'Home' });
  readonly ordersNavButton = this.page.getByRole('link', { name: 'Orders' });
  readonly customersNavButton = this.page.getByRole('link', { name: 'Customers' });
  readonly productsNavButton = this.page.getByRole('link', { name: 'Products' });
  readonly managersNavButton = this.page.getByRole('link', { name: 'Managers' });
  readonly notificationsButton = this.page.locator('#notification-bell');
  readonly switchThemeButton = this.page.locator('#theme-toggle');
  readonly userMenuButton = this.page.locator('#user-menu-button');
  readonly signOutButton = this.page.locator('#signOut');

  @logStep('Click on Header item ')
  async clickHeaderButton(headerItem: HeaderItem) {
    const headerButtons: Record<HeaderItem, Locator> = {
      Home: this.homeNavButton,
      Orders: this.ordersNavButton,
      Customers: this.customersNavButton,
      Products: this.productsNavButton,
      Managers: this.managersNavButton,
      Notifications: this.notificationsButton,
      SwitchTheme: this.switchThemeButton,
      User: this.userMenuButton,
      SignOut: this.signOutButton,
    };

    await headerButtons[headerItem].click();
  }
}
