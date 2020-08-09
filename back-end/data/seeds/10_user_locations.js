exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_locations")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_locations").insert([
        { user_id: 1, location_id: 1 }, // Los Angeles, CA, USA
        { user_id: 1, location_id: 6 }, // Tampa, FL, USA
        { user_id: 1, location_id: 16 }, // New Orleans, LA, USA
        { user_id: 1, location_id: 4 }, // South Valley, NM, USA
        { user_id: 1, location_id: 8 }, // Philadelphia, PA, USA
      ]);
    });
};
