import { userRelationDB } from './UserRelation'
import { mainDB } from './db/db'

const db = new mainDB()

interface TagQueryResult {
  tagid: number
  content: string
}

export interface TagRow {
  tagID: number
  content: string
}

export const toTagRow = (row: TagQueryResult): TagRow => {
  return {
    tagID: row.tagid,
    content: row.content,
  }
}

export class tagDB {
  async setup() {
    await db.queryCB(
      `
							CREATE TABLE IF NOT EXISTS tag (
								tagID SERIAL PRIMARY KEY,
								content VARCHAR(50) NOT NULL UNIQUE
							)
		`,
      [],
      () => {
        const usersRelation = new userRelationDB()
        usersRelation.setup()
      },
    )
  }

  async findAll(): Promise<TagRow[] | null> {
    return db.query(`SELECT * FROM tag`).then((res) => {
      if (res.rowCount > 0) {
        const tags: TagRow[] = res.rows.map((row) => toTagRow(row))
        return tags
      } else {
        return null
      }
    })
  }

  async findOneByID(tagID: number): Promise<TagRow | null> {
    return db
      .query(`SELECT * FROM tag WHERE tagID = $1;`, [tagID])
      .then((res) => (res.rows.length > 0 ? toTagRow(res.rows[0]) : null))
  }

  async findOneByContent(content: string): Promise<TagRow | null> {
    return db
      .query(`SELECT * FROM tag WHERE content = $1;`, [content])
      .then((res) => (res.rows.length > 0 ? toTagRow(res.rows[0]) : null))
  }

  async create(content: string): Promise<boolean> {
    return db
      .query(`INSERT INTO tag (content) VALUES ($1)`, [content])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async delete(tagID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM tag WHERE tagID = $1`, [tagID])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async deleteByContent(content: string): Promise<boolean> {
    return db
      .query(`DELETE FROM tag WHERE content = $1`, [content])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }
}

// db.exists(tableName)
//   .then((exists) => {
//     if (!exists) {
//       db.query(`
// 				CREATE TABLE IF NOT EXISTS tag (
// 					tagID SERIAL PRIMARY KEY,
// 					content VARCHAR(50) NOT NULL UNIQUE
// 				)
// 			`);
//     }
//   })
//   .catch((error) => {
//     console.error('Error checking if table exists:', error);
//   });

// module.exports = {
//   findAll: () => {
//     return db
//       .query(`SELECT * FROM tag`)
//       .then((res) => (res.rows.length > 0 ? res.rows : null));
//   },

//   findOneByContent: (content) => {
//     return db
//       .query(`SELECT * FROM tag WHERE content = $1`, [content])
//       .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
//   },

//   findOneById: (tagID) => {
//     return db
//       .query(`SELECT * FROM tag WHERE tagID = $1`, [tagID])
//       .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
//   },

//   create: (content) => {
//     return db
//       .query(`INSERT INTO tag (content) VALUES ($1)`, [content])
//       .then((res) => (res.rows.length > 0 ? res.rows : null));
//   },

//   delete: (tagID) => {
//     return db
//       .query(`DELETE FROM tag WHERE tagID = $1`, [tagID])
//       .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
//   },

//   deleteByContent: (content) => {
//     return db
//       .query(`DELETE FROM tag WHERE content = $1`, [content])
//       .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
//   },
// };
