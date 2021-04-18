const faker = require("faker");
const {
  seedLocations,
  seedTitles,
  seedSkills,
  seedUserTopSkills,
  seedUserAdditionalSkills,
} = require("../seedData");

// eslint-disable-next-line
exports.seed = function (knex, Promise) {
  const userArr = [];

  function randomAreaOfWorkValue() {
    let filterOptions = ["Development", "iOS", "Android", "Design"];
    let rand = [(Math.random() * filterOptions.length) | 0];
    return filterOptions[rand];
  }

  function randomTitleValue() {
    const titles = seedTitles;
    let rand = [(Math.random() * titles.length) | 0];
    return titles[rand];
  }

  function randomSkillsSync(id) {
    const randSKills = { top: "", additional: "" };
    const userTopSkills = seedUserTopSkills.filter(
      (skill) => skill.user_id === id
    );
    const userAdditionalSKills = seedUserAdditionalSkills.filter(
      (skill) => skill.user_id === id
    );

    userTopSkills.forEach((skill, i) => {
      if (i > 5) return;
      i > 0 ? (randSKills.top += ",") : null;
      randSKills.top = randSKills.top += `${seedSkills[skill.skill_id - 1]}`;
    });

    userAdditionalSKills.forEach((skill, i) => {
      if (i > 5) return;
      i > 0 ? (randSKills.additional += ",") : null;
      randSKills.additional = randSKills.additional += `${
        seedSkills[skill.skill_id - 1]
      }`;
    });

    return randSKills;
  }

  function randomLocationValue() {
    const currentLocations = seedLocations;
    let rand = [(Math.random() * currentLocations.length) | 0];
    return currentLocations[rand];
  }

  for (let i = 1; i <= 50; i++) {
    const userLocation = randomLocationValue();
    const userSkills = randomSkillsSync(i);

    userArr.push({
      email: `test_email_${i}@gmail.com`,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      desired_title: randomTitleValue(),
      area_of_work: randomAreaOfWorkValue(),
      current_location_name: userLocation.name,
      current_location_lat: userLocation.lat,
      current_location_lon: userLocation.lon,
      top_skills_prev: userSkills.top,
      additional_skills_prev: userSkills.additional,
      public_email: faker.internet.email(),
      github: "github.com",
      linkedin: "linkedin.com",
      twitter: "twitter.com",
      portfolio: "albertopfunk.dev",
      summary:
        "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
      stripe_subscription_name: "subscription_name_example",
    });
  }

  // Deletes ALL existing entries
  return knex("users").truncate().insert(userArr);
  // return knex("users")
  //   .del()
  //   .then(function() {
  //     // Inserts seed entries
  //     return knex("users")
  //       .truncate()
  //       .insert(userArr);
  //   });
};
