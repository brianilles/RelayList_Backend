const Users = require('../users/users-model.js');

module.exports = async (req, res, next) => {
  if (req.session && req.session.ui) {
    const id = req.session.ui;
    try {
      const user = await Users.publicFindBy({ id });
      if (user) {
        next();
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credential configuration.' });
  }
};
