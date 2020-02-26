// eslint-disable-next-line
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table) {
    table.increments();
    table.string("email", 1000).unique("email");
    table.string("public_email", 1000);
    table.string("first_name", 1000);
    table.string("last_name", 1000);
    table.string("image", 1000);
    table.string("desired_title", 1000);
    table.string("area_of_work");
    table.string("current_location_name", 1000);
    table.string("current_location_lat", 1000);
    table.string("current_location_lon", 1000);
    table.string("interested_location_names", 1000);
    table.string("github");
    table.string("linkedin");
    table.string("portfolio");
    table.string("summary", 1000);
    table.string("stripe_customer_id");
    table.string("stripe_subscription_name");
    table.string("top_skills", 1000);
    table.string("additional_skills", 1000);
  });
};

// eslint-disable-next-line
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
