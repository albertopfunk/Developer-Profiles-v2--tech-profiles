const faker = require("faker");

// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let educationArr = [];
  educationArr.push({
    user_id: 1,
    school: "Stanford",
    school_dates: "September 2019 - Present",
    field_of_study: "Full-Stack Web",
    education_description: "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters."
  });

  return knex("education")
    .truncate()
    .insert(educationArr);
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
