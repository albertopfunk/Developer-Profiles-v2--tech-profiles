exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_additional_skills")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_additional_skills").insert([
        { user_id: 1, skill_id: 11 }, // React
        { user_id: 1, skill_id: 8 }, // Front-End
        { user_id: 1, skill_id: 5 }, // Java
        { user_id: 1, skill_id: 17 }, // Stripe
        { user_id: 1, skill_id: 3 }, // Angular
      ]);
    });
};
