const db = require('./db/db');

const tableName = 'notification';

db.exists(tableName)
	.then((exists) => {
		if (!exists) {
			db.query(`
				CREATE TABLE IF NOT EXISTS notification (
					notifID SERIAL PRIMARY KEY,
					type INT NOT NULL,
				  
					toUserID INT NOT NULL,
					fromUserID INT NOT NULL,
					FOREIGN KEY (toUserID) REFERENCES "user" (userID) ON DELETE CASCADE,
					FOREIGN KEY (fromUserID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`);
		}
	})
	.catch((error) => {
		console.error('Error checking if table exists:', error);
	});

module.exports = {
	findAllToUser: (userID) => {
		return db.query(`SELECT "user".username, "user".userID, notification.* FROM notification INNER JOIN user ON notification.fromUserID = user.userID WHERE toUserID = $1`, [userID])
			.then((res) => res.rows.length > 0 ? res.rows : null);
	},

	create: ({type, fromUserID, toUserID}) => {
		return db.query(`INSERT INTO notification (type, toUserID, fromUserID) VALUES ($1, $2, $3)`, [type, toUserID, fromUserID])
			.then((res) => res.rows.length > 0 ? res.rows : null);
	},

	delete: (notifID) => {
		return db.query(`DELETE FROM notification WHERE notifID = $1`, [notifID])
			.then((res) => res.rows.length > 0 ? res.rows : null);
	}
}