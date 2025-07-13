import { API_ERRORS } from 'data/errors.data';
import { STATUS_CODES } from 'data/statusCodes.data';
import { TAGS } from 'data/tags.data';
import { generateCommentData } from '..';

export const commentTestData = [
  {
    testName: 'Should not create a comment with invalid token',
    tag: ['@002_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: generateCommentData(),
    token: '123',
    statusCode: STATUS_CODES.UNAUTHORIZED,
    error: API_ERRORS.INVALID_TOKEN,
  },
  {
    testName: 'Should not create a comment with missing token',
    tag: ['@003_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: generateCommentData(),
    token: '',
    statusCode: STATUS_CODES.UNAUTHORIZED,
    error: API_ERRORS.EMPTY_TOKEN,
  },
  {
    testName: 'Should not create a comment with orderId as empty string',
    tag: ['@004_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: generateCommentData(),
    orderId: '',
    statusCode: STATUS_CODES.NOT_FOUND,
    error: API_ERRORS.ORDER_NOT_FOUND(''),
  },
  {
    testName: 'Should not create a comment with orderId invalid format (non hex, 12-byte string, int)',
    tag: ['@005_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: generateCommentData(),
    orderId: '123',
    statusCode: STATUS_CODES.BAD_REQUEST,
    error: API_ERRORS.CUSTOMER_BAD_REQUEST,
  },
  {
    testName: 'Should not create a comment with >250 characters long',
    tag: ['@007_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: {
      comment: 't'.repeat(251),
    },
    statusCode: STATUS_CODES.BAD_REQUEST,
    error: API_ERRORS.CUSTOMER_BAD_REQUEST,
  },
  {
    testName: 'Should not create a comment with ">" or "<" symbols',
    tag: ['@008_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: {
      comment: '<test comment>',
    },
    statusCode: STATUS_CODES.BAD_REQUEST,
    error: API_ERRORS.CUSTOMER_BAD_REQUEST,
  },
  {
    testName: 'Should not create a comment with comment field as empty string',
    tag: ['@009_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: {
      comment: '',
    },
    statusCode: STATUS_CODES.BAD_REQUEST,
    error: API_ERRORS.CUSTOMER_BAD_REQUEST,
  },
  {
    testName: 'Should not create a comment with comment property missing (empty object sending)',
    tag: ['@010_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    body: {},
    statusCode: STATUS_CODES.BAD_REQUEST,
    error: API_ERRORS.CUSTOMER_BAD_REQUEST,
  },
];

export const deleteCommentTestData = [
  {
    testName: 'Should not delete a comment with invalid token',
    tag: ['@002_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION],
    token: 'qwerty',
    statusCode: STATUS_CODES.UNAUTHORIZED,
    error: API_ERRORS.INVALID_TOKEN,
  },
  {
    testName: 'Should not delete a comment with missing token',
    tag: ['@003_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION],
    token: '',
    statusCode: STATUS_CODES.UNAUTHORIZED,
    error: API_ERRORS.EMPTY_TOKEN,
  },
  {
    testName: 'Should not delete a comment with orderId as empty string',
    tag: ['@004_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION],
    orderId: '',
    statusCode: STATUS_CODES.NOT_FOUND,
    error: API_ERRORS.ORDER_BAD_REQUEST,
  },
  {
    testName: 'Should not delete a comment with orderId invalid format (non hex, 12-byte string, int)',
    tag: ['@005_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION],
    orderId: '123',
    statusCode: STATUS_CODES.BAD_REQUEST,
    error: API_ERRORS.ORDER_BAD_REQUEST,
  },
  {
    testName: 'Should not delete a comment with commentId missing',
    tag: ['@007_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION],
    commentID: '',
    statusCode: STATUS_CODES.NOT_FOUND,
    error: API_ERRORS.ORDER_BAD_REQUEST,
  },
];
