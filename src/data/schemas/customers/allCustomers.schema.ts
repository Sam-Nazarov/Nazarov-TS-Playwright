import { customerSchema } from './customer.schema';

export const allCustomersSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema.properties.Customer,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Customers', 'IsSuccess', 'ErrorMessage'],
};
