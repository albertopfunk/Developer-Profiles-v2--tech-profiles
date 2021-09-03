const faker = require("faker");
const { seedSchools } = require("../seedData");

exports.seed = function (knex) {
  return knex("education")
    .del()
    .then(async function () {
      for (let i = 0; i < 200; i++) {
        let educationArr = [];
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        for (let j = start; j <= end; j++) {
          let randomSchool = Math.floor(Math.random() * seedSchools.length);
          educationArr.push({
            user_id: j,
            school: seedSchools[randomSchool],
            school_dates: "2017 - present",
            field_of_study: faker.name.jobArea(),
            education_description:
              "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
          });
        }
        await knex("education").insert(educationArr);
      }
    });
};
