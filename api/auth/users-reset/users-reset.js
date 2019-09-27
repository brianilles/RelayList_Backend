const db = require('../../../data/dbConfig.js');

module.exports = {
  add,
  secureFindBy,
  findBy,
  remove,
  updateToken,
  updatePass
};

function add(user) {
  return db('users_reset').insert(user);
}

function secureFindBy(filter) {
  return db('users_reset')
    .select('id')
    .where(filter)
    .first();
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

function updateToken({ id, token }) {
  return db('users_reset')
    .where({ id })
    .update({ token });
}

function updatePass({ id }) {
  return db('users_reset')
    .where({ id })
    .update({ has_passed: true });
}
