const faker = require("faker");

// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let experienceArr = [];
  for (let i = 1; i <= 50; i++) {
    experienceArr.push({
      user_id: i,
      company_name: faker.company.companyName(),
      job_title: faker.name.jobTitle(),
      job_dates: `${faker.date.past()} - Present`,
      job_description:
        "245char Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    });
  }

  return knex("experience")
    .truncate()
    .insert(experienceArr);
  // Deletes ALL existing entries
  // return knex("experience")
  //   .del()
  //   .then(function() {
  //     // Inserts seed entries
  //     return knex("experience")
  //       .truncate()
  //       .insert(experienceArr);
  //   });
};
