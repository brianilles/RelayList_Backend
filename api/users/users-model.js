const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy
};

function add(user) {
  return db('users').insert(user);
}

function findBy(filter) {
  return db('users')
    .select('id', 'email', 'full_name', 'username', 'password', 'created_at')
    .where(filter)
    .first();
}
