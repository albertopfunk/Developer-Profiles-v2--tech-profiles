// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let experienceArr = [];
  for (let i = 1; i <= 50; i++) {
    experienceArr.push({
      user_id: i,
      company_name: "Google",
      job_title: "Software Developer",
      job_dates: "September 1998 - Present",
      job_description:
        "Nunquam rerun eos dolorous total. Quo beaten ut est sit quia et temporizes quadrat harem. Voluptuaries et ibague et dubious sit a asperities nisi."
    });
  }

  // Deletes ALL existing entries
  return knex("experience")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("experience")
        .truncate()
        .insert(experienceArr);
    });
};
