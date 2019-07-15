//* Skills can only be added from here, a user cannot add a new skill
//* If user wants a new skill added, they will have to submit one
//* You can email user if their submitted skill is accepted
//* create a Admin UI so you can add/delete skills & skills_for_review
// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("skills")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("skills")
        .truncate()
        .insert([
          { skill: "RoR" },
          { skill: "Ruby" },
          { skill: "Python" },
          { skill: "Angular" },
          { skill: "MongoDB" },
          { skill: "Java" },
          { skill: "Elixir" },
          { skill: "JavaScript" },
          { skill: "React" },
          { skill: "Node" },
          { skill: "SQL" },
          { skill: "C" },
          { skill: "Vue" },
          { skill: "React Native" },
          { skill: "Swift" },
          { skill: "GraphQL" },
          { skill: "CSS" },
          { skill: "LESS" },
          { skill: "SASS" },
          { skill: "GSAP" },
          { skill: "Sketch" }
        ]);
    });
};
