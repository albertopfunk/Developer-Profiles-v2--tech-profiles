const faker = require("faker");

// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let educationArr = [];
  educationArr.push({
    user_id: 1,
    school: "Stanford",
    school_dates: "September 1998 - Present",
    field_of_study: "Full Stack Web"
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
