const db = require('./db/db');

const tableName = 'userInfo';

db.exists(tableName)
  .then((exists) => {
    if (!exists) {
      db.query(
        `
				CREATE TABLE IF NOT EXISTS userInfo (
					userInfoID SERIAL PRIMARY KEY,
						
					gender INT NOT NULL,
					age INT NOT NULL,
					sexualPref INT NOT NULL,
					biography VARCHAR(4096),
					city VARCHAR(255),
					latitude NUMERIC(3, 3),
					longitude NUMERIC(3, 3),
					
					onlineStatus BOOLEAN,
					lastConnect DATE DEFAULT NOW(),
					fameRating BIGINT,
						
					userID INT NOT NULL,
					FOREIGN KEY (userID) REFERENCES "user" (userID) ON DELETE CASCADE
				)
			`,
      ).then(() => {
        db.query(
          `
					CREATE TABLE IF NOT EXISTS picture (
						pictureID SERIAL PRIMARY KEY,
						url VARCHAR(255),
						path VARCHAR(255),
						
						userInfoID INT NOT NULL,
						FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID) ON DELETE CASCADE
					)
				`,
        ).then(() => {
          db.query(
            `
						ALTER TABLE userInfo
							ADD COLUMN profilePicID INT
					`,
          ).then(() => {
            db.query(`
							ALTER TABLE userInfo
								ADD CONSTRAINT fk_picture_userInfo FOREIGN KEY (profilePicID) REFERENCES picture (pictureID) ON DELETE SET NULL
						`);
          });
        });
      });
    }
  })
  .catch((error) => {
    console.error('Error checking if table exists:', error);
  });

module.exports = {
  findOneByUser: (userID) => {
    return db
      .query(
        `SELECT userInfo.*, picture.* FROM userInfo INNER JOIN picture ON userInfo.profilePicID = picture.pictureID WHERE userID = $1`,
        [userID],
      )
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  findPictures: (userInfoID) => {
    return db
      .query(`SELECT * FROM picture WHERE userInfoID = $1`, [userInfoID])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  createUserInfo: (data) => {
    if (
      !data.userID ||
      !data.age ||
      !data.gender ||
      !data.sexualPref ||
      (!data.city && !data.latitude)
    )
      throw new Error(
        'Please provide at least userID, age, gender, sexualPref and city or latitude/longitude',
      );
    let query = '(gender, age, sexualPref';
    let params = [];
    params.push(data.gender);
    params.push(data.age);
    params.push(data.sexualPref);
    if (data.biography) {
      params.push(data.biography);
      query += ', biography';
    }
    if (data.city) {
      params.push(data.city);
      query += ', city';
    } else {
      if (!data.latitude && !data.longitude)
        throw new Error(
          'Please provide both latitude and longitude (or a city)',
        );
      params.push(data.latitude);
      params.push(data.longitude);
      query += ', latitude';
      query += ', longitude';
    }
    params.push(true);
    query += ', onlineStatus';
    params.push(0);
    query += ', fameRating';
    if (data.profilePicID) {
      params.push(data.profilePicID);
      query += ', profilePicID';
    }
    params.push(data.userID);
    query += ', userID)';
    return db
      .query(`INSERT INTO userInfo $1 VALUES (${{ ...params }})`, [query])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  updateUserInfo: (data) => {
    if (!data.userID) throw new Error('Please provide at least userID');
    let query = '';

    if (data.age) {
      query += `age = ${data.age}`;
    }

    if (data.gender) {
      query += `, gender = ${data.gender}`;
    }

    if (data.sexualPref) {
      query += `, sexualPref = ${data.sexualPref}`;
    }

    if (data.biography) {
      query += `, biography = ${data.biography}`;
    }

    if (data.city) {
      query += `, city = ${data.city}`;
    }

    if (data.latitude && data.longitude) {
      query += `, latitude = ${data.latitude}`;
      query += `, longitude = ${data.longitude}`;
    }

    if (data.onlineStatus) {
      query += `, onlineStatus = ${data.onlineStatus}`;
    }

    if (data.lastConnect) {
      query += `, lastConnect = ${data.lastConnect}`;
    }

    if (data.fameRating) {
      query += `, fameRating = ${data.fameRating}`;
    }

    if (data.profilePicID) {
      query += `, profilePicID = ${data.profilePicID}`;
    }
    return db
      .query(`UPDATE userInfo SET $1 WHERE userID = $2`, [query, data.userID])
      .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
  },

  deleteUserInfo: (userID) => {
    return db
      .query(`DELETE FROM userInfo WHERE userID = $1`, [userID])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  createPicture: (data) => {
    if (!data.userInfoID || (!data.path && !data.url))
      throw new Error('Please provide userInfoID and path or url');
    let choice;
    if (data.path) choice = data.path;
    else choice = data.url;
    return db
      .query(`INSERT INTO picture (userInfoID, $1)`, [
        '',
        data.userInfoID,
        choice,
      ])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },

  deletePicture: (pictureID) => {
    return db
      .query(`DELETE FROM picture WHERE pictureID = $1`, [pictureID])
      .then((res) => (res.rows.length > 0 ? res.rows : null));
  },
};
