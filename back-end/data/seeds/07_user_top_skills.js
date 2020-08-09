exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_top_skills")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_top_skills").insert([
        { user_id: 1, skill_id: 1 }, // Ruby
        { user_id: 1, skill_id: 6 }, // Elixir
        { user_id: 1, skill_id: 15 }, // SQL
        { user_id: 1, skill_id: 10 }, // Web Performance
        { user_id: 1, skill_id: 19 }, // Vue
      ]);
    });
};
