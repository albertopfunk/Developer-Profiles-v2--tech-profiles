const faker = require("faker");

exports.seed = function (knex) {
  return knex("experience")
    .del()
    .then(async function () {
      for (let i = 0; i < 200; i++) {
        let experienceArr = [];
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        for (let j = start; j <= end; j++) {
          let randomNumber = Math.floor(Math.random() * 5);
          for (let k = 0; k < randomNumber; k++) {
            let year = 2015 + k;
            experienceArr.push({
              user_id: j,
              company_name: faker.company.companyName(),
              job_title: faker.name.jobTitle(),
              job_dates: `${year} - ${year + 1}`,
              job_description:
                "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
            });
          }
        }
        await knex("experience").insert(experienceArr);
      }
    });
};
