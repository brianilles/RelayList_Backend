const router = require('express').Router();
const Users = require('./users-model.js');
const restrictedByAuthorization = require('../auth/restricted-by-authorization-middleware.js');

router.get('/public/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.publicFindBy({ id });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

router.get('/private/:id', restrictedByAuthorization, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.secureFindBy({ id });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

module.exports = router;
