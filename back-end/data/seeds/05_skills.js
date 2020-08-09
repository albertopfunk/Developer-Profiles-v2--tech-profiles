//* Skills can only be added from here, a user cannot add a new skill
//* If user wants a new skill added, they will have to submit one
//* You can email user if their submitted skill is accepted
//* create a Admin UI so you can add/delete skills & skills_for_review
// eslint-disable-next-line
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("skills")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("skills")
        .truncate()
        .insert([
          { skill: "Ruby" },
          { skill: "Python" },
          { skill: "Angular" },
          { skill: "MongoDB" },
          { skill: "Java" },
          { skill: "Elixir" },
          { skill: "JavaScript" },
          { skill: "Front-End" },
          { skill: "Back-End" },
          { skill: "Web Performance" },
          { skill: "React" },
          { skill: "NextJS" },
          { skill: "Gatsby" },
          { skill: "Node" },
          { skill: "SQL" },
          { skill: "Auth0" },
          { skill: "Stripe" },
          { skill: "C" },
          { skill: "Vue" },
          { skill: "Testing" },
          { skill: "Accessibility" },
          { skill: "Security" },
          { skill: "Systems Design" },
          { skill: "Web Development" },
          { skill: "React Native" },
          { skill: "Swift" },
          { skill: "GraphQL" },
          { skill: "CSS" },
          { skill: "LESS" },
          { skill: "SASS" },
          { skill: "GSAP" },
          { skill: "UX" },
          { skill: "UI" },
          { skill: "Sketch" },
        ]);
    });
};
