const Users = require('../users/users-model.js');
const Posts = require('../posts/posts-model.js');
const Likes = require('../posts/likes-model.js');

module.exports = {
  getUserFeed
};

// just gets posts for now
async function getUserFeed(id, chunk) {
  const posts = await Posts.findByChunk(id, chunk);

  if (posts) {
    for (post of posts) {
      const hasLiked = await Likes.findBy({
        user_id: id,
        post_id: post.id
      });

      if (hasLiked) {
        post.hasLiked = true;
      } else {
        post.hasLiked = false;
      }

      const likes = await Likes.count({ post_id: post.id });

      const creator = await Users.publicFindBy({ id: post.user_id });

      post.creator = creator;

      if (likes === undefined) {
        post.likes = 0;
      } else {
        post.likes = likes.length;
      }
    }
  }
  return posts;
}
