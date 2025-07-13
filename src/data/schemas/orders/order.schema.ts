import { COUNTRIES } from 'data/customers';
import { DELIVERY_CONDITIONS, ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from 'data/orders';
import { MANUFACTURERS } from 'data/products';
import { ROLES } from 'data/roles.data';
import { customerSchema } from 'data/schemas';

const productsSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    price: { type: 'number' },
    manufacturer: { type: 'string', enum: Object.values(MANUFACTURERS) },
    received: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'received'],
};

const commentsSchema = {
  type: 'object',
  properties: {
    createdOn: { type: 'string' },
    text: { type: 'string' },
    _id: { type: 'string' },
  },
  required: ['createdOn', 'text', '_id'],
};

const assignedManagerSchema = {
  anyOf: [
    {
      type: 'object',
      properties: {
        createdOn: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        username: { type: 'string' },
        _id: { type: 'string' },
        roles: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values(ROLES),
          },
        },
      },
      required: ['createdOn', 'firstName', 'lastName', 'username', '_id', 'roles'],
    },
    { type: 'null' },
  ],
};

const deliverySchema = {
  anyOf: [
    {
      type: 'object',
      properties: {
        condition: { type: 'string', enum: Object.values(DELIVERY_CONDITIONS) },
        finalDate: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            country: { type: 'string', enum: Object.values(COUNTRIES) },
            city: { type: 'string' },
            street: { type: 'string' },
            house: { type: 'number' },
            flat: { type: 'number' },
          },
          required: ['country', 'city', 'street', 'house', 'flat'],
        },
      },
      required: ['condition', 'finalDate', 'address'],
    },
    { type: 'null' },
  ],
};

const historySchema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: Object.values(ORDER_HISTORY_ACTIONS) },
    assignedManager: assignedManagerSchema,
    changedOn: { type: 'string' },
    customer: { type: 'string' },
    delivery: deliverySchema,
    products: { type: 'array', items: productsSchema },
    status: { type: 'string', enum: Object.values(ORDER_STATUSES) },
    total_price: { type: 'number' },
    performer: assignedManagerSchema,
  },
  required: [
    'action',
    'assignedManager',
    'changedOn',
    'customer',
    'delivery',
    'products',
    'status',
    'total_price',
    'performer',
  ],
};

export const orderSchema = {
  type: 'object',
  properties: {
    Order: {
      type: 'object',
      properties: {
        comments: { type: 'array', items: commentsSchema },
        createdOn: { type: 'string' },
        assignedManager: assignedManagerSchema,
        delivery: deliverySchema,
        history: {
          type: 'array',
          items: historySchema,
        },
        products: {
          type: 'array',
          items: productsSchema,
        },
        customer: customerSchema.properties.Customer,
        status: { type: 'string', enum: Object.values(ORDER_STATUSES) },
        total_price: { type: 'number' },
        _id: { type: 'string' },
      },
      required: [
        'comments',
        'createdOn',
        'assignedManager',
        'delivery',
        'history',
        'products',
        'customer',
        'status',
        'total_price',
        '_id',
      ],
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Order', 'IsSuccess', 'ErrorMessage'],
};
