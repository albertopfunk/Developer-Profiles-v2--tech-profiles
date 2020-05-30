// eslint-disable-next-line
exports.up = function(knex) {
  return knex.schema.createTable("user_additional_skills", function(table) {
    table.increments();
    table.primary(["userId", "skillId"]);
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("skillId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("skills")
      .onDelete("CASCADE");
  });
};

// eslint-disable-next-line
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user_additional_skills");
};
