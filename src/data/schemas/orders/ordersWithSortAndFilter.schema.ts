import { SORT_ORDER } from 'data/sortOrder.data';
import { orderSchema } from './order.schema';
import { SORT_FIELD_ORDERS } from 'data/orders/sortFields.data';
import { ORDER_STATUSES } from 'data/orders';

export const ordersWithSortAndFilter = {
  type: 'object',
  properties: {
    ErrorMessage: { type: ['string', 'null'] },
    IsSuccess: { type: 'boolean' },
    Orders: { type: 'array', items: orderSchema.properties.Order },
    limit: { type: 'number' },
    page: { type: 'number' },
    search: { type: 'string' },
    sorting: {
      type: 'object',
      properties: {
        sortField: { type: 'string', enum: Object.values(SORT_FIELD_ORDERS) },
        sortOrder: { type: 'string', enum: Object.values(SORT_ORDER) },
      },
      required: ['sortField', 'sortOrder'],
    },
    status: { type: 'array', items: { type: 'string', enum: Object.values(ORDER_STATUSES) } },
    total: { type: 'number' },
  },
  required: ['ErrorMessage', 'IsSuccess', 'Orders', 'limit', 'page', 'search', 'sorting', 'status', 'total'],
};
