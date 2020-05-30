// eslint-disable-next-line
exports.up = function(knex) {
  return knex.schema.createTable("user_locations", function(table) {
    table.increments();
    table.primary(['userId', 'locationId']);
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("locationId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("locations")
      .onDelete("CASCADE");
  });
};

// eslint-disable-next-line
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user_locations");
};
