export const loginSchema = {
  type: 'object',
  properties: {
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        createdOn: { type: 'string' },
        roles: { type: 'array', items: { type: 'string' } },
      },
      required: ['_id', 'username', 'firstName', 'lastName', 'createdOn', 'roles'],
    },
  },
  required: ['IsSuccess', 'ErrorMessage', 'User'],
};
