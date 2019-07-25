// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("skills", function(table) {
    table.increments();
    table.string("skill").unique("skill").notNullable();
  });
};

// eslint-disable-next-line
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("skills");
};
