const router = require('express').Router();
const Feeds = require('./feeds-model.js');

const restrictedByAuthorization = require('../auth/restricted-by-authorization-middleware.js');

// Gets main generic feed
router.get('/main/:id/:chunk', restrictedByAuthorization, async (req, res) => {
  const { id, chunk } = req.params;

  if (!id || !chunk) {
    res.status(422).end();
  } else {
    try {
      const feed = await Feeds.getFeed(id, chunk);
      if (feed) {
        res.status(200).json(feed);
      } else {
        res
          .status(500)
          .json({ message: 'An error occurred when retrieving the feed.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

module.exports = router;
