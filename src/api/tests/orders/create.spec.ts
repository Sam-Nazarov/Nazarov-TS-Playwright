import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { orderTestData } from 'data/orders/testData/createOrderTestData';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { test } from 'fixtures';
import { ICustomerFromResponse, IOrderResponse, IProductFromResponse, IResponse } from 'types';
import { extractIds, generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Create]', () => {
  let token = '';
  let customer: ICustomerFromResponse;
  let products: IProductFromResponse[];
  let orderResponse: IResponse<IOrderResponse>;
  let productIds: string[];

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ ordersApiService, customersApiService, productsApiService }) => {
    // TODO: Remake cleanup
    if (orderResponse.status !== STATUS_CODES.CREATED) {
      if (!customer) {
        return;
      } else await customersApiService.delete(customer._id, token);
      if (!products) {
        return;
      } else await Promise.all(products.map((product) => productsApiService.delete(product._id, token)));
    } else ordersApiService.clear(token);
  });

  test(
    'Should create order with all valid data (token, valid customerId, productId) and one product',
    { tag: ['@001_O_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService, ordersApiService }) => {
      // TODO: Remake customer and products creation
      customer = await customersApiService.create(token);
      products = [await productsApiService.create(token)];
      productIds = extractIds(products);
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.CREATED, true, null);
      validateSchema(orderSchema, orderResponse.body);
      ordersApiService.validateOrder(orderResponse, products, customer);
    },
  );

  test(
    'Should create order with all valid data (token, valid customerId, productId) and 5 products',
    { tag: ['@002_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService, ordersApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(5, token);
      productIds = extractIds(products);
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.CREATED, true, null);
      validateSchema(orderSchema, orderResponse.body);
      ordersApiService.validateOrder(orderResponse, products, customer);
    },
  );

  test(
    'Should not create order with all valid data (token, valid customerId, productId) and 6 products',
    { tag: ['@003_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(6, token);
      productIds = extractIds(products);
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_BAD_REQUEST);
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );

  orderTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = [await productsApiService.create(token)];
      productIds = extractIds(products);
      orderResponse = await ordersController.create(
        { customer: data.customer ?? customer._id, products: data.products ?? productIds },
        data.token ?? token,
      );
      validateResponse(orderResponse, data.status, false, data.error);
      validateSchema(errorResponseSchema, orderResponse.body);
    });
  });

  test(
    'Should not create order with invalid customerId',
    { tag: ['@008_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, productsApiService }) => {
      const invalidCustomerId = generateID();
      products = [await productsApiService.create(token)];
      productIds = extractIds(products);
      orderResponse = await ordersController.create({ customer: invalidCustomerId, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.CUSTOMER_NOT_FOUND(invalidCustomerId));
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );

  test(
    'Should not create order with 1 invalid productId',
    { tag: ['@011_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService }) => {
      customer = await customersApiService.create(token);
      const invalidaProductId = generateID();
      orderResponse = await ordersController.create({ customer: customer._id, products: [invalidaProductId] }, token);
      validateResponse(orderResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(invalidaProductId));
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );

  test(
    'Should not create order if one of productIds is invalid',
    { tag: ['@012_O_POST_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(3, token);
      productIds = extractIds(products);
      const invalidaProductId = generateID();
      productIds.push(invalidaProductId);
      orderResponse = await ordersController.create({ customer: customer._id, products: productIds }, token);
      validateResponse(orderResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(invalidaProductId));
      validateSchema(errorResponseSchema, orderResponse.body);
    },
  );
});
