const { seedUserLocations } = require("../seedData");

exports.seed = function (knex) {
  return knex("user_locations")
    .del()
    .then(async function () {
      for (let i = 0; i < 50; i++) {
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        let newSeedUserLocations = [...seedUserLocations];

        let splitSeedUserLocations = newSeedUserLocations.filter((location) => {
          return location.user_id >= start && location.user_id <= end;
        });

        await knex("user_locations").insert(splitSeedUserLocations);
      }
    });
};
