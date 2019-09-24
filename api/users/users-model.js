const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy
};

function add(user) {
  return db('users').insert(user);
}
