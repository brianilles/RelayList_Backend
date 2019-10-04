module.exports = (req, res, next) => {
  if (req.session && req.session.zi) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid credential configuration.' });
  }
};
