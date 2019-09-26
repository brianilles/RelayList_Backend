const router = require('express').Router();
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');

const Users = require('../users/users-model.js');
const UnverifiedUsers = require('../unverified-users/unverified-users-model.js');
const UsersReset = require('./users-reset/users-reset.js');
const EmailVerification = require('./email-verification.js');

const resetPasswordMiddleware = require('./reset-password-middleware.js');
const restrictedByAuth = require('./restricted-by-authorization-middleware.js');
const verificationRestricted = require('./verification-restriction.js');

// Registers an unverified user
router.post('/register', async (req, res) => {
  let user = req.body;
  const { email, full_name, username, password } = req.body;

  if (!email || !full_name || !username || !password) {
    res.status(422).end();
  } else {
    try {
      const emailPresent = await Users.secureFindBy({ email });
      const usernamePresent = await Users.secureFindBy({ username });

      if (emailPresent && usernamePresent) {
        res.status(405).json({ message: 'Email and username not available.' });
      } else if (emailPresent) {
        res.status(405).json({ message: 'Email not available.' });
      } else if (usernamePresent) {
        res.status(405).json({ message: 'Username not available.' });
      } else {
        const unverifiedEmailPresent = await UnverifiedUsers.secureFindBy({
          email
        });
        const unverifiedUsernamePresent = await UnverifiedUsers.secureFindBy({
          username
        });

        if (unverifiedEmailPresent) {
          await UnverifiedUsers.remove({ id: unverifiedEmailPresent.id });
        }
        if (unverifiedUsernamePresent) {
          await UnverifiedUsers.remove({ id: unverifiedUsernamePresent.id });
        }

        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash;

        await UnverifiedUsers.add(user);
        const addedUnverifiedUser = await UnverifiedUsers.secureFindBy({
          email
        });
        req.session.vi = addedUnverifiedUser.id;
        res.status(201).json(addedUnverifiedUser);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// Sends an email to verify user
router.get(
  '/send-verification/:id',
  verificationRestricted,
  async (req, res) => {
    let { id } = req.params;

    if (!id) {
      res.status(422).end();
    } else {
      try {
        const unverifiedUser = await UnverifiedUsers.secureFindBy({ id });

        if (!unverifiedUser) {
          res.status(404).end();
        } else {
          const tokenBefore = cryptoRandomString({
            length: 65,
            type: 'url-safe'
          });
          const tokenHash = bcrypt.hashSync(tokenBefore, 12);
          const tokenAdded = await UnverifiedUsers.updateToken({
            id,
            token: tokenHash
          });

          if (tokenAdded) {
            const updatedUser = await UnverifiedUsers.findTokenEmailBy({
              id
            });
            const emailStatus = await EmailVerification.sendVerificationEmail(
              updatedUser.email,
              tokenBefore
            );
            if (emailStatus) {
              res.status(200).json({ message: 'Email sent' });
            } else {
              res.status(500).json({ message: 'Email could not be sent.' });
            }
          } else {
            res.status(500).json({ message: 'An error occurred.' });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

// Confirms or denies verification for the user
router.post(
  '/check-verification/:id',
  verificationRestricted,
  async (req, res) => {
    let { id } = req.params;
    const { token } = req.body;

    if (!token || !id) {
      res.status(422).end();
    } else {
      try {
        const unverifiedUser = await UnverifiedUsers.findBy({ id });

        if (!unverifiedUser) {
          res.status(404).end();
        } else {
          if (bcrypt.compareSync(token, unverifiedUser.token)) {
            const addedUser = await Users.add({
              email: unverifiedUser.email,
              full_name: unverifiedUser.full_name,
              username: unverifiedUser.username,
              password: unverifiedUser.password
            });

            if (addedUser) {
              await UnverifiedUsers.remove({ id });
              res.status(201).json();
            } else {
              res.status(500).json({ message: 'User could not be added.' });
            }
          } else {
            res.status(405).json({ message: 'Invalid.' });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

// Logs user in with session
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.findBy({ username });

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
      } else {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.ui = user.id;
          const foundUser = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            username: user.username,
            bio: user.bio,
            profile_image: user.profile_image,
            created_at: user.created_at
          };
          res.status(200).json(foundUser);
        } else {
          res.status(401).json({ message: 'Invalid credentials.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'An unknown error occurred.'
      });
    }
  }
});

// Logs out user
router.delete('/logout', restrictedByAuth, (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: 'Could not logged out' });
      } else {
        res.status(204).json({ message: 'Logout success' });
      }
    });
  } else {
    res.status(200).json({ message: 'Not logged in ' });
  }
});

// Starts reset password process
router.post('/reset-password/start', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(422).end();
    } else if (email) {
      const user = await Users.secureFindBy({ email });
      if (!user) {
        res.status(404).end();
      } else {
        const presentReset = await UsersReset.findBy({
          user_id: user.id
        });
        if (presentReset) {
          await UsersReset.remove({ id: presentReset.id });
        }
        const addedStagedUserReset = await UsersReset.add({
          user_id: user.id
        });

        const newReset = await UsersReset.findBy({
          user_id: addedStagedUserReset[0]
        });

        if (!addedStagedUserReset) {
          res.status(500).json({
            message: 'An error occurred while initiating password reset.'
          });
        } else {
          // TODO take out some letters
          req.session.zi = id;
          res.status(200).json({ email: user.email, id: newReset.id });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unknown error occurred.'
    });
  }
});

// Sends an email to verify reset
router.post(
  '/reset-password/send-reset/:id',
  resetPasswordMiddleware,
  async (req, res) => {
    let { email } = req.body;
    if (!email) {
      res.status(422).end();
    } else {
      try {
        const user = await Users.secureFindBy({ email });

        if (!user) {
          res.status(404).end();
        } else {
          const userReset = await UsersReset.findBy({ user_id: user.id });

          if (!userReset) {
            res.status(404).end();
          } else {
            const tokenBefore = cryptoRandomString({
              length: 65,
              type: 'url-safe'
            });
            const tokenHash = bcrypt.hashSync(tokenBefore, 12);
            const tokenAdded = await UsersReset.updateToken({
              id: userReset.id,
              token: tokenHash
            });
            if (tokenAdded) {
              const emailStatus = await EmailVerification.sendVerificationEmail(
                user.email,
                tokenBefore
              );
              if (emailStatus) {
                res.status(200).json({ id: userReset.id });
              } else {
                res.status(500).json({ message: 'Email could not be sent.' });
              }
            } else {
              res.status(500).json({ message: 'Email could not be sent.' });
            }
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

// Confirms or denies password reset verification for the user
router.post(
  '/reset-password/check/:id',
  resetPasswordMiddleware,
  async (req, res) => {
    const { token } = req.body;
    if (!token) {
      res.status(422).end();
    } else {
      try {
        const userReset = await UsersReset.findBy({ id });
        if (!userReset) {
          res.status(404).end();
        } else {
          if (bcrypt.compareSync(token, userReset.token)) {
            res.status(200).end();
          } else {
            res.status(405).json({ message: 'Invalid' });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

// Resets password
router.post(
  '/reset-password/complete/:id',
  resetPasswordMiddleware,
  async (req, res) => {
    const { token, password } = req.body;
    if (!password) {
      res.status(422).end();
    } else {
      try {
        const userReset = await UsersReset.findBy({ id });
        if (!userReset) {
          res.status(404).end();
        } else {
          if (bcrypt.compareSync(token, userReset.token)) {
            await UsersReset.remove({ id: userReset.id });
            const updatedUser = await Users.updatePassword({
              id: req.session.zi,
              password
            });
            if (!updatedUser) {
              res
                .status(500)
                .json({ message: 'An error occurred when updating.' });
            } else {
              req.session.destroy(err => {
                if (err) {
                  res.status(500).json({ message: 'Could not invalided.' });
                } else {
                  res.status(200).end();
                }
              });
            }
          } else {
            res.status(405).json({ message: 'Invalid' });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

module.exports = router;
