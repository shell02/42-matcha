import { TagRow, toTagRow } from './Tag'
import { SafeUserRow, toSafeUserRow } from './User'
import { mainDB } from './db/db'

const db = new mainDB()

export class userRelationDB {
  async setup() {
    db.query(`
							CREATE TABLE IF NOT EXISTS info_tag (
								userID INT,
								tagID INT,
								PRIMARY KEY (userID, tagID),
								FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
								FOREIGN KEY (tagID) REFERENCES tag (tagID) ON DELETE CASCADE
							)
		`)
    db.query(`
				CREATE TABLE IF NOT EXISTS info_viewed (
					userID INT,
					viewerID INT,
					PRIMARY KEY (userID, viewerID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (viewerID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
		`)
    db.query(`
				CREATE TABLE IF NOT EXISTS info_view_history (
					userID INT,
					seenID INT,
					PRIMARY KEY (userID, seenID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (seenID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`)
    db.query(`
				CREATE TABLE IF NOT EXISTS info_liked (
					userID INT,
					likeID INT,
					PRIMARY KEY (userID, likeID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (likeID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`)
    db.query(`
				CREATE TABLE IF NOT EXISTS info_connected (
					userID INT,
					connectID INT,
					PRIMARY KEY (userID, connectID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (connectID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`)
    db.query(`
				CREATE TABLE IF NOT EXISTS info_blocked (
					userID INT,
					blockedID INT,
					PRIMARY KEY (userID, blockedID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (blockedID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`)
    db.query(`
				CREATE TABLE IF NOT EXISTS info_blocked_from (
					userID INT,
					blockFromID INT,
					PRIMARY KEY (userID, blockFromID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (blockFromID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`)
  }

  async findTagsOfUser(userID: number): Promise<TagRow[] | null> {
    return db
      .query(
        `SELECT tag.* FROM info_tag INNER JOIN tag ON info_tag.tagID = tag.tagID WHERE info_tag.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const tags: TagRow[] = res.rows.map((row) => toTagRow(row))
          return tags
        } else {
          return null
        }
      })
  }

  async addTagToUser(tagID: number, userID: number): Promise<boolean> {
    return db
      .query(`INSERT INTO info_tag (userID, tagID) VALUES ($1, $2)`, [
        userID,
        tagID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeTagFromUser(tagID: number, userID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM info_tag WHERE userID = $1 AND tagID = $2)`, [
        userID,
        tagID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findViewersOfUser(userID: number): Promise<SafeUserRow[] | null> {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_viewed INNER JOIN user ON info_viewed.viewerID = "user".userID WHERE info_viewed.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async addViewerToUser(viewerID: number, userID: number): Promise<boolean> {
    return db
      .query(`INSERT INTO info_viewed (userID, viewerID) VALUES ($1, $2)`, [
        userID,
        viewerID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeViewerFromUser(
    viewerID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(`DELETE FROM info_viewed WHERE userID = $1 AND viewerID = $2)`, [
        userID,
        viewerID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findViewerHistoryOfUser(userID: number): Promise<SafeUserRow[] | null> {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_view_history INNER JOIN user ON info_view_history.seenID = "user".userID WHERE info_view_history.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async addViewerToUserHistory(
    seenID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(`INSERT INTO info_view_history (userID, seenID) VALUES ($1, $2)`, [
        userID,
        seenID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeViewerFromUserHistory(
    seenID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(
        `DELETE FROM info_view_history WHERE userID = $1 AND seenID = $2)`,
        [userID, seenID],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findLikesOfUser(userID: number): Promise<SafeUserRow[] | null> {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_liked INNER JOIN user ON info_liked.likeID = "user".userID WHERE info_liked.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async addLikeToUser(likeID: number, userID: number): Promise<boolean> {
    return db
      .query(`INSERT INTO info_liked (userID, likeID) VALUES ($1, $2)`, [
        userID,
        likeID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeLikeFromUser(likeID: number, userID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM info_liked WHERE userID = $1 AND likeID = $2)`, [
        userID,
        likeID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findConnectionsOfUser(userID: number): Promise<SafeUserRow[] | null> {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_connected INNER JOIN user ON info_connected.connectID = "user".userID WHERE info_connected.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async addConnectionToUser(
    connectID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(`INSERT INTO info_connected (userID, connectID) VALUES ($1, $2)`, [
        userID,
        connectID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeConnectionFromUser(
    connectID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(
        `DELETE FROM info_connected WHERE userID = $1 AND connectID = $2)`,
        [userID, connectID],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findBlockedOfUser(userID: number): Promise<SafeUserRow[] | null> {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_blocked INNER JOIN user ON info_blocked.blockedID = "user".userID WHERE info_blocked.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async addBlockedToUser(blockedID: number, userID: number): Promise<boolean> {
    return db
      .query(`INSERT INTO info_blocked (userID, blockedID) VALUES ($1, $2)`, [
        userID,
        blockedID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeBlockedFromUser(
    blockedID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(
        `DELETE FROM info_blocked WHERE userID = $1 AND  blockedID = $2)`,
        [userID, blockedID],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findBlockFromOfUser(userID: number): Promise<SafeUserRow[] | null> {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_blocked_from INNER JOIN user ON info_blocked_from.blockFromID = "user".userID WHERE info_blocked_from.userID = $1;`,
        [userID],
      )
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async addBlockFromToUser(
    blockedID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(
        `INSERT INTO info_blocked_from (userID, blockFromID) VALUES ($1, $2)`,
        [userID, blockedID],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async removeBlockFromFromUser(
    blockedID: number,
    userID: number,
  ): Promise<boolean> {
    return db
      .query(
        `DELETE FROM info_blocked_from WHERE userID = $1 AND blockFromID = $2)`,
        [userID, blockedID],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }
}
