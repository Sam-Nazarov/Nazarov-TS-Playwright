import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { generateCustomerData } from 'data/customers';
import { customerNegativeTestData, customerPositiveTestData } from 'data/customers';
import { customerSchema, errorResponseSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { ICustomer } from 'types';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [CUstomer] [Create]', () => {
  let token = '';
  let customerId = '';
  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.getAuthToken();
  });

  test.afterEach(async ({ customersApiService }) => {
    if (!customerId) return;
    else await customersApiService.delete(customerId, token);
  });

  customerPositiveTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ customersController }) => {
      const customerResponse = await customersController.create(data.data, token);
      customerId = customerResponse.body.Customer._id;
      validateSchema(customerSchema, customerResponse.body);
      validateResponse(customerResponse, STATUS_CODES.CREATED, true, null);
      expect(customerResponse.body.Customer).toMatchObject({ ...data.data });
    });
  });

  customerNegativeTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ customersController }) => {
      const response = await customersController.create(data.data as ICustomer, token);
      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, data.statusCode, false, data.error);
    });
  });

  test(
    'Should not create customer when Bearer Token is missing',
    { tag: ['@6_C_CR_API', TAGS.API] },
    async ({ customersController }) => {
      token = '';
      const response = await customersController.create(generateCustomerData(), token);
      validateSchema(errorResponseSchema, response.body);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
    },
  );

  test(
    'Should not create customer when Email is not unique',
    { tag: ['@9_C_CR_API', TAGS.API] },
    async ({ customersController }) => {
      const firstCustomerResponse = await customersController.create(generateCustomerData(), token);
      customerId = firstCustomerResponse.body.Customer._id;
      const secondCustomerResponse = await customersController.create(
        generateCustomerData({ email: firstCustomerResponse.body.Customer.email }),
        token,
      );
      validateSchema(errorResponseSchema, secondCustomerResponse.body);
      validateResponse(
        secondCustomerResponse,
        STATUS_CODES.CONFLICT,
        false,
        API_ERRORS.CUSTOMER_EMAIL_ALREADY_EXIST(firstCustomerResponse.body.Customer.email),
      );
    },
  );

  test(
    'hould not create customer when Bearer Token is invalid',
    { tag: ['@5_C_CR_API', TAGS.API] },
    async ({ customersController }) => {
      token = 'abc';
      const customerResponse = await customersController.create(generateCustomerData(), token);
      validateSchema(errorResponseSchema, customerResponse.body);
      validateResponse(customerResponse, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
    },
  );
});
