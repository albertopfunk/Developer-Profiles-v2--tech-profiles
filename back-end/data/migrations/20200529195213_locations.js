// eslint-disable-next-line
exports.up = function (knex, Promise) {
  return knex.schema.createTable("locations", function (table) {
    table.increments();
    table.string("location").unique("location").notNullable();
  });
};

// eslint-disable-next-line
exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("locations");
};
