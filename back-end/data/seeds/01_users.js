const faker = require("faker");
const db = require("../../data/dbConfig");
const { seedLocations, seedTitles } = require("../seedData");

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

  function randomSkillsValue() {
    // get skills
    // add skills
    // do this properly adding them to DB
    // and letting DB update skills string
    // ******
    // skills and relocate to locations
    // can only be added on the other seeds
    // skills need to be synced
    // you can add more locations and skills in db
    // when you create skills preview strings
    // get 5 skills for each, and save the skill ID and user id
    // you can use that to create the user_skills
    // locations will be easier
    // since users will be 1-1000
    // just choose 1-5 random location for each user
    //** STEPS
    // add ~100 skills *COMPLETE*
    // add ~100 current locations for randomLocationValue()
    // add ~100 relocate to locations(just copy from randomLocationValue)
    // add ~100 titles *COMPLETE*
    // ~20 of each user extras
    // create 1000 seed users
    // create skills array for each user with 2-10 additional/top skills
    // array will be
    // { user_id: 1, skill_id: 1 } top skills
    // { user_id: 1, skill_id: 11 } additional skills
    // so 2 arrays
    // if they are saved like that then you do not need to do
    // anything extra when adding the top/additional user skills
    // just seed the array directly
    // seed 1-5 random relocate to locations for 1000 users
    // skills for review do not need anything
    // user extras 1000 users choose
    // 1 education
    // 1-5 experiences
    // 1-5 projects
    //
  }

  function randomLocationValue() {
    const currentLocations = seedLocations;
    let rand = [(Math.random() * currentLocations.length) | 0];
    return currentLocations[rand];
  }

  const userLocation = randomLocationValue();

  userArr.push({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),

    // do not add images so you can show avatars instead
    image:
      "https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_800/v1590889437/dev-profiles-v1-profile-dashboard/sxifjyiyc5hwujqfyven.webp",

    image_id: "image_id_example",

    desired_title: randomTitleValue(),
    area_of_work: randomAreaOfWorkValue(),
    current_location_name: userLocation.name,
    current_location_lat: userLocation.lat,
    current_location_lon: userLocation.lon,

    // skills should sync with db?
    top_skills_prev: "Ruby, Elixir, SQL, Web Performance, Vue",
    additional_skills_prev: "React, Front-End, Java, Stripe, Angular",

    public_email: faker.internet.email(),
    github: "github.com",
    linkedin: "linkedin.com",
    twitter: "twitter.com",
    portfolio: "albertopfunk.dev",
    summary:
      "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    stripe_subscription_name: "subscription_name_example",
  });

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
