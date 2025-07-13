export const errorResponseSchema = {
  type: 'object',
  properties: {
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: 'string' },
  },
  required: ['IsSuccess', 'ErrorMessage'],
};
