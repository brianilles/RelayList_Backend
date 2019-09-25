const db = require('../../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  remove
};

function add(user) {
  return db('users_reset').insert(user);
}

function findBy(filter) {
  return db('users_reset')
    .select()
    .where(filter)
    .first();
}

function remove(filter) {
  return db('users_reset')
    .where(filter)
    .del();
}
