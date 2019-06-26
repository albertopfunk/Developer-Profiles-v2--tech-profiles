// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("skills", function(table) {
    table.increments();
    table.string("skill");
  });
};

// eslint-disable-next-line
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("skills");
};
