module.exports = async (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.vi) {
    const { id } = req.params;
    try {
      if (id == req.session.vi) {
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
