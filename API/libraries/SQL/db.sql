USE matcha-db;

CREATE TABLE IF NOT EXISTS user (
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
);

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
	lastConnect DATE,
	fameRating BIGINT,
	
	profilePicID INT,
	FOREIGN KEY (profilePicID) REFERENCES picture (pictureID),

	userID INT NOT NULL,
	FOREIGN KEY (userID) REFERENCES user (userID)
)

CREATE TABLE info_tag (
	userInfoID INT,
	tagID INT,
	PRIMARY KEY (userInfoID, tagID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (tagID) REFERENCES tag (tagID)
);

CREATE TABLE info_viewed (
	userInfoID INT,
	userID INT,
	PRIMARY KEY (userInfoID, userID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE info_view_history (
	userInfoID INT,
	userID INT,
	PRIMARY KEY (userInfoID, userID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE info_liked (
	userInfoID INT,
	userID INT,
	PRIMARY KEY (userInfoID, userID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE info_connected (
	userInfoID INT,
	userID INT,
	PRIMARY KEY (userInfoID, userID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE info_blocked (
	userInfoID INT,
	userID INT,
	PRIMARY KEY (userInfoID, userID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE info_blocked_from (
	userInfoID INT,
	userID INT,
	PRIMARY KEY (userInfoID, userID),
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE IF NOT EXISTS tag (
	tagID SERIAL PRIMARY KEY,
	content VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS picture (
	pictureID SERIAL PRIMARY KEY,
	url VARCHAR(255),
	path VARCHAR(255),

	userInfoID INT NOT NULL,
	FOREIGN KEY (userInfoID) REFERENCES userInfo (userInfoID)
);

CREATE TABLE IF NOT EXISTS notification (
	type INT NOT NULL,

	toUserID INT NOT NULL,
	fromUserID INT NOT NULL,
	FOREIGN KEY toUserID REFERENCES user (userID),
	FOREIGN KEY fromUserID REFERENCES user (userID)
);
