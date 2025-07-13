import { Page } from '@playwright/test';
import { apiConfig } from 'config';
import { STATUS_CODES } from 'data';
import {
  ICustomerResponse,
  ICustomersResponse,
  IOrderResponse,
  IProductResponse,
  IProductsResponse,
  IResponseFields,
  IUsersResponse,
} from 'types';

export class Mock {
  constructor(private page: Page) {}

  async customers(body: ICustomersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/customers(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async customerDetails(body: ICustomerResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + '/' + apiConfig.ENDPOINTS.CUSTOMER_BY_ID(body.Customer._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async products(body: IProductsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/products(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async productDetails(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + '/' + apiConfig.ENDPOINTS.PRODUCT_BY_ID(body.Product._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async orderDetails(id: string, body: IOrderResponse | IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.unroute(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(id));
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDERS_BY_ID(id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async allCustomers(data: ICustomersResponse | IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });
  }

  async productsAll(body: IProductsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/products\/all$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async createOrder(body: { customers: ICustomersResponse; products: IProductsResponse }) {
    await Promise.all([this.allCustomers(body.customers), this.productsAll(body.products)]);
  }

  async users(body: IUsersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/users$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async assignManager(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/orders\/[\w\d]+\/assign-manager\/[\w\d]+$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async unassignManager(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/orders\/[\w\d]+\/unassign-manager$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async changeOrderStatus(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/orders\/[\w\d]+\/status$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async allProducts(body: IProductsResponse | IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.PRODUCTS_ALL, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }
}
