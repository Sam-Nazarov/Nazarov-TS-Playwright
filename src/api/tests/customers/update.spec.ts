import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { generateCustomerData, udateCustomerNegativeTestData } from 'data/customers';
import { udateCustomerPositiveTestData } from 'data/customers';
import { customerSchema, errorResponseSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import _ from 'lodash';
import { ICustomer, ICustomerFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Customers] [Update]', () => {
  let token = '';
  let customerId = '';
  let createdCustomer: ICustomerFromResponse;

  test.beforeEach(async ({ customersApiService, signInApiService }) => {
    token = await signInApiService.getAuthToken();
    createdCustomer = await customersApiService.create(token, generateCustomerData());
    customerId = createdCustomer._id;
  });
  test.afterEach(async ({ customersApiService }) => {
    await customersApiService.delete(customerId, token);
  });

  udateCustomerPositiveTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ customersController }) => {
      const updatedCustomerResponse = await customersController.update(customerId, data.data, token);
      validateSchema(customerSchema, updatedCustomerResponse.body);
      validateResponse(updatedCustomerResponse, STATUS_CODES.OK, true, null);
      expect(updatedCustomerResponse.body.Customer).toMatchObject(data.data);
    });
  });

  udateCustomerNegativeTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ customersController }) => {
      const updateCustomerResponse = await customersController.update(customerId, data.data as ICustomer, token);
      validateSchema(errorResponseSchema, updateCustomerResponse.body);
      validateResponse(updateCustomerResponse, data.statusCode, false, data.error);
    });
  });

  test(
    'Should update customer without changing Email (same unique email)',
    { tag: ['@5_C_UP_API', TAGS.API] },
    async ({ customersController }) => {
      const updateCusomerBody = generateCustomerData({ email: createdCustomer.email });
      const updatedCustomerResponse = await customersController.update(customerId, updateCusomerBody, token);
      validateSchema(customerSchema, updatedCustomerResponse.body);
      validateResponse(updatedCustomerResponse, STATUS_CODES.OK, true, null);
      expect(updateCusomerBody).toMatchObject({
        ..._.omit(updatedCustomerResponse.body.Customer, ['createdOn', '_id']),
      });
    },
  );

  test(
    'Should not update customer when Bearer Token is missing',
    { tag: ['@6_C_UP_API', TAGS.API] },
    async ({ customersController }) => {
      const miissedToken = '';
      const updateCustomerResponse = await customersController.update(customerId, generateCustomerData(), miissedToken);
      validateSchema(errorResponseSchema, updateCustomerResponse.body);
      validateResponse(updateCustomerResponse, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.EMPTY_TOKEN);
    },
  );

  test(
    'Should not update customer when Bearer Token is invalid',
    { tag: ['@7_C_UP_API', TAGS.API] },
    async ({ customersController }) => {
      const invalidToken = 'token';
      const updateCustomerResponse = await customersController.update(customerId, generateCustomerData(), invalidToken);
      validateSchema(errorResponseSchema, updateCustomerResponse.body);
      validateResponse(updateCustomerResponse, STATUS_CODES.UNAUTHORIZED, false, API_ERRORS.INVALID_TOKEN);
    },
  );

  test(
    'Should not update customer when Email is not unique',
    { tag: ['@10_C_CR_API', TAGS.API] },
    async ({ customersController, customersApiService }) => {
      const secondCustomerBody = await customersController.create(generateCustomerData(), token);
      const updateCustomerResponse = await customersController.update(
        secondCustomerBody.body.Customer._id,
        generateCustomerData({ email: createdCustomer.email }),
        token,
      );
      validateSchema(errorResponseSchema, updateCustomerResponse.body);
      validateResponse(
        updateCustomerResponse,
        STATUS_CODES.CONFLICT,
        false,
        API_ERRORS.CUSTOMER_EMAIL_ALREADY_EXIST(createdCustomer.email),
      );
      customersApiService.delete(secondCustomerBody.body.Customer._id, token);
    },
  );

  test(
    'Should not update customer when ID does not exist',
    { tag: ['@35_C_UP_API', TAGS.API] },
    async ({ customersController }) => {
      const randomId = generateID();
      const updateCustomerResponse = await customersController.update(randomId, generateCustomerData(), token);
      validateSchema(errorResponseSchema, updateCustomerResponse.body);
      validateResponse(updateCustomerResponse, STATUS_CODES.NOT_FOUND, false, API_ERRORS.CUSTOMER_NOT_FOUND(randomId));
    },
  );
});
