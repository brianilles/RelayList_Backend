const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  secureFindBy,
  publicFindBy,
  updateBio,
  remove,
  updateImg
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

function publicFindBy(filter) {
  return db('users')
    .select('id', 'full_name', 'username', 'bio', 'profile_image', 'created_at')
    .where(filter)
    .first();
}

function updateBio(id, bio) {
  return db('users')
    .where({ id })
    .update({ bio });
}

function remove(filter) {
  return db('users')
    .where(filter)
    .del();
}

function updateImg({ id, profile_image }) {
  return db('users')
    .where({ id })
    .update({ profile_image });
}
