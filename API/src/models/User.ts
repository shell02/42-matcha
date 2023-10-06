import { notificationDB } from './Notification'
import { userInfoDB } from './UserInfo'
import { mainDB } from './db/db'

const db = new mainDB()

/**
 * @example
 * username: string
 * email: string
 * firstName: string
 * lastName: string
 * password: string
 */
export interface createUserParams {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
}

/**
 * @example
 * username?: string
 * email?: string
 * firstName?: string
 * lastName?: string
 * password?: string
 */
export interface updateUserParams {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  password?: string
}

/**
 * @example
 * Unverified = 0
 * IncompleteProfile = 1
 * NoProfilePic = 2
 * FullAccess = 3
 */
export enum UserStatus {
  Unverified,
  IncompleteProfile,
  NoProfilePic,
  FullAccess,
}

/**
 * @example
 * userid: number
 * username: string
 * firstname: string
 * lastname: string
 * email: string
 * password: string
 * userstatus: UserStatus
 * verifytoken: string
 * refreshtoken: string
 * resettoken: string
 */
interface UserQueryResult {
  userid: number
  username: string
  firstname: string
  lastname: string
  email: string
  password: string
  userstatus: UserStatus
  verifytoken: string
  refreshtoken: string
  resettoken: string
}

/**
 * @example
 * userID: number
 * username: string
 * firstName: string
 * lastName: string
 */
export interface SafeUserRow {
  userID: number
  username: string
  firstName: string
  lastName: string
}

/**
 * @example
 * userID: number
 * username: string
 * firstName: string
 * lastName: string
 * email: string
 * password: string
 * userStatus: UserStatus (0 - 3)
 * verifyToken: string
 * refreshToken: string
 * resetToken: string
 */
export interface UserRow extends SafeUserRow {
  email: string
  password: string
  userStatus: UserStatus
  verifyToken: string
  refreshToken: string
  resetToken: string
}

/**
 * lowercase to camelCase function
 */
const toUserRow = (row: UserQueryResult): UserRow => {
  return {
    userID: row.userid,
    username: row.username,
    firstName: row.firstname,
    lastName: row.lastname,
    email: row.email,
    password: row.password,
    userStatus: row.userstatus,
    verifyToken: row.verifytoken,
    refreshToken: row.refreshtoken,
    resetToken: row.refreshtoken,
  }
}

/**
 * lowercase to camelCase function
 */
export const toSafeUserRow = (row: UserQueryResult): SafeUserRow => {
  return {
    userID: row.userid,
    username: row.username,
    firstName: row.firstname,
    lastName: row.lastname,
  }
}

export class userDB {
  async setup() {
    db.queryCB(
      `
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
        `,
      [],
      () => {
        const usersInfo = new userInfoDB()
        usersInfo.setup()

        const notifications = new notificationDB()
        notifications.setup()
      },
    )
  }

  async findAll(): Promise<UserRow[] | null> {
    return db.query(`SELECT * FROM "user"`).then((res) => {
      if (res.rowCount > 0) {
        const users: UserRow[] = res.rows.map((row) => toUserRow(row))
        return users
      } else {
        return null
      }
    })
  }

  async findAllSafe(): Promise<SafeUserRow[] | null> {
    return db
      .query(`SELECT userID, firstName, lastName, username FROM "user"`)
      .then((res) => {
        if (res.rowCount > 0) {
          const users: SafeUserRow[] = res.rows.map((row) => toSafeUserRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async findOneByID(userID: number): Promise<UserRow | null> {
    return db
      .query(`SELECT * FROM "user" WHERE userID = $1;`, [userID])
      .then((res) => (res.rows.length > 0 ? toUserRow(res.rows[0]) : null))
  }

  async findOneByEmail(email: string): Promise<UserRow | null> {
    return db
      .query(`SELECT * FROM "user" WHERE email = $1;`, [email])
      .then((res) => (res.rows.length > 0 ? toUserRow(res.rows[0]) : null))
  }

  async findOneByUsername(username: string): Promise<UserRow | null> {
    return db
      .query(`SELECT * FROM "user" WHERE username = $1;`, [username])
      .then((res) => (res.rows.length > 0 ? toUserRow(res.rows[0]) : null))
  }

  async create({
    username,
    email,
    firstName,
    lastName,
    password,
  }: createUserParams): Promise<boolean> {
    return db
      .query(
        `INSERT INTO "user" (username, email, firstname, lastname, password, userstatus) VALUES ($1, $2, $3, $4, $5, $6)`,
        [username, email, firstName, lastName, password, 0],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async update(userID: number, params: updateUserParams): Promise<boolean> {
    let query: string = ''
    let idx: number = 1
    const values: unknown[] = []
    if (params.email) {
      query += `email = $${idx++}, `
      values.push(params.email)
    }
    if (params.firstName) {
      query += `firstName = $${idx++}, `
      values.push(params.firstName)
    }
    if (params.lastName) {
      query += `lastName = $${idx++}, `
      values.push(params.lastName)
    }
    if (params.username) {
      query += `username = $${idx++}, `
      values.push(params.username)
    }
    if (params.password) {
      query += `password = $${idx++}, `
      values.push(params.password)
    }

    if (query.endsWith(', ')) {
      query = query.slice(0, -2)
    }

    query += ` WHERE userID = $${idx++}`
    values.push(userID)

    return db
      .query(`UPDATE "user" SET ${query}`, [...values])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async delete(userID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM "user" WHERE userID = $1`, [userID])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }
}
