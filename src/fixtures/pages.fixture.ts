import { test as base } from 'fixtures/mock.fixture';
import {
  CustomersPage,
  HomePage,
  ProductsPage,
  SignInPage,
  OrderDetailsPage,
  DeliveryPage,
  OrdersPage,
} from 'ui/pages';
import {
  AssignManagerModal,
  ConfirmationModal,
  CreateOrderModal,
  EditCustomerModal,
  EditProductsModal,
} from 'ui/pages/modals/orders';

interface ISalesPortalPages {
  signInPage: SignInPage;
  homePage: HomePage;
  customersPage: CustomersPage;
  productsPage: ProductsPage;
  orderDetailsPage: OrderDetailsPage;
  deliveryPage: DeliveryPage;
  ordersPage: OrdersPage;
  createOrderModal: CreateOrderModal;
  editCustomerModal: EditCustomerModal;
  assignManagerModal: AssignManagerModal;
  editProductsModal: EditProductsModal;
  confirmationModal: ConfirmationModal;
}

export const test = base.extend<ISalesPortalPages>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },
  deliveryPage: async ({ page }, use) => {
    await use(new DeliveryPage(page));
  },
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },
  createOrderModal: async ({ page }, use) => {
    await use(new CreateOrderModal(page));
  },
  editCustomerModal: async ({ page }, use) => {
    await use(new EditCustomerModal(page));
  },
  assignManagerModal: async ({ page }, use) => {
    await use(new AssignManagerModal(page));
  },
  editProductsModal: async ({ page }, use) => {
    await use(new EditProductsModal(page));
  },
  confirmationModal: async ({ page }, use) => {
    await use(new ConfirmationModal(page));
  },
});

export { expect } from '@playwright/test';
