// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  let educationArr = [];
  for (let i = 1; i <= 50; i++) {
    educationArr.push({
      user_id: i,
      school: "Stanford",
      school_dates: "September 1998 - Present",
      field_of_study: "Full Stack Web"
    });
  }

  // Deletes ALL existing entries
  return knex("education")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("education")
        .truncate()
        .insert(educationArr);
    });
};
