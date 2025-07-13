import { generateFullCustomerData } from 'data/customers';
import { generateProductDataForOrder } from 'data/products';
import { ICustomerFromResponse, IProductInOrder } from 'types';
import { generateID } from 'utils';
import { ORDER_STATUSES } from '..';
import { STATUS_CODES, TAGS } from 'data';

const customerWithNotes: ICustomerFromResponse = generateFullCustomerData();
const customerWithoutNotes: ICustomerFromResponse = generateFullCustomerData({ notes: '' });
const product: IProductInOrder = generateProductDataForOrder();

export const customerDetails = [
  {
    tag: ['@001_O_CM_UI', TAGS.UI, TAGS.COMPONENT],
    testName: 'Should display correct data in Customer Details table after openning the page',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.DRAFT,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
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
    tag: ['@002_O_CM_UI', TAGS.UI, TAGS.COMPONENT],
    testName: 'Should display correct data in Customer Details table after openning the page(without Notes)',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.DRAFT,
        customer: customerWithoutNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
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

export const orderWithDifferentStatuses = [
  {
    tag: ['@004_O_CM_UI', TAGS.UI, TAGS.COMPONENT],
    testName: 'Should not display edit button if order is in In Process status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.IN_PROCESS,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
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
    tag: ['@006_O_CM_UI', TAGS.UI, TAGS.COMPONENT],
    testName: 'Should not display edit button if order is in Received status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.RECEIVED,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
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
    tag: ['@007_O_CM_UI', TAGS.UI, TAGS.COMPONENT],
    testName: 'Should not display edit button if order is in Canceled status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.CANCELED,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
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
    tag: ['@008_O_CM_UI', TAGS.UI, TAGS.COMPONENT],
    testName: 'Should not display edit button if order is in Partially Received status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.PARTIALLY_RECEIVED,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
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

export const orderInDefaultStatus = {
  Order: {
    _id: generateID(),
    status: ORDER_STATUSES.DRAFT,
    customer: customerWithNotes,
    products: [product],
    delivery: null,
    total_price: product.price,
    createdOn: new Date().toISOString(),
    comments: [],
    history: [],
    assignedManager: null,
  },
  IsSuccess: true,
  ErrorMessage: null,
};

export const errorResponseForCustomerDetailsInOrder = [
  {
    testName: 'Should displaye error notification if getAllCustomers request returns 400 error',
    tag: ['@011_O_CM_UI', TAGS.INTEGRATION],
    statusCode: STATUS_CODES.BAD_REQUEST,
    Response: { IsSuccess: false, ErrorMessage: 'Bad request' },
  },
  {
    testName: 'Should displaye error notification if getAllCustomers request returns 500 error',
    tag: ['@012_O_CM_UI', TAGS.INTEGRATION],
    statusCode: STATUS_CODES.SERVER_ERROR,
    Response: { IsSuccess: false, ErrorMessage: 'Internal server error' },
  },
];

export const errorResponseForUpdateCustomer = [
  {
    testName: 'Should displaye error notification if UpdateOrder request returns 400 error',
    tag: ['@015_O_CM_UI', TAGS.INTEGRATION],
    statusCode: STATUS_CODES.BAD_REQUEST,
    response: { IsSuccess: false, ErrorMessage: 'Bad request' },
  },
  {
    testName: 'Should displaye error notification if UpdateOrder request returns 500 error',
    tag: ['@016_O_CM_UI', TAGS.INTEGRATION],
    statusCode: STATUS_CODES.SERVER_ERROR,
    response: { IsSuccess: false, ErrorMessage: 'Internal server error' },
  },
];

export const getAllCustomersResponselist = {
  IsSuccess: true,
  ErrorMessage: null,
  Customers: [customerWithNotes, customerWithoutNotes],
};
