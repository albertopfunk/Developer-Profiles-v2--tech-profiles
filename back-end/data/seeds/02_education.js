const faker = require("faker");
const { seedSchools } = require("../seedData");

// eslint-disable-next-line
exports.seed = function (knex, Promise) {
  let educationArr = [];

  for (let i = 1; i <= 50; i++) {
    let randomSchool = Math.floor(Math.random() * seedSchools.length);
    educationArr.push({
      user_id: i,
      school: seedSchools[randomSchool],
      school_dates: "2017 - present",
      field_of_study: faker.name.jobArea(),
      education_description:
        "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    });
  }

  return knex("education").truncate().insert(educationArr);
  // Deletes ALL existing entries
  // return knex("education")
  //   .del()
  //   .then(function() {
  //     // Inserts seed entries
  //     return knex("education")
  //       .truncate()
  //       .insert(educationArr);
  //   });
};
