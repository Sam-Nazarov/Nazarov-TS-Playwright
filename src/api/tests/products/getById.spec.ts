import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { errorResponseSchema, productSchema } from 'data/schemas';
import { test, expect } from 'fixtures';
import { IProductFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Products] [Get By Id]', () => {
  let token = '';
  let createdProduct: IProductFromResponse;

  test.beforeEach(async ({ productsApiService, signInApiService }) => {
    token = await signInApiService.getAuthToken();
    createdProduct = await productsApiService.create(token);
  });

  test.afterAll(async ({ productsApiService }) => {
    await productsApiService.delete(createdProduct._id, token);
  });

  test(
    'Should get product by ID',
    { tag: ['@1_P_GTID_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.getById(createdProduct._id, token);

      validateSchema(productSchema, response.body);
      validateResponse(response, STATUS_CODES.OK, true, null);
      test.step('Created product should match the response', () => {
        expect.soft(response.body.Product).toEqual(createdProduct);
      });
    },
  );

  test(
    'Should return 404 error for non-existent ID',
    { tag: ['@2_P_GTID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const nonExistentId = generateID();
      const response = await productsController.getById(nonExistentId, token);

      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(nonExistentId));
    },
  );

  test(
    'Should return 404 error for invalid format ID',
    { tag: ['@3_P_GTID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const invalidID = '123';
      const response = await productsController.getById(invalidID, token);

      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, API_ERRORS.PRODUCT_NOT_FOUND(invalidID));
    },
  );

  test(
    'Should return 401 error for existing product when token is missed',
    { tag: ['@4_P_GTID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.getById(createdProduct._id, '');

      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
    },
  );

  test(
    'Should return 401 error for existing product when token is invalid',
    { tag: ['@5_P_GTID_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.getById(createdProduct._id, '123');

      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
    },
  );
});
