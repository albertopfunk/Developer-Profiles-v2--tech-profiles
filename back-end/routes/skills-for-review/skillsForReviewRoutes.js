const express = require("express");
const skillsForReviewModel = require("../../models/skills-for-review/skillsForReviewModel");

const server = express.Router();

//----------------------------------------------------------------------
/*
USER SKILLS FOR REVIEW(skills_for_review)
id
skill_for_review
user_id (not nullable)
*/
//----------------------------------------------------------------------

// adds new skill for review
// expects 'skill_for_review' in body
// expects 'user_id' in body
// returns [new skill for review id]
server.post("/new", async (req, res) => {
  if (!req.body.user_id || !req.body.skill_for_review) {
    res
      .status(400)
      .json({ message: "Expected 'user_id' and 'skill_for_review' in body" });
  } else {
    try {
      const addNewSkill = await skillsForReviewModel.insert(req.body);
      res.status(201).json(addNewSkill);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding the skill to the database", err });
    }
  }
});

// get all skills for review
// does not expect anything, returns [skill for review objects]
server.get("/", async (req, res) => {
  try {
    const getAllSkills = await skillsForReviewModel.getAll();
    res.json(getAllSkills);
  } catch (err) {
    res.status(500).json({ message: "The skills could not be retrieved", err });
  }
});

// get single skill for review
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getSingleSkill = await skillsForReviewModel.getSingle(id);
    getSingleSkill
      ? res.json(getSingleSkill)
      : res
          .status(404)
          .json({ message: "The skill with the specified ID does not exist" });
  } catch (err) {
    res.status(500).json({ message: "The skill could not be retrieved", err });
  }
});

// expects id of existing skill for review in params
// returns a number 1 if successful
server.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!req.body.user_id || !req.body.skill_for_review) {
    res
      .status(400)
      .json({ message: "Expected 'user_id' and 'skill_for_review' in body" });
  } else {
    try {
      const editSkill = await skillsForReviewModel.update(id, req.body);
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

// expects id of existing skill for review in params
// returns a number 1 if successful
server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removeSkill = await skillsForReviewModel.remove(id);
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
