import { test as base } from '@playwright/test';
import {
  CustomersApiService,
  ProductsApiService,
  OrdersApiService,
  SignInApiService,
  NotificationsApiService,
} from 'api/services';

interface IApiServices {
  signInApiService: SignInApiService;
  ordersApiService: OrdersApiService;
  productsApiService: ProductsApiService;
  customersApiService: CustomersApiService;
  notificationsApiService: NotificationsApiService;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ request, page }, use) => {
    await use(new SignInApiService(request, page));
  },

  productsApiService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },

  customersApiService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },

  ordersApiService: async ({ request }, use) => {
    await use(new OrdersApiService(request));
  },

  notificationsApiService: async ({ request }, use) => {
    await use(new NotificationsApiService(request));
  },
});
