exports.up = function(knex) {
  return knex.schema.createTable('posts', tbl => {
    tbl.increments();
    tbl
      .integer('user_id')
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.string('title', 80).notNullable();
    tbl.string('description', 128).notNullable();
    tbl.string('type', 20).notNullable();
    tbl
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('posts');
};
