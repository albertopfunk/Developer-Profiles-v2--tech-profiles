
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_locations').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_locations').insert([
        {user_id: 1, location_id: 1},
        {user_id: 1, location_id: 6},
        {user_id: 1, location_id: 16},
        {user_id: 1, location_id: 4},
        {user_id: 1, location_id: 8}
      ]);
    });
};
