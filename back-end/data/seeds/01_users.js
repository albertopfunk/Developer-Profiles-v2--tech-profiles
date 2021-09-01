const faker = require("faker");
const {
  seedLocations,
  seedTitles,
  seedSkills,
  seedUserTopSkills,
  seedUserAdditionalSkills,
  seedAvatarUrls,
} = require("../seedData");

exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(async function () {
      function randomUserImage() {
        return Math.floor(Math.random() * (11 - 1) + 1) <= 5;
      }

      function randomAvatarImage() {
        let randomAvatar = Math.floor(Math.random() * seedAvatarUrls.length);
        return seedAvatarUrls[randomAvatar];
      }

      function randomAreaOfWorkValue() {
        let filterOptions = ["Development", "iOS", "Android", "Design"];
        let rand = [(Math.random() * filterOptions.length) | 0];
        return filterOptions[rand];
      }

      function randomTitleValue(areaOfWork) {
        const titles = seedTitles[areaOfWork];
        let rand = [(Math.random() * titles.length) | 0];
        return titles[rand];
      }

      function randomTitleAndAreaOfWork() {
        const areaOfWork = randomAreaOfWorkValue();
        const title = randomTitleValue(areaOfWork)
        return {
          areaOfWork,
          title,
        }
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
          randSKills.top = randSKills.top += `${
            seedSkills[skill.skill_id - 1]
          }`;
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

      for (let i = 0; i < 40; i++) {
        const userArr = [];
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        for (let j = start; j <= end; j++) {
          const userLocation = randomLocationValue();
          const userSkills = randomSkillsSync(j);
          const { title, areaOfWork } = randomTitleAndAreaOfWork();

          userArr.push({
            email: `test_email_${j}@gmail.com`,
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            profile_image: randomUserImage() ? faker.image.avatar() : null,
            avatar_image: randomAvatarImage(),
            desired_title: title,
            area_of_work: areaOfWork,
            current_location_name: userLocation.name,
            current_location_lat: userLocation.lat,
            current_location_lon: userLocation.lon,
            top_skills_prev: userSkills.top,
            additional_skills_prev: userSkills.additional,
            public_email: "albertopfunk@gmail.com",
            github: "https://github.com/albertopfunk",
            linkedin: "https://www.linkedin.com/in/albertopfunk",
            twitter: "https://twitter.com/albertopfunk",
            portfolio: "https://albertopfunk.dev",
            summary:
              "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
            stripe_subscription_name: "subscription_name_example",
          });
        }
        await knex("users").insert(userArr);
      }
    });
};
