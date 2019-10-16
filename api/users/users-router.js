const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const Users = require('./users-model.js');
const Subscribers = require('./subscriber-model.js');

const Feeds = require('./feeds-helper.js');

const restrictedByAuthorization = require('../auth/restricted-by-authorization-middleware.js');
const restrictedByAuthorizationActive = require('../auth/restricted-by-authorization-active-middleware.js');
const uploadImage = require('./image-uploads.js');

const restricted = require('../auth/restricted-middleware.js');

// Gets user's public information
router.get('/public/:username', async (req, res) => {
  const { username } = req.params;
  if (!username) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.publicFindBy({ username });
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

// Gets user's private information
router.get('/private', restrictedByAuthorization, async (req, res) => {
  const id = req.session.ui;
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

// Edits a user's bio
router.put('/bio', restrictedByAuthorization, async (req, res) => {
  const id = req.session.ui;
  const { bio } = req.body;

  if (!bio) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.publicFindBy({ id });
      if (user) {
        const updatedBio = await Users.updateBio(id, bio);
        if (updatedBio) {
          const user = await Users.secureFindBy({ id });
          res.status(200).json(user);
        } else {
          res.status(500).json({
            message: 'An error occurred when updating the bio.'
          });
        }
      } else {
        res.status(404).end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// Edits a user's profile image
router.post(
  '/profile-image',
  restrictedByAuthorizationActive,
  uploadImage.upload().single('profile-image'),
  async (req, res) => {
    const id = req.session.ui;
    try {
      const userBefore = await Users.secureFindBy({ id });
      const path = userBefore.profile_image;
      const addedImage = await Users.updateImg({
        id,
        profile_image: req.file.path
      });

      if (addedImage) {
        if (path) {
          fs.unlink(path, error => {
            if (error) {
              console.error(error);
            }
          });
        }
        const user = await Users.secureFindBy({ id });
        res.status(201).json(user);
      } else {
        res.status(500).json({
          message: 'There was an error when adding the profile image.'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
);

// Gets a profile image
router.use('/profile-images', restricted, express.static('profile-images')); // TODO change 404 from default

// Deletes a user's profile image
router.delete('/profile-image', restrictedByAuthorization, async (req, res) => {
  const id = req.session.ui;
  try {
    const userBefore = await Users.secureFindBy({ id });
    if (!userBefore.profile_image) {
      res.status(404).end();
    } else {
      const path = userBefore.profile_image;
      const deletedImage = await Users.updateImg({
        id,
        profile_image: null
      });
      fs.unlink(path, error => {
        if (error) {
          console.error(error);
        }
      });
      if (deletedImage) {
        res.status(204).end();
      } else {
        res
          .status(500)
          .json({ message: 'An error occurred when deleting the image.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
});

// Deletes a user
router.post('/unboard', restrictedByAuthorization, async (req, res) => {
  const id = req.session.ui;
  const { password } = req.body;

  if (!id || !password) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.findBy({ id });
      if (!user) {
        res.status(404).end();
      } else {
        if (user && bcrypt.compareSync(password, user.password)) {
          const deletedUser = await Users.remove({ id });
          if (deletedUser) {
            req.session.destroy(err => {
              if (err) {
                console.error(error);
              }
            });
            res.status(204).end();
          } else {
            res
              .status(500)
              .json({ message: 'There was an error deleting the user.' });
          }
        } else {
          res.status(401).json({ message: 'Invalid credentials.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// Adds/removes a subscriber to a user
router.get(
  '/subscribe/:id/:creator_id',
  restrictedByAuthorization,
  async (req, res) => {
    const { id, creator_id } = req.params;
    if (!id || !creator_id) {
      res.sendStatus(422).end();
    } else {
      try {
        const user = await Users.secureFindBy({ id });
        const creator = await Users.secureFindBy({ id: creator_id });

        if (!user || !creator) {
          res.status(404).end();
        } else {
          const hasSubscribed = await Subscribers.findBy({
            user_id: id,
            creator_id
          });

          if (hasSubscribed) {
            const removedSubscription = await Subscribers.remove({
              user_id: id,
              creator_id
            });
            if (removedSubscription) {
              res.status(204).end();
            } else {
              res.status(500).json({ message: 'An unknown error occurred.' });
            }
          } else {
            const addedSubscriptions = await Subscribers.add({
              user_id: id,
              creator_id
            });
            if (addedSubscriptions) {
              res.status(201).json({ message: 'Subscription added.' });
            } else {
              res.status(500).json({ message: 'An unknown error occurred.' });
            }
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

// Gets all of a user's posts
router.get('/posts/:chunk', restrictedByAuthorization, async (req, res) => {
  const { chunk } = req.params;
  const id = req.session.ui;

  if (!id || !chunk) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.secureFindBy({ id });
      if (!user) {
        res.status(404).end();
      } else {
        const feed = await Feeds.getUserFeed(id, chunk);
        if (feed) {
          res.status(200).json(feed);
        } else {
          res
            .status(500)
            .json({ message: 'An error occurred when retrieving the feed.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// Gets all of a user's subscriptions
router.get(
  '/subscriptions/:id/:chunk',
  restrictedByAuthorization,
  async (req, res) => {
    const { id, chunk } = req.params;
    if (!id || !chunk) {
      res.status(422).end();
    } else {
      try {
        const user = Users.secureFindBy({ id });
        if (!user) {
          res.status(404).end();
        } else {
          const subscriberFeed = await Feeds.getSubscriptionsFeed(id, chunk);
          if (subscriberFeed) {
            res.status(200).json(subscriberFeed);
          } else {
            res.status(500).json({
              message: 'An error occurres when retrieving the subscriber feed.'
            });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }
);

module.exports = router;
