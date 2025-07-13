import { productSchema } from './product.schema';

export const allProductsSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productSchema.properties.Product,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Products', 'IsSuccess', 'ErrorMessage'],
};
