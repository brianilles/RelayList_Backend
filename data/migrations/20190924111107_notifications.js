exports.up = function(knex) {
  return knex.schema.createTable('notifications', tbl => {
    tbl.increments();
    tbl
      .integer('user_id')
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl
      .integer('creator_id')
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl
      .integer('post_id')
      .unsigned()
      .references('posts.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.boolean('read').defaultTo(false);
    tbl
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notifications');
};
