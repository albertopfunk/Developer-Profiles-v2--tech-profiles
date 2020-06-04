const express = require("express");
const skillsForReviewModel = require("../../models/skills-for-review/skillsForReviewModel");

const server = express.Router();

server.post("/new", async (req, res) => {
  if (!req.body.skill_for_review) {
    res.status(400).json({
      message: `Expected 'skill_for_review' in body, received '${req.body.skill_for_review}'`
    });
    return;
  }

  if (!req.body.user_id) {
    res.status(400).json({
      message: `Expected 'user_id' in body, received '${req.body.user_id}'`
    });
    return;
  }

  try {
    const addNewSkill = await skillsForReviewModel.insert(req.body);
    res.status(201).json(addNewSkill);
  } catch (err) {
    res.status(500).json({ message: "Error adding skill to database" });
  }
});

server.get("/", async (req, res) => {
  try {
    const getAllSkills = await skillsForReviewModel.getAll();
    res.status(200).json(getAllSkills);
  } catch (err) {
    res.status(500).json({ message: "Error getting skills from database" });
  }
});

server.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`
    });
    return;
  }

  try {
    const getSingleSkill = await skillsForReviewModel.getSingle(req.params.id);
    getSingleSkill
      ? res.status(200).json(getSingleSkill)
      : res.status(404).json({
          message: `The skill with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error getting skill from database" });
  }
});

server.put("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`
    });
    return;
  }

  if (!req.body.skill_for_review) {
    res.status(400).json({
      message: `Expected 'skill_for_review' in body, received '${req.body.skill_for_review}'`
    });
    return;
  }

  try {
    const editSkill = await skillsForReviewModel.update(
      req.params.id,
      req.body
    );
    editSkill
      ? res.status(200).json(editSkill)
      : res.status(404).json({
          message: `The skill with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error updating skill" });
  }
});

server.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`
    });
    return;
  }

  try {
    const removeSkill = await skillsForReviewModel.remove(req.params.id);
    removeSkill
      ? res.status(200).json(removeSkill)
      : res.status(404).json({
          message: `The skill with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error removing skill" });
  }
});

module.exports = server;
