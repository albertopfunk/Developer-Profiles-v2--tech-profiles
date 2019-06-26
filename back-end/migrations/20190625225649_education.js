// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("education", function(table) {
    table.increments();
    table.string("school");
    table.string("school_dates");
    table.string("field_of_study");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

// eslint-disable-next-line
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("education");
};
