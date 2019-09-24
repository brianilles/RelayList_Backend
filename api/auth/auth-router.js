const router = require('express').Router();
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');

const Users = require('../users/users-model.js');
const UnverifiedUsers = require('../unverified-users/unverified-users-model.js');
const EmailVerification = require('./email-verification.js');

router.post('/register', async (req, res) => {
  let user = req.body;
  const { email, full_name, username, password } = req.body;

  if (!email || !full_name || !username || !password) {
    res.status(422).json({
      message: 'Must provide email, full name, username, and password'
    });
  } else {
    try {
      const emailPresent = await Users.findBy({ email });
      const usernamePresent = await Users.findBy({ username });

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
        user.token = cryptoRandomString({ length: 56, type: 'url-safe' });

        await UnverifiedUsers.add(user);
        const addedUnverifiedUser = await UnverifiedUsers.secureFindBy({
          email
        });

        // remove to other endpoint
        // const emailSent = await EmailVerification.sendVerificationEmail(
        //   addedUnverifiedUser.email,
        //   addedUnverifiedUser.token
        // );

        res.status(201).json(addedUnverifiedUser);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

router.post('/email-verification/:id', async (req, res) => {
  let { id } = req.params;

  try {
    const unverifiedUser = await UnverifiedUsers.findBy({ id });

    if (!unverifiedUser) {
      res.status(404).json({ message: 'User not found' });
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
});

router.post('/verify-email/:id', async (req, res) => {
  let { id } = req.params;
  const { token } = req.body;

  try {
    const unverifiedUser = await UnverifiedUsers.findBy({ id });

    if (!unverifiedUser) {
      res.status(404).json({ message: 'Unverified user not found' });
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
          const user = await Users.findBy({ id: addedUser });
          res.status(201).json(user);
        } else {
          re.status(500).json({ message: 'User could not be added.' });
        }
      } else {
        res.status(405).json({ message: 'Invalid token.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).json({ message: 'Must provide username and password.' });
  } else {
    try {
      const user = await Users.findBy({ username });

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
      } else {
        if (user && bcrypt.compareSync(password, user.password)) {
          const foundUser = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            username: user.username,
            created_at: user.created_at
          };
          res.status(200).json(foundUser);
        } else {
          res.status(401).json({ message: 'Invalid credentials.' });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: 'An unknown error occurred.'
      });
    }
  }
});

module.exports = router;
