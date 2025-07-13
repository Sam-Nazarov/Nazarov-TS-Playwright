import { generateFullCustomerData } from 'data/customers';
import { ICustomerFromResponse } from 'types';
import { generateID } from 'utils';
import { ORDER_STATUSES } from '..';
import { STATUS_CODES, TAGS } from 'data';
import _ from 'lodash';
import { generateProductDataForOrder } from 'data/products';

const customer: ICustomerFromResponse = generateFullCustomerData();

const productWithNotes = generateProductDataForOrder();
const productWithoutNotes = generateProductDataForOrder({ notes: '' });
export const productDetails = [
  {
    tag: [TAGS.UI, TAGS.INTEGRATION],
    testName:
      'Should display correct data in Product Details table after openning the page (with Notes and Received Status)',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.DRAFT,
        customer: customer,
        products: [productWithNotes],
        delivery: null,
        total_price: productWithNotes.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: [TAGS.UI, TAGS.INTEGRATION],
    testName:
      'Should display correct data in Product Details table after openning the page(without Notes and and Not Received status))',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.DRAFT,
        customer: customer,
        products: [productWithoutNotes],
        delivery: null,
        total_price: productWithoutNotes.price,
        createdOn: '2025-07-08T13:23:56.000Z',
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },
];

export const orderWithDifferentStatus = [
  {
    tag: [TAGS.UI, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in In Process status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.IN_PROCESS,
        customer: customer,
        products: [productWithoutNotes],
        delivery: null,
        total_price: productWithoutNotes.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: [TAGS.UI, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in Received status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.RECEIVED,
        customer: customer,
        products: [productWithoutNotes],
        delivery: null,
        total_price: productWithoutNotes.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: [TAGS.UI, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in Canceled status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.CANCELED,
        customer: customer,
        products: [productWithoutNotes],
        delivery: null,
        total_price: productWithoutNotes.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: [TAGS.UI, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in Partially Received status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.PARTIALLY_RECEIVED,
        customer: customer,
        products: [productWithoutNotes],
        delivery: null,
        total_price: productWithoutNotes.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },
];

export const orderInDraftStatus = {
  Order: {
    _id: generateID(),
    status: ORDER_STATUSES.DRAFT,
    customer: customer,
    products: [productWithoutNotes],
    delivery: null,
    total_price: productWithoutNotes.price,
    createdOn: new Date().toISOString(),
    comments: [],
    history: [],
    assignedManager: null,
  },
  IsSuccess: true,
  ErrorMessage: null,
};

export const orderInProcessStatus = {
  Order: {
    _id: generateID(),
    status: ORDER_STATUSES.IN_PROCESS,
    customer: customer,
    products: [productWithoutNotes],
    delivery: null,
    total_price: productWithoutNotes.price,
    createdOn: new Date().toISOString(),
    comments: [],
    history: [],
    assignedManager: null,
  },
  IsSuccess: true,
  ErrorMessage: null,
};

export const errorResponseForAllProductsRequest = [
  {
    testName: 'Should displaye error notification if getAllProducts request returns 400 error',
    tag: [TAGS.UI, TAGS.INTEGRATION],
    statusCode: STATUS_CODES.BAD_REQUEST,
    Response: { IsSuccess: false, ErrorMessage: 'Bad request' },
  },
  {
    testName: 'Should displaye error notification if getAllProducts request returns 500 error',
    tag: [TAGS.UI, TAGS.INTEGRATION],
    statusCode: STATUS_CODES.SERVER_ERROR,
    Response: { IsSuccess: false, ErrorMessage: 'Internal server error' },
  },
];

export const errorResponseForUpdateProduct = [
  {
    testName: 'Should displaye error notification if UpdateOrder request returns 400 error',
    tag: [TAGS.UI, TAGS.INTEGRATION],
    statusCode: STATUS_CODES.BAD_REQUEST,
    response: { IsSuccess: false, ErrorMessage: 'Bad request' },
  },
  {
    testName: 'Should displaye error notification if UpdateOrder request returns 500 error',
    tag: [TAGS.UI, TAGS.INTEGRATION],
    statusCode: STATUS_CODES.SERVER_ERROR,
    response: { IsSuccess: false, ErrorMessage: 'Internal server error' },
  },
];

export const getAllProductsResponselist = {
  IsSuccess: true,
  ErrorMessage: null,
  Products: [_.omit(productWithNotes, 'recieved'), _.omit(productWithoutNotes, 'recieved')],
};
