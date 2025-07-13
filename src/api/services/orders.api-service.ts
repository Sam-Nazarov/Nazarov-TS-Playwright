import { APIRequestContext } from '@playwright/test';
import { generateDeliveryData, ORDER_STATUSES, generateCommentData } from 'data/orders';
import { logStep, extractIds, getRandromEnumValue } from 'utils';
import {
  IOrderOptions,
  IOrderSortRequest,
  IOrderRequest,
  IOrderCommentRequest,
  IProduct,
  IOrderOptionsWithDelivery,
  IDeliveryOptions,
  OrderCustomerUpdateOptions,
  IResponse,
  IOrderResponse,
  IProductFromResponse,
  ICustomerFromResponse,
  IOrderFromResponse,
} from 'types';
import { CustomersApiService, ProductsApiService } from '.';
import { OrdersController } from 'api/controllers';
import { STATUS_CODES } from 'data';
import { orderSchema, ordersWithSortAndFilter } from 'data/schemas';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';
import { expect } from 'fixtures';
import _ from 'lodash';

export class OrdersApiService {
  private controller: OrdersController;
  private customerService: CustomersApiService;
  private productsService: ProductsApiService;
  private customers: Set<string>;
  private products: Set<string>;
  private orders: Set<string>;

  constructor(request: APIRequestContext) {
    this.controller = new OrdersController(request);
    this.customerService = new CustomersApiService(request);
    this.productsService = new ProductsApiService(request);
    this.customers = new Set();
    this.products = new Set();
    this.orders = new Set();
  }

  @logStep('Create repeated product IDs for order')
  private async createRepeatedProductIds(
    count: number,
    token: string,
    productData?: Partial<IProduct>,
  ): Promise<string[]> {
    const product = await this.productsService.create(token, productData);
    this.products.add(product._id);
    return Array(count).fill(product._id);
  }

  @logStep('Create unique product IDs for order')
  private async createUniqueProductIds(
    count: number,
    token: string,
    productData?: Partial<IProduct>,
  ): Promise<string[]> {
    const products = await this.productsService.createBulk(count, token, productData);
    products.forEach((product) => this.products.add(product._id));
    return extractIds(products);
  }

