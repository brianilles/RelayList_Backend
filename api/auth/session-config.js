const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const dbConnection = require('../../data/dbConfig.js');

module.exports = {
  name: 'zxrwqyt',
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 10, // ms
    SESSION_SECURE: false, // use cookie over https
    httpOnly: true // can JS access the cookie on the client
  },
  resave: false, // avoid recreating existing sessions
  saveUninitialized: false, // GDPR compliance
  store: new knexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30 // delete expired sessions
  })
};
