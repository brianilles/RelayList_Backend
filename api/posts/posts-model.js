const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findPreviewBy,
  secureFindBy,
  remove,
  findByChunk
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

function secureFindBy(filter) {
  return db('posts')
    .select('id', 'title')
    .where(filter)
    .first();
}

function findPreviewBy(filter) {
  return db('posts')
    .select('user_id', 'title', 'description', 'type', 'created_at')
    .where(filter)
    .first();
}

function remove(filter) {
  return db('posts')
    .where(filter)
    .del();
}

function findByChunk(filter, chunk) {
  return db('posts')
    .select()
    .limit(10)
    .offset(2 * chunk);
}
