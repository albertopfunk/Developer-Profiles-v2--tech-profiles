const faker = require("faker");

// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let projectArr = [];
  projectArr.push({
    user_id: 1,
    project_img:
      "https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_500/v1590908926/dev-profiles-v1-profile-dashboard/j9d4p6fw6qzb7gn9fn5x.webp",
    project_title: faker.company.companyName(),
    link: "https://www.google.com/",
    project_description:
      "245char Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book."
  });

  return knex("projects")
    .truncate()
    .insert(projectArr);
  // Deletes ALL existing entries
  // return knex("projects")
  //   .del()
  //   .then(function() {
  //     // Inserts seed entries
  //     return knex("projects")
  //       .truncate()
  //       .insert(projectArr);
  //   });
};
