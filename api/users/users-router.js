const express = require('express');
const router = require('express').Router();
const Users = require('./users-model.js');
const restrictedByAuthorization = require('../auth/restricted-by-authorization-middleware.js');
const uploadImage = require('./image-uploads.js');
const fs = require('fs');

// Gets user's public information
router.get('/public/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(422).end();
  } else {
    try {
      const user = await Users.publicFindBy({ id });
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

// [OWNERSHIP REQUIRED] gets user's private information
router.get('/private/:id', restrictedByAuthorization, async (req, res) => {
  const { id } = req.params;
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

// [OWNERSHIP REQUIRED] Edits a user's bio
router.put('/bio/:id', restrictedByAuthorization, async (req, res) => {
  const { id } = req.params;
  const { bio } = req.body;

  if (!bio) {
    res.status(422).end();
  } else {
    try {
      const updatedBio = await Users.updateBio(id, bio);
      if (updatedBio) {
        const user = await Users.secureFindBy({ id });
        res.status(200).json(user);
      } else {
        res
          .status(500)
          .json({ message: 'An error occurred when updating the bio.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// [OWNERSHIP REQUIRED] Edits a user's profile image
router.post(
  '/profile-image/:id',
  restrictedByAuthorization,
  uploadImage.upload().single('profile-image'),
  async (req, res) => {
    const { id } = req.params;
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
router.use('/profile-images', express.static('profile-images')); // TODO change 404 from default

// [OWNERSHIP REQUIRED] Deletes a user's profile image
// Sends email to user to reset password
// Confirms or denies password reset verification for the user

// [OWNERSHIP REQUIRED] deletes a user
router.delete('/:id', restrictedByAuthorization, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.secureFindBy({ id });
    if (!user) {
      res.status(404).end();
    } else {
      const deletedUser = await Users.remove({ id });
      if (deletedUser) {
        res.status(204).end();
      } else {
        res
          .status(500)
          .json({ message: 'There was an error deleting the user.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
});

module.exports = router;
