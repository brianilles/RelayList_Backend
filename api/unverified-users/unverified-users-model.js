const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  secureFindBy,
  findTokenEmailBy,
  remove
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

function remove(filter) {
  return db('unverified_users')
    .where(filter)
    .del();
}
