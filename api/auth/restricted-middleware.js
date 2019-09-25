module.exports = async (req, res, next) => {
  if (req.session && req.session.UfQRSy) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid credential configuration.' });
  }
};
