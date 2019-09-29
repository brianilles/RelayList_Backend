const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  secureFindBy,
  findTokenEmailBy,
  remove,
  updateToken
};

function add(user) {
  return db('unverified_users').insert(user);
}

function secureFindBy(filter) {
  return db('unverified_users')
    .select('id', 'email', 'full_name', 'username', 'created_at')
    .where(filter)
    .first();
}

function findBy(filter) {
  return db('unverified_users')
    .select()
    .where(filter)
    .first();
}

function findTokenEmailBy(filter) {
  return db('unverified_users')
    .select('id', 'email', 'token')
    .where(filter)
    .first();
}

function updateToken({ id, token }) {
  return db('unverified_users')
    .where({ id })
    .update({ token });
}

function remove(filter) {
  return db('unverified_users')
    .where(filter)
    .del();
}
