import { INotificationsFromModal, NotificationMsg } from 'types';
import { BaseProjectPage } from '../baseProject.page';
import { logStep } from 'utils';
import { expect } from 'fixtures';

export class NotificationsModal extends BaseProjectPage {
  readonly notificationsModal = this.page.locator('#notification-popover');
  readonly notificationsList = this.notificationsModal.locator('#notification-list');
  readonly readAllButton = this.notificationsModal.locator('#mark-all-read');
  readonly closeButton = this.notificationsModal.locator('.btn-close');
  readonly notifications = this.notificationsList.locator('.list-group-item');
  readonly topNotification = this.notifications.nth(0);

  uniqueElement = this.notificationsModal;

  @logStep('Get the full list of notifications')
  async getNotifications(): Promise<INotificationsFromModal[]> {
    const count = await this.notifications.count();
    const notifications: INotificationsFromModal[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.notifications.nth(i);
      const container = item.locator('div');
      const orderLink = item.locator('[data-testid="order-details-link"]');

      const id = await container.getAttribute('data-notificationid');
      const read = (await container.getAttribute('data-read')) === 'true';
      const date = await item.locator('[data-testid="notification-date"]').innerText();
      const text = await item.locator('[data-testid="notification-text"]').innerText();
      const onClick = await orderLink.getAttribute('onclick');
      const orderId = onClick?.split("'")[1] ?? null;

      notifications.push({
        id: id || '',
        date: date.trim(),
        text: text.trim() as NotificationMsg,
        read: read,
        orderId: orderId || '',
      });
    }

    return notifications;
  }

  @logStep('Get the number of notifications')
  async countNotifications() {
    return this.notifications.count();
  }

  @logStep('Click on notification by index')
  async clickReadNotificationByIndex(index: number) {
    await this.notifications.nth(index).click();
  }

  @logStep('Click on Read All button')
  async readAllNotifications() {
    await this.readAllButton.click();
  }

  @logStep('Get notification by id')
  async getNotificationById(id: string): Promise<INotificationsFromModal | undefined> {
    const notifications = await this.getNotifications();
    return notifications.find((notification) => notification.id === id);
  }

  @logStep('Get all notifications for specific order by orderId')
  async getAllNotificationsByOrderId(orderId: string): Promise<INotificationsFromModal[]> {
    const notifications = await this.getNotifications();
    return notifications.filter((notification) => notification.orderId === orderId);
  }

  @logStep('Get newest notification by orderId')
  async getNotificationByOrderId(orderId: string, index = 0): Promise<INotificationsFromModal | undefined> {
    const notifications = await this.getNotifications();
    return notifications.filter((notification) => notification.orderId === orderId)[index];
  }

  @logStep('Get notification by index')
  async getNotificationByIndex(index: number): Promise<INotificationsFromModal | undefined> {
    const notifications = await this.getNotifications();
    return notifications[index];
  }

  @logStep('Wait for Notifications Modal to be Closed')
  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }

  @logStep('Close notifications modal')
  async closeNotificationsModal() {
    await this.closeButton.click();
    await this.waitForClosed();
  }
}
