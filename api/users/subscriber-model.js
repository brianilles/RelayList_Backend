const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findAllBy,
  remove,
  count,
  findByChunk
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

function findAllBy(filter) {
  return db('subscribers')
    .select()
    .where(filter);
}

function remove(filter) {
  return db('subscribers')
    .where(filter)
    .del();
}

function findByChunk(filter, chunk) {
  return db('subscribers')
    .select()
    .where(filter)
    .limit(10)
    .offset(chunk * 10);
}
