const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const server = express();
// const authRouter = require('./auth/auth-router.js');
// const feedsRouter = require('./feeds/feeds-router.js');
// const notificationsRouter = require('./notifications/notifications-router.js');
// const postsRouter = require('./posts/posts-router.js');
// const usersRouter = require('./users/users-router.js');

server.use(helmet());
server.use(express.json());
server.use(cors());

// server.use('/api/auth', authRouter);
// server.use('/api/feeds', feedsRouter);
// server.use('/api/notifications', notificationsRouter);
// server.use('/api/posts', postsRouter);
// server.use('/api/users', usersRouter);

module.exports = server;
