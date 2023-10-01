const express = require('express');
const app = express();
require('dotenv').config({ path: '../.env' });

const userDB = require('./src/models/User');
const tagDB = require('./src/models/Tag');
const userInfoDB = require('./src/models/UserInfo');
const NotifDB = require('./src/models/Notification');
const userRealtionDB = require('./src/models/UserRelation');

app.get('/', (req, res) => {
  res.send('Hi there');
});

app.listen(3000, () => {
  console.log('Listen on port 3000...');
});
