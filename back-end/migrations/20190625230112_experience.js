// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("experience", function(table) {
    table.increments();
    table.string("company_name");
    table.string("job_title");
    table.string("job_dates");
    table.string("job_description", 1000);
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
  return knex.schema.dropTableIfExists("experience");
};
