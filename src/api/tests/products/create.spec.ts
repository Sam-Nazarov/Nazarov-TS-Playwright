import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { generateProductData } from 'data/products';
import { productSchema, errorResponseSchema } from 'data/schemas';
import { productPositiveTestData, productNegativeTestData } from 'data/products';
import { expect, test } from 'fixtures';
import { IProduct } from 'types';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Product] [Create]', () => {
  let token = '';
  let createdProductId = '';
  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ productsApiService }) => {
    if (createdProductId) {
      await productsApiService.delete(createdProductId, token);
    }
  });

  productPositiveTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ productsController }) => {
      const productResponse = await productsController.create(data.data, token);
      createdProductId = productResponse.body.Product._id;
      validateSchema(productSchema, productResponse.body);
      validateResponse(productResponse, STATUS_CODES.CREATED, true, null);
      expect(productResponse.body.Product).toMatchObject({ ...data.data });
    });
  });

  productNegativeTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ productsController }) => {
      const response = await productsController.create(data.data as IProduct, token);
      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, data.statusCode, false, data.error);
    });
  });

  test(
    'Should not create a product when Bearer Token is missing',
    { tag: ['@003_P_POST_API', TAGS.API] },
    async ({ productsController }) => {
      token = '';
      const response = await productsController.create(generateProductData(), token);
      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
    },
  );

  test(
    'Should not create a product when Name is not unique',
    { tag: ['@010_P_POST_API', TAGS.API] },
    async ({ productsController }) => {
      const firstProductResponse = await productsController.create(generateProductData(), token);
      const productName = firstProductResponse.body.Product.name;
      const secondProductResponse = await productsController.create(
        generateProductData({ name: firstProductResponse.body.Product.name }),
        token,
      );
      validateSchema(errorResponseSchema, secondProductResponse.body);
      validateResponse(
        secondProductResponse,
        STATUS_CODES.CONFLICT,
        false,
        API_ERRORS.PRODUCT_NAME_ALREADY_EXISTS(productName),
      );
    },
  );

  test(
    'Should not create a product when Bearer Token is invalid',
    { tag: ['@004_P_POST_API', TAGS.API] },
    async ({ productsController }) => {
      token = 'hello!';
      const productResponse = await productsController.create(generateProductData(), token);
      validateSchema(errorResponseSchema, productResponse.body);
      validateResponse(productResponse, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
    },
  );
});
