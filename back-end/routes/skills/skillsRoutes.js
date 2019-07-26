const express = require("express");
const skillsModel = require("../../models/skills/skillsModel");

const server = express.Router();

//----------------------------------------------------------------------
/*
USER SKILLS(skills)
id
skill
*/
//----------------------------------------------------------------------

// adds new skill
// expects 'skill' in body
// returns [new skill id]
server.post("/new", async (req, res) => {
  if (!req.body.skill) {
    res.status(400).json({ message: "Expected 'skill' in body" });
  } else {
    try {
      const addNewSkill = await skillsModel.insert(req.body);
      res.status(201).json(addNewSkill);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding the skill to the database", err });
    }
  }
});

// get all skills
// does not expect anything, returns [skill objects]
server.get("/", async (req, res) => {
  try {
    const getAllSkills = await skillsModel.getAll();
    res.json(getAllSkills);
  } catch (err) {
    res.status(500).json({ message: "The skills could not be retrieved", err });
  }
});

// get single skill
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getSingleSkill = await skillsModel.getSingle(id);
    getSingleSkill
      ? res.json(getSingleSkill)
      : res
          .status(404)
          .json({ message: "The skill with the specified ID does not exist" });
  } catch (err) {
    res.status(500).json({ message: "The skill could not be retrieved", err });
  }
});

// expects id of existing skill in params
// returns a number 1 if successful
// server.put("/:skill_id", (req, res) => {

//   const { skill_id } = req.params;

//   db("skills")
//     .where({ id: skill_id })
//     .update(req.body)

//     .then(isSuccessful => {

//       isSuccessful === 0
//         ? res
//             .status(400)
//             .json({ message: "Error editing skill, check skill id" })
//         : res.status(200).json(isSuccessful);
//     })

//     .catch(err => {
//       res.status(500).json({ message: "error editing skill data", err: err });
//     });
// });

// expects id of existing skill in params
// returns a number 1 if successful
// server.delete("/:skill_id", (req, res) => {

//   const { skill_id } = req.params;

//   db("skills")
//     .where({ id: skill_id })
//     .delete()

//     .then(isSuccessful => {

//       isSuccessful === 0
//         ? res
//             .status(400)
//             .json({ message: "Error deleting skill, check skill id" })
//         : res.status(200).json(isSuccessful);
//     })

//     .catch(err => {
//       res.status(500).json({ message: "error deleting skill data", err: err });
//     });
// });

module.exports = server;
