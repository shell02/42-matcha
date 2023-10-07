import { mainDB } from './db/db'

const db = new mainDB()

/**
 * @example
 * WOMAN
 * MAN
 * AGENDER
 * NONBINARY
 * GENDERFLUID
 * OTHER
 */
export enum GenderType {
  WOMAN,
  MAN,
  AGENDER,
  NONBINARY,
  GENDERFLUID,
  OTHER,
}

/**
 * @example
 * ViewWomen
 * ViewMen
 * ViewBoth
 */
export enum SexualPrefType {
  ViewWomen,
  ViewMen,
  ViewBoth,
}

/**
 * @example
 * gender: GenderType
 * age: number
 * sexualPref: SexualPrefType
 * biography: string
 * latitude: number
 * longitude: number
 * userID: number
 */
export interface createUserInfoParams {
  gender: GenderType
  age: number
  sexualPref: SexualPrefType
  biography: string
  latitude: number
  longitude: number
  userID: number
}

/**
 * @example
 * gender?: GenderType
 * age?: number
 * sexualPref?: SexualPrefType
 * biography?: string
 * latitude?: number
 * longitude?: number
 * onlineStatus?: boolean
 * lastConnect?: Date
 * fameRating?: number
 */
export interface updateUserInfoParams {
  gender?: GenderType
  age?: number
  sexualPref?: SexualPrefType
  biography?: string
  latitude?: number
  longitude?: number
  onlineStatus?: boolean
  lastConnect?: Date
  fameRating?: number
}

interface Location {
  x: number
  y: number
}

/**
 * @example
 * userinfoid: number
 * gender: GenderType
 * age: number
 * sexualpref: SexualPrefType
 * biography: string
 * latitude: number
 * longitude: number
 * onlinestatus: boolean
 * lastconnect: Date
 * famerating: number
 * userid: number
 */
interface UserInfoQueryResult {
  userinfoid: number
  gender: GenderType
  age: number
  sexualpref: SexualPrefType
  biography: string
  location: Location
  onlinestatus: boolean
  lastconnect: Date
  famerating: number
  userid: number
  profilepicid: number
}

/**
 * @example
 * userInfoID: number
 * gender: GenderType
 * age: number
 * sexualPref: SexualPrefType
 * biography: string
 * latitude: number
 * longitude: number
 * onlineStatus: boolean
 * lastConnect: Date
 * fameRating: number
 */
export interface UserInfoRow {
  userInfoID: number
  gender: GenderType
  age: number
  sexualPref: SexualPrefType
  biography: string
  latitude: number
  longitude: number
  onlineStatus: boolean
  lastConnect: Date
  fameRating: number
  profilePicID: number
}

/**
 * @example
 * pictureid: number
 * path?: string
 * url?: string
 * userinfoid: number
 */
