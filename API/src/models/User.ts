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
 * userStatus?: UserStatus
 * verifyToken?: string | null
 * refreshToken?: string | null
 * resetToken?: string | null
 */
export interface updateUserParams {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  password?: string
  userStatus?: UserStatus
  verifyToken?: string | null
  refreshToken?: string | null
  resetToken?: string | null
}

/**
 * @example
 * username: string
 * password: string
 */
export interface loginParams {
  username: string
  password: string
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
  verifytoken: string | null
  refreshtoken: string | null
  resettoken: string | null
  profilepicid: number | null
}

/**
 * @example
 * userID: number
 * username: string
 * firstName: string
 * lastName: string
 * profilePicID: number | null
 */
export interface SafeUserRow {
  userID: number
  username: string
  firstName: string
  lastName: string
  profilePicID: number | null
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
 * profilePicID: number | null
 */
export interface UserRow extends SafeUserRow {
  email: string
  password: string
  userStatus: UserStatus
  verifyToken: string | null
  refreshToken: string | null
  resetToken: string | null
  profilePicID: number | null
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
    profilePicID: row.profilepicid,
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
    profilePicID: row.profilepicid,
  }
}

/**
 * @example
 * pictureid: number
 * path?: string
 * url?: string
 * userid: number
 */
interface PictureQueryResult {
  pictureid: number
  path: string | null
  url: string | null
  userid: number
}

/**
 * @example
 * pictureID: number
 * path?: string
 * url?: string
 */
export interface PictureRow {
  pictureID: number
  path?: string
  url?: string
}

export interface CreatePictureParams {
  url?: string
  path?: string
}

/**
 * lowercase to camelCase function
 */
const toPictureRow = (row: PictureQueryResult): PictureRow => {
  if (row.path) {
    return {
      pictureID: row.pictureid,
      path: row.path,
    }
  } else if (row.url) {
    return {
      pictureID: row.pictureid,
      url: row.url,
    }
  }
  return {
    pictureID: row.pictureid,
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

        db.queryCB(
          `
							CREATE TABLE IF NOT EXISTS picture (
								pictureID SERIAL PRIMARY KEY,
								url VARCHAR(255),
								path VARCHAR(255),

								userID INT NOT NULL,
								FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE
								)
							`,
          [],
          () => {
            db.queryCB(
              `
						ALTER TABLE "user"
							ADD COLUMN IF NOT EXISTS profilePicID INT
						`,
              [],
              () => {
                db.query(
                  `
									DO $$
									BEGIN

										BEGIN
											ALTER TABLE "user"
												ADD CONSTRAINT fk_picture_user FOREIGN KEY (profilePicID) REFERENCES picture (pictureID) ON DELETE SET NULL;
										EXCEPTION
											WHEN duplicate_table THEN
											WHEN duplicate_object THEN
												RAISE NOTICE 'Table constraint fk_picture_user already exists';
										END;

									END $$;
									`,
                )
              },
            )
          },
        )
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

  async findOneByToken(
    tokenName: string,
    token: string,
  ): Promise<UserRow | null> {
    const SQLToken = `'${token}'`
    const query = `SELECT * FROM "user" WHERE ${tokenName} = ${SQLToken}`
    return db
      .query(query)
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
        [username, email, firstName, lastName, password, UserStatus.Unverified],
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
    if (params.userStatus !== undefined) {
      query += `userStatus = $${idx++}, `
      values.push(params.userStatus)
    }
    if (params.verifyToken !== undefined) {
      query += `verifyToken = $${idx++}, `
      values.push(params.verifyToken)
    }
    if (params.refreshToken !== undefined) {
      query += `refreshToken = $${idx++}, `
      values.push(params.refreshToken)
    }
    if (params.resetToken !== undefined) {
      query += `resetToken = $${idx++}, `
      values.push(params.resetToken)
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

  async assignProfilePic(userID: number, pictureID: number): Promise<boolean> {
    return db
      .query(`UPDATE "user" SET profilePicID = $1 WHERE userID = $2`, [
        pictureID,
        userID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findPictureByID(pictureID: number): Promise<PictureRow | null> {
    return db
      .query(`SELECT * FROM picture WHERE pictureID = $1`, [pictureID])
      .then((res) => (res.rowCount > 0 ? toPictureRow(res.rows[0]) : null))
  }

  async findPicturesOfUser(userID: number): Promise<PictureRow[] | null> {
    return db
      .query(`SELECT * FROM picture WHERE userID = $1`, [userID])
      .then((res) => {
        if (res.rowCount > 0) {
          const users: PictureRow[] = res.rows.map((row) => toPictureRow(row))
          return users
        } else {
          return null
        }
      })
  }

  async createPicture(
    userID: number,
    params: CreatePictureParams,
  ): Promise<boolean> {
    let query: string = '(userID, '
    const values: unknown[] = []
    values.push(userID)

    if (params.path) {
      query += `path)`
      values.push(params.path)
    } else if (params.url) {
      query += `url)`
      values.push(params.url)
    }

    return db
      .query(`INSERT INTO picture ${query} VALUES ($1, $2)`, [...values])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async deletePicture(pictureID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM picture WHERE pictureid = $1`, [pictureID])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }
}
