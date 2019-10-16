module.exports = (req, res, next) => {
  if (req.session && req.session.ui) {
    next();
  } else {
    res.status(200).json({ message: 'Inactive' });
  }
};
