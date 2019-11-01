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

// expects 'skill' in body
// returns inserted skill object
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

// does not expect anything
// returns [skill objects]
server.get("/", async (req, res) => {
  try {
    const getAllSkills = await skillsModel.getAll();
    res.json(getAllSkills);
  } catch (err) {
    res.status(500).json({ message: "The skills could not be retrieved", err });
  }
});

// expects input
// returns skill predictions based on input
server.post("/autocomplete", async (req, res) => {
  const { skillsInput } = req.body;
  try {
    const getAllSkills = await skillsModel.getAllFiltered(skillsInput);
    if (getAllSkills.length > 10) {
      let splitSkills = getAllSkills.slice(0, 10);
      res.json(splitSkills);
    }
    res.json(getAllSkills);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The skill predictions could not be retrieved", err });
  }
});

// expects id of existing skill in params
// returns skill object
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getSingleSkill = await skillsModel.getSingle(id);
    getSingleSkill
      ? res.json(getSingleSkill)
      : res.status(404).json({
          message: `The skill with the specified ID of '${id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "The skill could not be retrieved", err });
  }
});

// expects id of existing skill in params
// expects 'skill' in req.body
// returns a number 1 if successful
server.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!req.body.skill) {
    res.status(400).json({ message: "Expected 'skill' in body" });
  } else {
    try {
      const editSkill = await skillsModel.update(id, req.body);
      editSkill
        ? res.json(editSkill)
        : res.status(404).json({
            message: `The skill with the specified ID of '${id}' does not exist`
          });
    } catch (err) {
      res
        .status(500)
        .json({ message: "The skill information could not be modified", err });
    }
  }
});

// expects id of existing skill in params
// returns a number 1 if successful
server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removeSkill = await skillsModel.remove(id);
    removeSkill
      ? res.json(removeSkill)
      : res.status(404).json({
          message: `The skill with the specified ID of '${id}' does not exist`
        });
  } catch (err) {
    res
      .status(500)
      .json({ message: "The skill information could not be removed", err });
  }
});

module.exports = server;
