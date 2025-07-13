export const notificationsSchema = {
  type: 'object',
  properties: {
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
    Notifications: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          createdAt: { type: 'string' },
          expiresAt: { type: 'string' },
          message: { type: 'string' },
          orderId: { type: 'string' },
          read: { type: 'boolean' },
          type: { type: 'string' },
          updatedAt: { type: 'string' },
          userId: { type: 'string' },
          _id: { type: 'string' },
        },
        required: ['createdAt', 'expiresAt', 'message', 'orderId', 'read', 'type', 'updatedAt', 'userId', '_id'],
      },
    },
  },
  required: ['IsSuccess', 'ErrorMessage', 'Notifications'],
};
