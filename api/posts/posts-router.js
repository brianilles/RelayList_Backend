const router = require('express').Router();
const Posts = require('./posts-model.js');
const Users = require('../users/users-model.js');
const Likes = require('./likes-model.js');

const restrictedByAuthorization = require('../auth/restricted-by-authorization-middleware.js');

const Validate = require('./validate-content.js');

router.get('/:post_id', async (req, res) => {
  const { post_id } = req.params;

  try {
    if (!post_id) {
      res.status(422).end();
    } else {
      const post = await Posts.findBy({ id: post_id });
      if (!post) {
        res.status(404).end();
      } else {
        const securePost = {
          title: post.title,
          description: post.description,
          type: post.type,
          created_at: post.created_at
        };

        // likes
        const postLikes = await Likes.count({ post_id });
        if (postLikes === undefined) {
          securePost.likes = 0;
        } else {
          securePost.likes = postLikes.length;
        }

        const creator = await Users.publicTwoFindBy({
          id: post.user_id
        });
        if (!creator) {
          res.status(404).end();
        } else {
          securePost.content = JSON.parse(post.content);
          const postData = {
            post: securePost,
            creator
          };
          res.status(200).json(postData);
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
});

router.get('/post-preview/:post_id', async (req, res) => {
  const { post_id } = req.params;
  try {
    if (!post_id) {
      res.status(422).end();
    } else {
      const post = await Posts.findPreviewBy({ id: post_id });
      if (!post) {
        res.status(404).end();
      } else {
        const securePost = {
          title: post.title,
          description: post.description,
          type: post.type,
          created_at: post.created_at
        };

        // likes
        const postLikes = await Likes.count({ post_id });
        if (postLikes === undefined) {
          securePost.likes = 0;
        } else {
          securePost.likes = postLikes.length;
        }

        // add creator
        const creator = await Users.publicTwoFindBy({
          id: post.user_id
        });

        if (!creator) {
          res.status(404).end();
        } else {
          const postData = {
            post: securePost,
            creator
          };
          res.status(200).json(postData);
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
});

router.post('/', restrictedByAuthorization, async (req, res) => {
  const user_id = req.session.ui;
  const { title, description, type, content } = req.body;

  if (!user_id || !title || !description || !type || !content) {
    res.status(422).end();
  } else {
    // does array garentee order?
    // screen content
    const contentIsValid = Validate.screenContent(content);
    if (!contentIsValid) {
      res.status(422).end();
    } else {
      try {
        const user = Users.secureFindBy({ id: user_id });
        if (!user) {
          res.status(404).end();
        } else {
          const jsonContent = JSON.stringify(content);
          const [addedPost] = await Posts.add({
            user_id,
            title,
            description,
            type,
            content: jsonContent
          });

          if (addedPost) {
            const post = await Posts.findBy({ id: addedPost });

            // likes
            const postLikes = await Likes.count({ id: post.id });
            if (postLikes === undefined) {
              post.likes = 0;
            } else {
              post.likes = postLikes.length;
            }

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
  }
});

router.delete('/:id/:post_id', restrictedByAuthorization, async (req, res) => {
  const { id, post_id } = req.params;
  if (!post_id) {
    res.status(422).end();
  } else {
    try {
      const post = await Posts.findBy({ id: post_id });

      if (!post) {
        res.status(404).end();
      } else {
        // check for ownership
        if (post.user_id == id) {
          const deletedPost = await Posts.remove({ id: post.id });
          if (deletedPost) {
            res.status(204).end();
          } else {
            res
              .status(500)
              .json({ message: 'There was an error deleting the post.' });
          }
        } else {
          res.status(405).json({ message: 'Invalid permissions.' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

router.post('/like/:post_id', restrictedByAuthorization, async (req, res) => {
  const { post_id } = req.params;
  const id = req.session.ui;

  if (!id || !post_id) {
    res.status(422).end();
  } else {
    try {
      const post = await Posts.findBy({ id: post_id });

      if (!post) {
        res.status(404).end();
      } else {
        const hasLiked = await Likes.findBy({ user_id: id, post_id });

        if (hasLiked) {
          const removedLike = await Likes.remove({ user_id: id, post_id });
          if (removedLike) {
            res.status(204).end();
          }
        } else {
          const addedLike = await Likes.add({ user_id: id, post_id });
          if (addedLike) {
            res.status(201).json({ message: 'Like added.' });
          }
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

module.exports = router;
