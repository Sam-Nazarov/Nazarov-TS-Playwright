export const ALERTS = {
  CUSTOMER_CREATED: 'Customer was successfully created',
  CUSTOMER_DUPLICATED: (email: string) => `Customer with email '${email}' already exists`,
  CUSTOMER_DELETED: 'Customer was successfully deleted',
  ORDER_UPDATED: 'Order was successfully updated',
  ORDER_CREATED: 'Order was successfully created',
  MANAGER_ASSIGNED: 'Manager was successfully assigned to the order',
  MANAGER_UNASSIGNED: 'Manager was successfully unassigned from the order',
  DELIVERY_SAVED: 'Delivery was successfully saved',
  COMMENT_CREATED: 'Comment was successfully posted',
  COMMENT_DELETED: 'Comment was successfully deleted',
  UPDATE_PRODUCT_FAILED: 'Failed to update products. Please try again later.', // Displayed if UpdateOrder request returns error
  UPDATE_PRODCUT_UNABLED: 'Unable to update products. Please try again later.', // Displayed if GetAllProducts request returns error
  UPDATE_CUSTOMRE_IS_UNABLE: 'Unable to update customer. Please try again later.',
  UPDATE_CUSTOMER_FAILED: 'Failed to update customer. Please try again later.',
  ORDER_REOPEN: 'Order was successfully reopened',
  ORDER_CANCELED: 'Order was successfully canceled',
  ORDER_PROCESS: 'Order processing was successfully started',
  PRODUCTS_RECEIVED: 'Products were successfully received',
};

export const EMPTY_TABLE_ROW_TEXT = 'No records created yet';
