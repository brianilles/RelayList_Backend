const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findPreviewBy
};
function add(post) {
  return db('posts').insert(post);
}

function findBy(filter) {
  return db('posts')
    .select()
    .where(filter)
    .first();
}

function findPreviewBy(filter) {
  return db('posts')
    .select('user_id', 'title', 'description', 'type', 'created_at')
    .where(filter)
    .first();
}
