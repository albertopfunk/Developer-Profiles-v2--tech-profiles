const { seedUserTopSkills } = require("../seedData");

exports.seed = function (knex) {
  return knex("user_top_skills")
    .del()
    .then(async function () {
      for (let i = 0; i < 40; i++) {
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        let newSeedUserTopSkills = [...seedUserTopSkills];

        let splitSeedUserTopSkills = newSeedUserTopSkills.filter((location) => {
          return location.user_id >= start && location.user_id <= end;
        });

        await knex("user_top_skills").insert(splitSeedUserTopSkills);
      }
    });
};
