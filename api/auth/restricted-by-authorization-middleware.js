module.exports = (req, res, next) => {
  if (req.session && req.session.ui) {
    const { id } = req.params;
    try {
      if (id == req.session.ui) {
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
