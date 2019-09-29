exports.up = function(knex) {
  return knex.schema.createTable('unverified_users', tbl => {
    tbl.increments();
    tbl
      .string('email', 128)
      .notNullable()
      .unique();
    tbl.string('full_name', 128).notNullable();
    tbl.string('username', 128).notNullable();
    tbl.string('token', 128);
    tbl.string('password', 128).notNullable();
    tbl
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('unverified_users');
};
