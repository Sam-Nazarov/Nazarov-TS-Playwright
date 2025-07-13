import { test as base } from '@playwright/test';
import {
  CustomersController,
  NotificationsController,
  OrdersController,
  ProductsController,
  SignInController,
} from 'api/controllers';

interface IControllers {
  productsController: ProductsController;
  signInController: SignInController;
  customersController: CustomersController;
  ordersController: OrdersController;
  notificationsController: NotificationsController;
}

export const test = base.extend<IControllers>({
  productsController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },

  signInController: async ({ request }, use) => {
    await use(new SignInController(request));
  },

  customersController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },

  ordersController: async ({ request }, use) => {
    await use(new OrdersController(request));
  },

  notificationsController: async ({ request }, use) => {
    await use(new NotificationsController(request));
  },
});