  @logStep('Create draft order w/o delivery and get created order via API')
  async createDraft(token: string, options?: IOrderOptions) {
    const { productCount = 1, isUniqueProducts = true, customerData, productData } = options || {};

    const customer = (await this.customerService.create(token, customerData))._id;
    this.customers.add(customer);

    const products = isUniqueProducts
      ? await this.createUniqueProductIds(productCount, token, productData)
      : await this.createRepeatedProductIds(productCount, token, productData);

    const response = await this.controller.create({ customer, products }, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    validateSchema(orderSchema, response.body);
    this.orders.add(response.body.Order._id);
    return response.body.Order;
  }

  @logStep('Create canceled order w/o delivery and get order via API')
  async createCanceled(token: string, options?: IOrderOptions) {
    const draftId = (await this.createDraft(token, options))._id;
    return await this.updateStatus(draftId, ORDER_STATUSES.CANCELED, token);
  }

  @logStep('Create draft order with delivery and get created order via API')
  async createDraftWithDelivery(token: string, options?: IOrderOptionsWithDelivery) {
    const { deliveryData, ...orderOptions } = options || {};
    const draftId = (await this.createDraft(token, orderOptions))._id;
    return await this.updateDelivery(draftId, token, deliveryData);
  }

  @logStep('Create order In process and get created order via API')
  async createInProcess(token: string, options?: IOrderOptionsWithDelivery) {
    const draftId = (await this.createDraftWithDelivery(token, options))._id;
    return await this.updateStatus(draftId, ORDER_STATUSES.IN_PROCESS, token);
  }

  @logStep('Create order Partially Received and get created order via API')
  async createPartiallyReceived(token: string, options?: IOrderOptionsWithDelivery) {
    const safeOptions = { ...options, productCount: Math.max(options?.productCount ?? 2, 2) };
    const inProcess = await this.createInProcess(token, safeOptions);
    return await this.receiveProduct(inProcess._id, [inProcess.products[0]._id], token);
  }

  @logStep('Create Received order and get created order via API')
  async createReceived(token: string, options?: IOrderOptionsWithDelivery) {
    const inProcess = await this.createInProcess(token, options);
    const productIds = extractIds(inProcess.products);
    return await this.receiveProduct(inProcess._id, productIds, token);
  }

  @logStep('Get order by ID via API')
  async getById(id: string, token: string) {
    const response = await this.controller.getById(id, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Get sorted & filtered list of orders via API')
  async getAll(token: string, params?: IOrderSortRequest) {
    const response = await this.controller.getAllSorted(token, params);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(ordersWithSortAndFilter, response.body);
    return response.body;
  }

  @logStep('Update order via API')
  async updateOrder(id: string, body: IOrderRequest, token: string) {
    const response = await this.controller.update(id, body, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Update order by customer via API')
  async updateByCustomer(id: string, token: string, options?: OrderCustomerUpdateOptions) {
    let customerId;
    if (options?.customerId) {
      customerId = options.customerId;
    } else {
      customerId = (await this.customerService.create(token, options?.customerData))._id;
      this.customers.add(customerId);
    }

    const products = (await this.getById(id, token)).products;
    const updatedBody = {
      customer: customerId,
      products: extractIds(products),
    };

    return await this.updateOrder(id, updatedBody, token);
  }

  @logStep('Update order by products via API')
  async updateByProducts(id: string, token: string, options?: Omit<IOrderOptions, 'customerData'>) {
    const { productCount = 1, isUniqueProducts = true, productData } = options || {};

    const products = isUniqueProducts
      ? await this.createUniqueProductIds(productCount, token, productData)
      : await this.createRepeatedProductIds(productCount, token, productData);

    const customer = (await this.getById(id, token)).customer._id;
    const updatedBody: IOrderRequest = {
      customer,
      products,
    };

    return await this.updateOrder(id, updatedBody, token);
  }

  @logStep('Update status order via API')
  async updateStatus(id: string, status: ORDER_STATUSES, token: string) {
    const response = await this.controller.updateStatus(id, status, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Update delivery via API')
  async updateDelivery(id: string, token: string, customData?: IDeliveryOptions) {
    const body = generateDeliveryData(customData);
    const response = await this.controller.updateDelivery(id, body, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Delete order via API')
  async deleteOrder(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateDeleteResponse(response);
  }

  @logStep('Add comment via API')
  async addComment(orderId: string, token: string, customComment?: IOrderCommentRequest) {
    const comment = generateCommentData(customComment);
    const response = await this.controller.addComment(orderId, comment, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Delete comment via API')
  async deleteComment(orderId: string, commentId: string, token: string) {
    const response = await this.controller.deleteComment(orderId, commentId, token);
    validateDeleteResponse(response);
  }

  @logStep('Assign manager to order via API')
  async assignManager(orderId: string, managerId: string, token: string) {
    const response = await this.controller.assignManager(orderId, managerId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Unassign manager from order via API')
  async unassignManager(orderId: string, token: string) {
    const response = await this.controller.unassignManager(orderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Mark products as received in order via API')
  async receiveProduct(orderId: string, prodID: string[], token: string) {
    const response = await this.controller.receiveProduct(orderId, prodID, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    validateSchema(orderSchema, response.body);
    return response.body.Order;
  }

  @logStep('Delete all created entities')
  async clear(token: string) {
    await Promise.allSettled(Array.from(this.orders, (id) => this.deleteOrder(id, token)));
    await Promise.allSettled(Array.from(this.products, (id) => this.productsService.delete(id, token)));
    await Promise.allSettled(Array.from(this.customers, (id) => this.customerService.delete(id, token)));
    this.orders.clear();
    this.products.clear();
    this.customers.clear();
  }

  @logStep('Validate created order')
  async validateOrder(
    orderResponse: IResponse<IOrderResponse>,
    products: IProductFromResponse[],
    customer: ICustomerFromResponse,
  ) {
    expect
      .soft(customer, 'Customer from order should match the expected customer')
      .toMatchObject({ ...orderResponse.body.Order.customer });
    products.forEach((product) => {
      expect
        .soft(product, 'Product from order should match the expected')
        .toMatchObject(
          _.omit({ ...orderResponse.body.Order.products.find((value) => product._id === value._id) }, ['received']),
        );
    });
    expect.soft(orderResponse.body.Order.status, 'Order status should match  the expected').toBe('Draft');
    expect
      .soft(orderResponse.body.Order.total_price, 'Total price should match the expected')
      .toBe(products.reduce((price, product) => price + product.price, 0));
  }

  @logStep('Create order in random status via API')
  async createOrderInRandomStatus(token: string) {
    let order: IOrderFromResponse;
    const orderStatus = getRandromEnumValue(ORDER_STATUSES);
    switch (orderStatus) {
      case ORDER_STATUSES.DRAFT:
        order = await this.createDraft(token);
        break;
      case ORDER_STATUSES.IN_PROCESS:
        order = await this.createInProcess(token);
        break;
      case ORDER_STATUSES.PARTIALLY_RECEIVED:
        order = await this.createPartiallyReceived(token);
        break;
      case ORDER_STATUSES.RECEIVED:
        order = await this.createReceived(token);
        break;
      case ORDER_STATUSES.CANCELED:
        order = await this.createCanceled(token);
        break;
      default:
        throw new Error(`Unexpected order status: ${orderStatus}`);
    }
    return order;
  }
}
