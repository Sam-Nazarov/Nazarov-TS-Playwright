import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { allProductsSchema, errorResponseSchema } from 'data/schemas';
import { test, expect } from 'fixtures';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Products] [Get All]', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test(
    'Should get all products w/o filters',
    { tag: ['@1_P_GTA_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ productsController, productsApiService }) => {
      const createdProduct = await productsApiService.create(token);

      const response = await productsController.getAll(token);
      const productFromResponse = response.body.Products.find((prod) => prod._id === createdProduct._id);

      validateSchema(allProductsSchema, response.body);
      validateResponse(response, STATUS_CODES.OK, true, null);
      test.step('Created product should be in the response', () => {
        expect.soft(productFromResponse).toEqual(createdProduct);
      });

      await productsApiService.delete(createdProduct._id, token);
    },
  );

  test(
    'Should return 401 error when token is missed',
    { tag: ['@2_P_GTA_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.getAll('');
      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
    },
  );

  test(
    'Should return 401 error when token is invalid',
    { tag: ['@3_P_GTA_API', TAGS.API, TAGS.REGRESSION] },
    async ({ productsController }) => {
      const response = await productsController.getAll('123');
      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
    },
  );
});
