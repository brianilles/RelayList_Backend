const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const dbConnection = require('../../data/dbConfig.js');

module.exports = {
  name: 'hippo', // default sid
  secret: process.env.SESSION_SECRET || 'keeep secret', //.env
  cookie: {
    maxAge: 1000 * 60 * 60, // 60 min
    secure: false, //during dev false, prod to true env
    httpOnly: true // cookie cannot be access JS
  },
  resave: false, // make new, no
  saveUninitialized: false, // GDPR compliance (only true once user has opted in)
  store: new knexSessionStore({
    knex: dbConnection,
    tablename: 'knexsession',
    sidfieldname: 'sessionid',
    createtable: true,
    clearInterval: 1000 * 60 * 30 //clean out /expire all session data
  })
};
