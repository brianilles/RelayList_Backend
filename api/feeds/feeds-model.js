const Posts = require('../posts/posts-model.js');
const Users = require('../users/users-model.js');
const Likes = require('../posts/likes-model.js');

module.exports = {
  getFeed
};

// just gets posts for now
async function getFeed(id, chunk) {
  const posts = await Posts.findByChunkOnly(chunk);

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

      const creator = await Users.publicTwoFindBy({ id: post.user_id });

      delete post.user_id;

      if (likes === undefined) {
        post.likes = 0;
      } else {
        post.likes = likes.length;
      }

      post.creator = creator;
    }
  }
  return posts;
}
