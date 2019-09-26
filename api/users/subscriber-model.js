const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  remove,
  count
};

function add(like) {
  return db('subscribers').insert(like);
}

function count(filter) {
  return db('subscribers').where(filter);
}

function findBy(filter) {
  return db('subscribers')
    .select()
    .where(filter)
    .first();
}

function remove(filter) {
  return db('subscribers')
    .where(filter)
    .del();
}
