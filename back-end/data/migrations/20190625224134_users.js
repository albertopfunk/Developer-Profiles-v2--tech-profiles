// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table) {
    table.increments();
    table.string("email").unique("email");
    table.string("public_email");
    table.string("first_name");
    table.string("last_name");
    table.string("image");
    table.string("image_id");
    table.string("desired_title");
    table.string("area_of_work");
    table.string("current_location_name");
    table.string("current_location_lat");
    table.string("current_location_lon");
    table.string("top_skills_prev");
    table.string("additional_skills_prev");
    table.string("github");
    table.string("twitter");
    table.string("linkedin");
    table.string("portfolio");
    table.string("summary", 280);
    table.string("stripe_customer_id");
    table.string("stripe_subscription_name");
  });
};

// eslint-disable-next-line
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
