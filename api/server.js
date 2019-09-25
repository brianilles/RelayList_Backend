const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const sessionConfig = require('./auth/session-config.js');
const restricted = require('./auth/restricted-middleware.js');

const authRouter = require('./auth/auth-router.js');
const usersRouter = require('./users/users-router.js');
const postsRouter = require('./posts/posts-router.js');

// const feedsRouter = require('./feeds/feeds-router.js');
// const notificationsRouter = require('./notifications/notifications-router.js');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', restricted, usersRouter);
server.use('/api/posts', restricted, postsRouter);

// server.use('/api/feeds', feedsRouter);
// server.use('/api/notifications', notificationsRouter);

module.exports = server;
