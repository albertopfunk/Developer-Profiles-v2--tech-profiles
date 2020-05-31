// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("projects", function(table) {
    table.increments();
    table.string("project_title");
    table.string("project_img");
    table.string("link");
    table.string("project_description", 280);
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
