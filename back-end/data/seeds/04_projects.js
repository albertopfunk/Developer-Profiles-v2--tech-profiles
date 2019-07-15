// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let projectArr = [];
  for (let i = 1; i <= 50; i++) {
    projectArr.push({
      user_id: i,
      project_img:
        "https://res.cloudinary.com/dlo7dkdfy/image/upload/v1554828723/browser-1666982_960_720.png",
      project_title: "Google",
      link: "https://www.google.com/",
      project_description:
        "Nunquam rerun eos dolorous total. Quo beaten ut est sit quia et temporizes quadrat harem. Voluptuaries et ibague et dubious sit a asperities nisi."
    });
  }

  // Deletes ALL existing entries
  return knex("projects")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("projects")
        .truncate()
        .insert(projectArr);
    });
};
