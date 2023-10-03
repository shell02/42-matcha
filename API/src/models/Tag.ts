const db = require('./db/db');

const tableName = 'tag';

db.exists(tableName)
  .then((exists) => {
    if (!exists) {
      db.query(`
				CREATE TABLE IF NOT EXISTS tag (
					tagID SERIAL PRIMARY KEY,
					content VARCHAR(50) NOT NULL UNIQUE
				)
			`);
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

module.exports = {
  findAll: () => {
    return db
      .query(`SELECT * FROM tag`)
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  findOneByContent: (content) => {
    return db
      .query(`SELECT * FROM tag WHERE content = $1`, [content])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  findOneById: (tagID) => {
    return db
      .query(`SELECT * FROM tag WHERE tagID = $1`, [tagID])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  create: (content) => {
    return db
      .query(`INSERT INTO tag (content) VALUES ($1)`, [content])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  delete: (tagID) => {
    return db
      .query(`DELETE FROM tag WHERE tagID = $1`, [tagID])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  deleteByContent: (content) => {
    return db
      .query(`DELETE FROM tag WHERE content = $1`, [content])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },
};
