import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { generateProductData } from './generateProduct.data';
import _ from 'lodash';

export const productPositiveTestData = [
  {
    testName: 'Should create product using all correct fields and valid token',
    tag: ['@001_P_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    data: generateProductData(),
  },
  {
    testName: 'Should create product using only required fields (without notes)',
    tag: ['@002_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ notes: '' }),
  },
];

export const productNegativeTestData = [
  {
    testName: "Should not create product when required field 'Name' is missing",
    tag: ['@006_P_POST_API', TAGS.API],
    data: _.omit(generateProductData(), ['name']),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: "Should not create product when required field 'Name' is empty string",
    tag: ['@007_P_POST_API', TAGS.API],
    data: generateProductData({ name: '' }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Name has leading spaces',
    tag: ['@008_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ name: `  Product ${Date.now()}` }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Name has trailing spaces',
    tag: ['@009_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ name: `Product ${Date.now()}  ` }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Name contains special characters',
    tag: ['@011_P_POST_API', TAGS.API, TAGS.REGRESSION, TAGS.SMOKE],
    data: generateProductData({ name: `Product ${Date.now()}%*#()` }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Name has more than one space between words',
    tag: ['@012_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ name: `Product   ${Date.now()}` }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Name length exceeds 44 characters',
    tag: ['@013_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ name: 'a'.repeat(45) }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: "Should not create product when required field 'Amount' is missing",
    tag: ['@014_P_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    data: _.omit(generateProductData(), ['amount']),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Amount value is less than 0',
    tag: ['@015_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ amount: -1 }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Amount value is more than 999',
    tag: ['@016_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ amount: 1000 }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: "Should not create product when required field 'Price' is missing",
    tag: ['@017_P_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    data: _.omit(generateProductData(), ['price']),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Price value is less than 0',
    tag: ['@018_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ amount: -5 }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Price value is more than 99999',
    tag: ['@019_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ amount: 100000 }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: "Should not create product when 'Manufacturer' required field is missing",
    tag: ['@020_P_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    data: _.omit(generateProductData(), ['manufacturer']),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: "Should not create product when 'Manufacturer' is not from the expected enum list",
    tag: ['@021_P_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    data: _.merge(
      _.omit(generateProductData(), ['manufacturer']),
      (generateProductData(), { manufacturer: 'invalid manufacturer' }),
    ),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: "Should not create product when Notes contains '<' or '>' characters",
    tag: ['@022_P_POST_API', TAGS.API, TAGS.REGRESSION, TAGS.SMOKE],
    data: generateProductData({ notes: `Notes for product ${Date.now()}>` }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  {
    testName: 'Should not create product when Notes length exceeds 250 characters',
    tag: ['@023_P_POST_API', TAGS.API, TAGS.REGRESSION],
    data: generateProductData({ name: 'a'.repeat(251) }),
    error: API_ERRORS.PRODUCT_BAD_REQUEST,
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
];
