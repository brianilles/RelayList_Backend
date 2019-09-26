exports.up = function(knex) {
  return knex.schema.createTable('users_reset', tbl => {
    tbl.increments();
    tbl
      .integer('user_id')
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.string('token', 128);
    tbl
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users_reset');
};
