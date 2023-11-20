import { NotificationRow, NotificationType } from '../models/Notification'
import { RequestError } from '../validation/utils'
import { DatabaseService } from './database.service'

export class NotifyService {
  private readonly db: DatabaseService = new DatabaseService()

  async getNotificationsOfUser(
    userID: number,
  ): Promise<NotificationRow[] | RequestError> {
    const notifications = await this.db.findNotificationsOfUser(userID)
    if (!notifications) {
      return {
        message: 'No notifications found',
        status: 404,
      }
    }
    return notifications
  }

  async deleteNotification(
    notificationID: number,
  ): Promise<RequestError | void> {
    const res = await this.db.removeNotificationFromUser(notificationID)
    if (!res) {
      return {
        message: 'Notification not found',
        status: 404,
      }
    }
  }

  async deleteAllNotifications(userID: number): Promise<RequestError | void> {
    const res = await this.db.removeNotificationFromUser(userID)
    if (!res) {
      return {
        message: 'Notification not found',
        status: 404,
      }
    }
  }

  async createNotification(
    userID: number,
    toUserID: number,
    type: NotificationType,
  ): Promise<RequestError | void> {
    console.log('createNotification', userID, toUserID, type)
    const res = await this.db.addNotificationToUser(toUserID, userID, type)
    if (!res) {
      return {
        message: 'Could not add notification',
        status: 400,
      }
    }
  }
}
