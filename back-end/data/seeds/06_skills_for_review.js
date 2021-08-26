exports.seed = function (knex) {
  return knex("skills_for_review")
    .del()
    .then(function () {
      return knex("skills_for_review").insert([
        { skill_for_review: "Being Cool", user_id: 1, type: "top" },
        { skill_for_review: "Poker", user_id: 1, type: "additional" },
        { skill_for_review: "Web Assembly", user_id: 1, type: "top" },
      ]);
    });
};
