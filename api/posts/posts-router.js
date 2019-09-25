const router = require('express').Router();
const Posts = require('./posts-model.js');
const Users = require('../users/users-model.js');

const restrictedByAuthorization = require('../auth/restricted-by-authorization-middleware.js');

// router.get('/:post_id', (req, res) => {});

// router.get('/post-preview/:post_id', (req, res) => {});

router.post('/:id', restrictedByAuthorization, async (req, res) => {
  const user_id = req.params.id;
  const { title, description, type, content } = req.body;

  if (!user_id || !title || !description || !type || !content) {
    res.status(422).end();
  } else {
    // does array garentee order?
    const jsonContent = JSON.stringify(content);

    try {
      const user = Users.secureFindBy({ id: user_id });
      if (!user) {
        res.status(404).end();
      } else {
        const [addedPost] = await Posts.add({
          user_id,
          title,
          description,
          type,
          content: jsonContent
        });
        if (addedPost) {
          const post = await Posts.findBy({ id: addedPost });
          post.content = JSON.parse(post.content);
          res.status(201).json(post);
        } else {
          res
            .status(500)
            .json({ message: 'There was an error adding the post' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

// router.delete('/:user_id/post_id', (req, res) => {});

module.exports = router;
