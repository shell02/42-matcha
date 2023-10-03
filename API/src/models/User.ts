const db = require('./db/db');

const tableName = '"user"';

db.exists(tableName)
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE IF NOT EXISTS "user" (
					userID SERIAL PRIMARY KEY,
					
					username VARCHAR(50) NOT NULL UNIQUE,
					email VARCHAR(255) NOT NULL UNIQUE,
					
					firstName VARCHAR(50) NOT NULL,
					lastName VARCHAR(50) NOT NULL,
					
					password VARCHAR(255) NOT NULL,
					
					userStatus INT NOT NULL,
					
					verifyToken VARCHAR(255),
					refreshToken VARCHAR(255),
					resetToken VARCHAR(255)
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

module.exports = {
  findAll: async () => {
    return db
      .query(`SELECT * FROM "user"`)
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findAllSafe: async () => {
    return db
      .query(`SELECT userID, username, firstName, lastName FROM "user"`)
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findMe: async (userID) => {
    return db
      .query(
        `SELECT * FROM "user" INNER JOIN userInfo ON user.userID = userInfo.userID WHERE user.userID = $1;`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  findOnebyID: async (userID) => {
    return db
      .query(`SELECT * FROM "user" WHERE id = $1;`, [userID])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  findOneByEmail: (email) => {
    return db
      .query(`SELECT * FROM "user" WHERE email = $1;`, [email])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  findOneByUsername: (username) => {
    return db
      .query(`SELECT * FROM "user" WHERE username = $1;`, [username])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  create: ({ username, email, firstName, lastName, password }) => {
    return db
      .query(
        `INSERT INTO "user" (username, email, firstname, lastname, password, onlinestatus) VALUES ($1, $2, $3, $4, $5, $6)`,
        [username, email, firstName, lastName, password, 0],
      )
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  update: (data) => {
    return db
      .query(`UPDATE "user" SET $1 WHERE userID = $2 VALUES $3`, [
        query,
        data.userID,
        params,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  delete: (userID) => {
    return db.query(`DELETE FROM "user" WHERE userID = $1`, [userID]);
  },
};

// {
// 	userID: 1,
// 	username: 'Sarah',
// 	password: 'whatever',
// 	email: 'whatever@gmail.com',
//	age: 45,
//	gender: female,
//	tags: {
//		{
//			tagID: 13,
//			content: "Manga"
//		}
//	},
//	notification: {
//		{
//			from: username,
//			to: username
//		}
//	}
// 	connected: {
// 		{
// 			userID: 45,
// 			username: "Melanie",
// 			password: 'whatever',
// 			email: 'whatever@gmail.com'
// 		},
// 		{
// 			userID: 5,
// 			username: "Helen",
// 			password: 'whatever',
// 			email: 'whatever@gmail.com'
// 		}
// 	}
// }
