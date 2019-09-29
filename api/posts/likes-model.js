const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  remove,
  count
};

function add(like) {
  return db('likes').insert(like);
}

function count(filter) {
  return db('likes').where(filter);
}

function findBy(filter) {
  return db('likes')
    .select()
    .where(filter)
    .first();
}

function remove(filter) {
  return db('likes')
    .where(filter)
    .del();
}
