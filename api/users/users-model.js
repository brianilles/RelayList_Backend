const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  secureFindBy
};

function add(user) {
  return db('users').insert(user);
}

function findBy(filter) {
  return db('users')
    .select()
    .where(filter)
    .first();
}

function secureFindBy(filter) {
  return db('users')
    .select(
      'id',
      'email',
      'full_name',
      'username',
      'bio',
      'profile_image',
      'created_at'
    )
    .where(filter)
    .first();
}
