import { API_ERRORS, STATUS_CODES, TAGS } from 'data';

export const orderTestData = [
  {
    testName: 'Should not create order with invalid token',
    token: '1234',
    tag: ['@004_O_POST_API', TAGS.API, TAGS.REGRESSION],
    error: API_ERRORS.INVALID_TOKEN,
    status: STATUS_CODES.UNAUTHORIZED,
  },
  {
    testName: 'Should not create order with missing token',
    token: '',
    tag: ['@005_O_POST_API', TAGS.API, TAGS.REGRESSION],
    error: API_ERRORS.EMPTY_TOKEN,
    status: STATUS_CODES.UNAUTHORIZED,
  },

  {
    testName: 'Should not update order with customer value missing',
    customer: '',
    tag: ['@007_O_POST_API', TAGS.API, TAGS.REGRESSION],
    error: API_ERRORS.ORDER_WITHOUT_CUSTOMER,
    status: STATUS_CODES.NOT_FOUND,
  },
  {
    testName: 'Should not create order without products (empty array)',
    products: [],
    tag: ['@009_O_POST_API', TAGS.API, TAGS.REGRESSION],
    error: API_ERRORS.ORDER_BAD_REQUEST,
    status: STATUS_CODES.BAD_REQUEST,
  },
];
