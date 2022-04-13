const faker = require("faker");

exports.seed = function (knex) {
  return knex("projects")
    .del()
    .then(async function () {
      for (let i = 0; i < 50; i++) {
        let projectArr = [];
        let multiplier = 50 * i;
        let start = 1 + multiplier;
        let end = 50 + multiplier;

        for (let j = start; j <= end; j++) {
          let randomNumber = Math.floor(Math.random() * 4);
          let randomImageNumber = Math.floor(Math.random() * (14 - 1) + 1);

          for (let k = 0; k < randomNumber; k++) {
            projectArr.push({
              user_id: j,
              project_img: `https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,w_275/v1621132770/tech-pros-v1-main/examples/project-image-${randomImageNumber}.jpg`,
              project_title: faker.company.companyName(),
              link: "https://albertopfunk.dev",
              project_description:
                "245char Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            });
          }
        }
        await knex("projects").insert(projectArr);
      }
    });
};
