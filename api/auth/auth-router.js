const router = require('express').Router();
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');

const Users = require('../users/users-model.js');
const UnverifiedUsers = require('../unverified-users/unverified-users-model.js');
const EmailVerification = require('./email-verification.js');

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
        user.token = cryptoRandomString({ length: 65, type: 'url-safe' });

        await UnverifiedUsers.add(user);
        const addedUnverifiedUser = await UnverifiedUsers.secureFindBy({
          email
        });

        res.status(201).json(addedUnverifiedUser);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// Sends an email to verify user
router.get('/send-verification/:id', async (req, res) => {
  let { id } = req.params;

  if (!id) {
    res.status(422).end();
  } else {
    try {
      const unverifiedUser = await UnverifiedUsers.findTokenEmailBy({ id });

      if (!unverifiedUser) {
        res.status(404).end();
      } else {
        const emailStatus = await EmailVerification.sendVerificationEmail(
          unverifiedUser.email,
          unverifiedUser.token
        );
        if (emailStatus) {
          res.status(200).json({ message: 'Email sent' });
        } else {
          res.status(500).json({ message: 'Email could not be sent.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// confirms or denies verification for the user
router.post('/check-verification/:id', async (req, res) => {
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
        if (token === unverifiedUser.token) {
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
});

// logs user in with session
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

// logs out user
router.delete('/logout', (req, res) => {
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

module.exports = router;
