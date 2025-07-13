import { ORDER_STATUSES } from '.';

export const ORDER_NOTIFICATIONS = {
  statusChanged: (status: ORDER_STATUSES) => `Status has been updated to "${status}" in order.`,
  customerChanged: `Customer has been changed in order.`,
  productsChanged: `Products have been updated in order.`,
  deliveryUpdated: `Delivery details have been added or updated in order.`,
  productsDelivered: `Products have been marked as delivered in order.`,
  managerChanged: `You have been reassigned to order.`,
  commentAdded: `A new comment has been added to order.`,
  newOrder: `A new order has been created`,
  commentDeleted: `A comment has been deleted from order`,
  assigned: `You have been assigned to order`,
  unassigned: `You have been unassigned from order`,
} as const;
