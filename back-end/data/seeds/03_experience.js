const faker = require("faker");

// eslint-disable-next-line
exports.seed = function (knex, Promise) {
  let experienceArr = [];
  experienceArr.push({
    user_id: 1,
    company_name: faker.company.companyName(),
    job_title: faker.name.jobTitle(),
    job_dates: `${faker.date.past()} - Present`,
    job_description:
      "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
  });

  return knex("experience").truncate().insert(experienceArr);
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
