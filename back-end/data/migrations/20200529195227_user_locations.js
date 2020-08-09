// eslint-disable-next-line
exports.up = function (knex) {
  return knex.schema.createTable("user_locations", function (table) {
    table.primary(["user_id", "location_id"]);
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("location_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("locations")
      .onDelete("CASCADE");
  });
};

// eslint-disable-next-line
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_locations");
};
