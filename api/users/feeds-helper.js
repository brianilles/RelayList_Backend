const Users = require('../users/users-model.js');
const Posts = require('../posts/posts-model.js');
const Likes = require('../posts/likes-model.js');
const Subscriptions = require('./subscriber-model.js');

module.exports = {
  getUserFeed,
  getSubscriptionsFeed
};

// just gets posts for now
async function getUserFeed(id, chunk) {
  const posts = await Posts.findByChunk({ user_id: id }, chunk);

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

// get a user's subscriptions
async function getSubscriptionsFeed(id, chunk) {
  const subscriptions = [];
  const subs = await Subscriptions.findByChunk({ user_id: id }, chunk);

  if (subs) {
    for (sub of subs) {
      const user = await Users.publicFindBy({ id: sub.creator_id });
      subscriptions.push(user);
    }
  }

  return subscriptions;
}
