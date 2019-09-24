exports.up = function(knex) {
  return knex.schema.createTable('content', tbl => {
    tbl.increments();
    tbl
      .integer('post_id')
      .unsigned()
      .references('posts.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.string('text', 5000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('content');
};
