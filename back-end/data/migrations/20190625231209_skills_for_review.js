// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("skills_for_review", function(table) {
    table.increments();
    table.string("skill_for_review").unique("skill_for_review").notNullable();
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
  return knex.schema.dropTableIfExists("skills_for_review");
};
