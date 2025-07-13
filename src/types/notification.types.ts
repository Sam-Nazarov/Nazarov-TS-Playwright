import { ORDER_NOTIFICATIONS } from 'data/orders';
import { IResponseFields } from 'types';

export type NotificationType = keyof typeof ORDER_NOTIFICATIONS;

export type NotificationMsg = (typeof ORDER_NOTIFICATIONS)[NotificationType];

export interface INotificationFromResponse {
  _id: string;
  userId: string;
  type: NotificationType;
  orderId: string;
  message: NotificationMsg;
  read: boolean;
  createdAt: string;
  expiresAt: string;
  updatedAt: string;
}

export interface INotificationsResponse extends IResponseFields {
  Notifications: INotificationFromResponse[];
}

export interface INotificationsFromModal {
  id: string;
  date: string;
  text: NotificationMsg;
  read: boolean;
  orderId: string;
}
