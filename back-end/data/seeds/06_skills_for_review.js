// eslint-disable-next-line
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("skills_for_review")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("skills_for_review")
        .truncate()
        .insert([
          { skill_for_review: "Being Cool", user_id: 1, type: "top" },
          { skill_for_review: "Poker", user_id: 2, type: "additional" },
          { skill_for_review: "Web Assembly", user_id: 1, type: "top" },
        ]);
    });
};
