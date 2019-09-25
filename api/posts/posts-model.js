const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy
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
