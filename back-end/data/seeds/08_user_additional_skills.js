const { seedUserAdditionalSkills } = require("../seedData");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_additional_skills")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_additional_skills").insert(seedUserAdditionalSkills);
    });
};
