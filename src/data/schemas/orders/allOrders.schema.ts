import { orderSchema } from './order.schema';

export const allOrdersSchema = {
  type: 'object',
  properties: {
    Orders: {
      type: 'array',
      items: orderSchema.properties.Order,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Orders', 'IsSuccess', 'ErrorMessage'],
};
