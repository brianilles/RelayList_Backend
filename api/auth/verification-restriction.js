module.exports = (req, res, next) => {
  if (req.session && req.session.vi) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid credential configuration.' });
  }
};
