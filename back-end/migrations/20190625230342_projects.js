// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("projects", function(table) {
    table.increments();
    table.string("project_title", 1000);
    table.string("link", 1000);
    table.string("project_description", 1000);
    table.string("project_img", 1000);
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
  return knex.schema.dropTableIfExists("projects");
};
