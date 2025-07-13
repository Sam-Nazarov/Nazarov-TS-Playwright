import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import _ from 'lodash';
import { ICustomerFromResponse, IOrderFromResponse, IProductFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Update Order]', () => {
  let token = '';
  let order: IOrderFromResponse;
  let customer: ICustomerFromResponse;
  let products: IProductFromResponse[];
  let productIds: string[];
  test.beforeEach(async ({ ordersApiService, signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    order = await ordersApiService.createDraft(token);
  });

  test.afterEach(async ({ ordersApiService, productsApiService, customersApiService }) => {
    await ordersApiService.clear(token);
    if (!productIds) return;
    else await Promise.all(productIds.map((el) => productsApiService.delete(el, token)));
    if (!customer) return;
    else await customersApiService.delete(customer._id, token);
  });

  test(
    'Should update order with all valid data (token, valid customerId, productId)',
    { tag: ['@001_O_PUT_API', TAGS.API, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      customer = await customersApiService.create(token);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: productIds },
        token,
      );

      validateSchema(orderSchema, updateResponse.body);
      validateResponse(updateResponse, STATUS_CODES.OK, true, null);
      expect.soft(updateResponse.body.Order.customer).toMatchObject({ ...customer });
      updateResponse.body.Order.products.forEach((el) =>
        expect.soft(el).toMatchObject(_.omit({ ...products.find((data) => data._id === el._id) }, 'createdOn')),
      );
    },
  );

  test(
    'Should not update order with invalid token',
    { tag: ['@002_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      const incalidToken = 'qwerty';
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      customer = await customersApiService.create(token);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: productIds },
        incalidToken,
      );

      validateResponse(updateResponse, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order with missing token',
    { tag: ['@003_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      const incalidToken = '';
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      customer = await customersApiService.create(token);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: productIds },
        incalidToken,
      );

      validateResponse(updateResponse, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order with customer value missing',
    { tag: ['@005_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, productsApiService }) => {
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      const updateResponse = await ordersController.update(order._id, { customer: '', products: productIds }, token);

      validateResponse(updateResponse, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_MISSING_CUSTOMER);
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order with invalid customerId',
    { tag: ['@006_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, productsApiService }) => {
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      const updateResponse = await ordersController.update(order._id, { customer: '123', products: productIds }, token);

      validateResponse(updateResponse, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_BAD_REQUEST);
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order with unexisting customerId',
    { tag: ['@006_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, productsApiService }) => {
      products = await productsApiService.createBulk(1, token);
      productIds = products.map((el) => el._id);
      const unexistingCustomerID = generateID();
      const updateResponse = await ordersController.update(
        order._id,
        { customer: unexistingCustomerID, products: productIds },
        token,
      );

      validateResponse(
        updateResponse,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.CUSTOMER_NOT_FOUND(unexistingCustomerID),
      );
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order without products (empty array)',
    { tag: ['@007_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService }) => {
      productIds = [];
      customer = await customersApiService.create(token);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: productIds },
        token,
      );

      validateResponse(updateResponse, STATUS_CODES.BAD_REQUEST, false, API_ERRORS.ORDER_BAD_REQUEST);
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order with 1 invalid productId',
    { tag: ['@009_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService }) => {
      const unexistingProducId = generateID();
      customer = await customersApiService.create(token);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: [unexistingProducId] },
        token,
      );

      validateResponse(updateResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(unexistingProducId));
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );

  test(
    'Should not update order with if one of productId is invalid',
    { tag: ['@010_O_PUT_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      const unexistingProducId = generateID();
      customer = await customersApiService.create(token);
      products = await productsApiService.createBulk(3, token);
      productIds = products.map((el) => el._id);
      const updateResponse = await ordersController.update(
        order._id,
        { customer: customer._id, products: [...productIds, unexistingProducId] },
        token,
      );

      validateResponse(updateResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(unexistingProducId));
      validateSchema(errorResponseSchema, updateResponse.body);
    },
  );
});
