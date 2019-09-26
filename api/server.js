const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const authSessionConfig = require('./auth/auth-session-config.js');
const userSessionConfig = require('./auth/user-session-config.js');
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

server.use('/api/auth', session(authSessionConfig));
server.use('/api/users', session(userSessionConfig));
server.use('/api/posts', session(userSessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', restricted, usersRouter);
server.use('/api/posts', restricted, postsRouter);

// server.use('/api/notifications', notificationsRouter);
// server.use('/api/feeds', feedsRouter);

module.exports = server;
