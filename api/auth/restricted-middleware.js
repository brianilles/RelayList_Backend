module.exports = async (req, res, next) => {
  if (req.session && req.session.ur) {
    console.log(req.session);
    next();
  } else {
    res.status(401).json({ message: 'Invalid credential configuration.' });
  }
};