interface PictureQueryResult {
  pictureid: number
  path: string | null
  url: string | null
  userinfoid: number
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
const toUserInfoRow = (row: UserInfoQueryResult): UserInfoRow => {
  return {
    userInfoID: row.userinfoid,
    gender: row.gender,
    age: row.age,
    sexualPref: row.sexualpref,
    biography: row.biography,
    latitude: row.location.x,
    longitude: row.location.y,
    onlineStatus: row.onlinestatus,
    lastConnect: row.lastconnect,
    fameRating: row.famerating,
    profilePicID: row.profilepicid,
  }
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

export class userInfoDB {
  async setup() {
    db.queryCB(
      `
			CREATE TABLE IF NOT EXISTS userInfo (
				userInfoID SERIAL PRIMARY KEY,
				
				gender INT NOT NULL,
				age INT NOT NULL,
				sexualPref INT NOT NULL,
				biography VARCHAR(4096) NOT NULL,
				location POINT NOT NULL,
				
				onlineStatus BOOLEAN DEFAULT TRUE,
				lastConnect DATE DEFAULT NOW(),
				fameRating BIGINT,
				
				userID INT NOT NULL,
				FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE
			)
    	`,
      [],
      () => {
        db.queryCB(
          `
							CREATE TABLE IF NOT EXISTS picture (
								pictureID SERIAL PRIMARY KEY,
								url VARCHAR(255),
								path VARCHAR(255),

								userInfoID INT NOT NULL,
								FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID) ON DELETE CASCADE
								)
							`,
          [],
          () => {
            db.queryCB(
              `
						ALTER TABLE userInfo
							ADD COLUMN IF NOT EXISTS profilePicID INT
						`,
              [],
              () => {
                db.query(
                  `
									DO $$
									BEGIN

										BEGIN
											ALTER TABLE userInfo
												ADD CONSTRAINT fk_picture_userInfo FOREIGN KEY (profilePicID) REFERENCES picture (pictureID) ON DELETE SET NULL;
										EXCEPTION
											WHEN duplicate_table THEN
											WHEN duplicate_object THEN
												RAISE NOTICE 'Table constraint fk_picture_userInfo already exists';
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

  async findByID(userInfoID: number): Promise<UserInfoRow | null> {
    return db
      .query(`SELECT * FROM userInfo WHERE userInfoID = $1`, [userInfoID])
      .then((res) => (res.rowCount > 0 ? toUserInfoRow(res.rows[0]) : null))
  }

  async findByUserID(userID: number): Promise<UserInfoRow | null> {
    return db
      .query(`SELECT * FROM userInfo WHERE userInfoID = $1`, [userID])
      .then((res) => (res.rowCount > 0 ? toUserInfoRow(res.rows[0]) : null))
  }

  async create({
    age,
    gender,
    biography,
    sexualPref,
    userID,
    latitude,
    longitude,
  }: createUserInfoParams): Promise<boolean> {
    return db
      .query(
        `INSERT INTO userInfo
				(userID,
				 age,
				 gender,
				 biography,
				 sexualPref,
				 location,
         fameRating)
				VALUES ($1, $2, $3, $4, $5, POINT($6, $7), 0)`,
        [userID, age, gender, biography, sexualPref, latitude, longitude],
      )
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async update(userID: number, params: updateUserInfoParams): Promise<boolean> {
    let query: string = ''
    let idx: number = 1
    const values: unknown[] = []
    if (params.age) {
      query += `age = $${idx++}, `
      values.push(params.age)
    }
    if (params.gender !== undefined) {
      query += `gender = $${idx++}, `
      values.push(params.gender)
    }
    if (params.sexualPref !== undefined) {
      query += `sexualPref = $${idx++}, `
      values.push(params.sexualPref)
    }
    if (params.biography) {
      query += `biography = $${idx++}, `
      values.push(params.biography)
    }
    if (params.onlineStatus !== undefined) {
      query += `onlineStatus = $${idx++}, `
      values.push(params.onlineStatus)
    }
    if (params.lastConnect) {
      query += `lastConnect = $${idx++}, `
      values.push(params.lastConnect)
    }
    if (params.latitude !== undefined && params.longitude !== undefined) {
      query += `location = POINT($${idx++}, $${idx++}), `
      values.push(params.latitude)
      values.push(params.longitude)
    } else if (params.latitude !== undefined) {
      const y = await db
        .query(`SELECT location FROM userInfo WHERE userID = $1`, [userID])
        .then((res) => (res.rowCount > 0 ? res.rows[0].location.y : 0))
      query += `location = POINT($${idx++}, ${y}), `
      values.push(params.latitude)
    } else if (params.longitude !== undefined) {
      const x = await db
        .query(`SELECT location FROM userInfo WHERE userID = $1`, [userID])
        .then((res) => (res.rowCount > 0 ? res.rows[0].location.x : 0))
      query += `location = POINT(${x}, $${idx++}), `
      values.push(params.longitude)
    }
    if (params.fameRating !== undefined) {
      query += `fameRating = $${idx++}, `
      values.push(params.fameRating)
    }

    if (query.endsWith(', ')) {
      query = query.slice(0, -2)
    }

    query += ` WHERE userID = $${idx++}`
    values.push(userID)

    return db
      .query(`UPDATE userInfo SET ${query}`, [...values])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async delete(userInfoID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM userInfo WHERE userInfoID = $1`, [userInfoID])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async deleteByUserID(userID: number): Promise<boolean> {
    return db
      .query(`DELETE FROM userInfo WHERE userID = $1`, [userID])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async assignProfilePic(
    userInfoID: number,
    pictureID: number,
  ): Promise<boolean> {
    return db
      .query(`UPDATE userInfo SET profilePicID = $1 WHERE userInfoID = $2`, [
        pictureID,
        userInfoID,
      ])
      .then((res) => (res.rowCount > 0 ? true : false))
      .catch(() => false)
  }

  async findPictureByID(pictureID: number): Promise<PictureRow | null> {
    return db
      .query(`SELECT * FROM picture WHERE pictureID = $1`, [pictureID])
      .then((res) => (res.rowCount > 0 ? toPictureRow(res.rows[0]) : null))
  }

  async findPicturesOfUser(userInfoID: number): Promise<PictureRow[] | null> {
    return db
      .query(`SELECT * FROM picture WHERE userInfoID = $1`, [userInfoID])
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
    userInfoID: number,
    params: CreatePictureParams,
  ): Promise<boolean> {
    let query: string = '(userInfoID, '
    const values: unknown[] = []
    values.push(userInfoID)

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

  // async findUsersFromLocation(radius: number): Promise<SafeUserRow[] | null> {
  //   return db.query(
  //     `SELECT userID, username, firstName, lastName FROM "user"
  //
  //
  //       --some kind of inner join with userInfo to get location--
  //
  //       WHERE ST_DWithin(location, POINT($1, $2), $3)`,
  //     [location.x, location.y, radius],
  //   )
  // }
}

// WHERE ST_DWithin(coordinates, POINT(40.7128, -74.0060), 10);
