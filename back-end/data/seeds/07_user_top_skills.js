const { seedUserTopSkills } = require("../seedData");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_top_skills")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_top_skills").insert(seedUserTopSkills);
    });
};
