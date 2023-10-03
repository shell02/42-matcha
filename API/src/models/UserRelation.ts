const db = require('./db/db');

const tableNames = [
  'info_tag',
  'info_viewed',
  'info_view_history',
  'info_liked',
  'info_connected',
  'info_blocked',
  'info_blocked_from',
];

db.exists(tableNames[0])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_tag (
					userID INT,
					tagID INT,
					PRIMARY KEY (userID, tagID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (tagID) REFERENCES tag (tagID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

db.exists(tableNames[1])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_viewed (
					userID INT,
					viewerID INT,
					PRIMARY KEY (userID, viewerID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (viewerID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

db.exists(tableNames[2])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_view_history (
					userID INT,
					seenID INT,
					PRIMARY KEY (userID, seenID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (seenID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

db.exists(tableNames[3])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_liked (
					userID INT,
					likeID INT,
					PRIMARY KEY (userID, likeID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (likeID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

db.exists(tableNames[4])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_connected (
					userID INT,
					connectID INT,
					PRIMARY KEY (userID, connectID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (connectID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

db.exists(tableNames[5])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_blocked (
					userID INT,
					blockedID INT,
					PRIMARY KEY (userID, blockedID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (blockedID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

db.exists(tableNames[6])
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE info_blocked_from (
					userID INT,
					blockFromID INT,
					PRIMARY KEY (userID, blockFromID),
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (blockFromID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

module.exports = {
  findTagsOfUser: (userID) => {
    return db
      .query(
        `SELECT tag.* FROM info_tag INNER JOIN tag ON info_tag.tagID = tag.tagID WHERE info_tag.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addTagtoUser: (tagID, userID) => {
    return db
      .query(`INSERT INTO info_tag (userID, tagID) VALUES ($1, $2)`, [
        userID,
        tagID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeTagfromUser: (tagID, userID) => {
    return db
      .query(`DELETE FROM info_tag WHERE userID = $1 AND tagID = $2)`, [
        userID,
        tagID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findViewersOfUser: (userID) => {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_viewed INNER JOIN user ON info_viewed.viewerID = "user".userID WHERE info_viewed.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addViewertoUser: (viewerID, userID) => {
    return db
      .query(`INSERT INTO info_viewed (userID, viewerID) VALUES ($1, $2)`, [
        userID,
        viewerID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeViewerfromUser: (viewerID, userID) => {
    return db
      .query(`DELETE FROM info_viewed WHERE userID = $1 AND viewerID = $2)`, [
        userID,
        viewerID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findViewHistoryOfUser: (userID) => {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_view_history INNER JOIN user ON info_view_history.seenID = "user".userID WHERE info_view_history.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addViewedtoUserHistory: (seenID, userID) => {
    return db
      .query(`INSERT INTO info_view_history (userID, seenID) VALUES ($1, $2)`, [
        userID,
        seenID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeViewedfromUserHistory: (seenID, userID) => {
    return db
      .query(
        `DELETE FROM info_view_history WHERE userID = $1 AND seenID = $2)`,
        [userID, seenID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findLikesOfUser: (userID) => {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_liked INNER JOIN user ON info_liked.likeID = "user".userID WHERE info_liked.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addLiketoUser: (likeID, userID) => {
    return db
      .query(`INSERT INTO info_liked (userID, likeID) VALUES ($1, $2)`, [
        userID,
        likeID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeLikefromUser: (likeID, userID) => {
    return db
      .query(`DELETE FROM info_liked WHERE userID = $1 AND likeID = $2)`, [
        userID,
        likeID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findConnectionsOfUser: (userID) => {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_connected INNER JOIN user ON info_connected.connectID = "user".userID WHERE info_connected.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addConnectiontoUser: (connectID, userID) => {
    return db
      .query(`INSERT INTO info_connected (userID, connectID) VALUES ($1, $2)`, [
        userID,
        connectID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeConnectionfromUser: (connectID, userID) => {
    return db
      .query(
        `DELETE FROM info_connected WHERE userID = $1 AND connectID = $2)`,
        [userID, connectID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findBlockedOfUser: (userID) => {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_blocked INNER JOIN user ON info_blocked.blockedID = "user".userID WHERE info_blocked.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addBlockedtoUser: (blockedID, userID) => {
    return db
      .query(`INSERT INTO info_blocked (userID, blockedID) VALUES ($1, $2)`, [
        userID,
        blockedID,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeBlockedtoUser: (blockedID, userID) => {
    return db
      .query(
        `DELETE FROM info_blocked WHERE userID = $1 AND  blockedID = $2)`,
        [userID, blockedID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findBlockFromOfUser: (userID) => {
    return db
      .query(
        `SELECT "user".username, "user".userID FROM info_blocked_from INNER JOIN user ON info_blocked_from.blockFromID = "user".userID WHERE info_blocked_from.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  addBlockFromtoUser: (blockFromID, userID) => {
    return db
      .query(
        `INSERT INTO info_blocked_from (userID, blockFromID) VALUES ($1, $2)`,
        [userID, blockFromID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  removeBlockFromtoUser: (blockFromID, userID) => {
    return db
      .query(
        `DELETE FROM info_blocked_from WHERE userID = $1 AND blockFromID = $2)`,
        [userID, blockFromID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },
};
