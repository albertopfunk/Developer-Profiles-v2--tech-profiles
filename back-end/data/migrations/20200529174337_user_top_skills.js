// eslint-disable-next-line
exports.up = function (knex) {
  return knex.schema.createTable("user_top_skills", function (table) {
    table.primary(["user_id", "skill_id"]);
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("skill_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("skills")
      .onDelete("CASCADE");
  });
};

// eslint-disable-next-line
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_top_skills");
};
