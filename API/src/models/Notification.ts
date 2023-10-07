import { mainDB } from './db/db'

const db = new mainDB()

/**
 * @example
 * LikeReceived
 * ProfileViewed
 * PrivateMessage
 * LikedBack
 * Unliked
 */
export enum NotificationType {
  LikeReceived,
  ProfileViewed,
  PrivateMessage,
  LikedBack,
  Unliked,
}

/**
 * @example
 * touserid: number
 * fromuserid: number
 * username: string
 * type: NotificationType
 * notifid: number
 */
interface NotificationQueryResult {
  touserid: number
  fromuserid: number
  username: string
  type: NotificationType
  notifid: number
}

/**
 * @example
 * toUserID: number
 * fromUserID: number
 * username: string
 * type: NotificationType
 * notifID: number
 */
export interface NotificationRow {
  toUserID: number
  fromUserID: number
  username: string
  type: NotificationType
  notifID: number
}

const toNotificationRow = (row: NotificationQueryResult): NotificationRow => {
  return {
    toUserID: row.touserid,
    fromUserID: row.fromuserid,
    username: row.username,
    type: row.type,
    notifID: row.notifid,
  }
}

export class notificationDB {
  async setup() {
    await db.query(`
							CREATE TABLE IF NOT EXISTS notification (
								notifID SERIAL PRIMARY KEY,
								type INT NOT NULL,
			
								toUserID INT NOT NULL,
								fromUserID INT NOT NULL,
								FOREIGN KEY (toUserID) REFERENCES "user" (userID) ON DELETE CASCADE,
								FOREIGN KEY (fromUserID) REFERENCES "user" (userID) ON DELETE CASCADE
							)
		`)
  }

  async findAllToUser(userID: number): Promise<NotificationRow[] | null> {
    return db
      .query(
        `SELECT
          n.notifID,
          n.type,
          tu.userID AS toUserID,
          fu.userID AS fromUserID,
          fu.username AS username
        FROM
          notification n
         INNER JOIN
          "user" tu ON n.toUserID = tu.userID
        INNER JOIN
          "user" fu ON n.fromUserID = fu.userID
        WHERE
          toUserID = $1;
    `,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const notifications: NotificationRow[] = res.rows.map((row) =>
            toNotificationRow(row),
          )
          return notifications
        } else {
          return null
        }
      })
  }

  async create(
    fromUserID: number,
    toUserID: number,
    type: NotificationType,
  ): Promise<boolean> {
    return db
      .query(
        `INSERT INTO notification (fromUserID, toUserID, type) VALUES ($1, $2, $3)`,
        [fromUserID, toUserID, type],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async delete(notifID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM notification WHERE notifID = $1`, [notifID])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }
}
