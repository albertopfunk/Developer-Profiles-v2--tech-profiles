const { seedUserAdditionalSkills } = require("../seedData");

exports.seed = function (knex) {
  return knex("user_additional_skills")
    .del()
    .then(async function () {
      for (let i = 0; i < 200; i++) {
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        let newSeedUserAdditionalSkills = [...seedUserAdditionalSkills];

        let splitSeedUserAdditionalSkills = newSeedUserAdditionalSkills.filter(
          (location) => {
            return location.user_id >= start && location.user_id <= end;
          }
        );

        await knex("user_additional_skills").insert(
          splitSeedUserAdditionalSkills
        );
      }
    });
};
