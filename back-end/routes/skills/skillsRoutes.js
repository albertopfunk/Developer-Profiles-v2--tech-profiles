const express = require("express");
const skillsModel = require("../../models/skills/skillsModel");

const server = express.Router();

server.post("/new", async (req, res) => {
  if (!req.body.skill) {
    res.status(400).json({
      message: `Expected 'skill' in body, received '${req.body.skill}'`
    });
    return;
  }

  try {
    const addNewSkill = await skillsModel.insert(req.body);
    res.status(201).json(addNewSkill);
  } catch (err) {
    res.status(500).json({ message: "Error adding skill to database" });
  }
});

server.post("/new-user-skill", async (req, res) => {
  if (!Array.isArray(req.body.skill_ids)) {
    res.status(400).json({
      message: `Expected 'skill_ids' array in body, received '${req.body.skill_ids}'`
    });
    return;
  }

  if (!req.body.user_id) {
    res.status(400).json({
      message: `Expected 'user_id' in body, received '${req.body.user_id}'`
    });
    return;
  }

  if (
    !req.body.type ||
    (req.body.type !== "user_top_skills" &&
      req.body.type !== "user_additional_skills")
  ) {
    res.status(400).json({
      message: `Expected 'type' to be 'user_top_skills' or 'user_additional_skills' in body, received '${req.body.type}'`
    });
    return;
  }

  try {
    const addNewUserSkill = await skillsModel.insertUserSkill(req.body);
    addNewUserSkill
      ? res.status(201).json(addNewUserSkill)
      : res.status(404).json({
          message: `User with the specified ID of '${req.body.user_id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error adding user-skill to database" });
  }
});

server.get("/", async (_, res) => {
  try {
    const getAllSkills = await skillsModel.getAll();
    res.status(200).json(getAllSkills);
  } catch (err) {
    res.status(500).json({ message: "Error getting skills from database" });
  }
});

server.post("/autocomplete", async (req, res) => {
  if (!req.body.value) {
    res.status(400).json({
      message: `Expected 'value' in body, received '${req.body.value}'`
    });
    return;
  }

  try {
    let predictions = await skillsModel.getAllFiltered(req.body.value);

    if (predictions.length > 5) {
      predictions = predictions.slice(0, 5);
    }

    predictions = predictions.map(prediction => {
      return {
        name: prediction.skill,
        id: prediction.id
      };
    });

    res.status(200).json(predictions);
  } catch (err) {
    res.status(500).json({ message: "Error getting skill predictions" });
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
    const getSingleSkill = await skillsModel.getSingle(req.params.id);
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

  if (!req.body.skill) {
    res.status(400).json({
      message: `Expected 'skill' in body, received '${req.body.skill}'`
    });
    return;
  }

  try {
    const editSkill = await skillsModel.update(req.params.id, req.body);
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
    const removeSkill = await skillsModel.remove(req.params.id);
    removeSkill
      ? res.status(200).json(removeSkill)
      : res.status(404).json({
          message: `The skill with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error removing skill" });
  }
});

server.post("/delete-user-skills", async (req, res) => {
  if (!req.body.user_id) {
    res.status(400).json({
      message: `Expected 'user_id' in body, received '${req.body.user_id}'`
    });
    return;
  }

  if (
    !req.body.type ||
    (req.body.type !== "user_top_skills" &&
      req.body.type !== "user_additional_skills")
  ) {
    res.status(400).json({
      message: `Expected 'type' to be 'user_top_skills' or 'user_additional_skills' in body, received '${req.body.type}'`
    });
    return;
  }

  try {
    const removeUserSkill = await skillsModel.removeUserSkills(
      req.body.user_id,
      req.body.type
    );
    res.status(200).json(removeUserSkill);
  } catch (err) {
    res.status(500).json({ message: "Error removing user-skill" });
  }
});

server.post("/delete-user-skill", async (req, res) => {
  if (!req.body.skill_id) {
    res.status(400).json({
      message: `Expected 'skill_id' in body, received '${req.body.skill_id}'`
    });
    return;
  }

  if (!req.body.user_id) {
    res.status(400).json({
      message: `Expected 'user_id' in body, received '${req.body.user_id}'`
    });
    return;
  }

  if (
    !req.body.type ||
    (req.body.type !== "user_top_skills" &&
      req.body.type !== "user_additional_skills")
  ) {
    res.status(400).json({
      message: `Expected 'type' to be 'user_top_skills' or 'user_additional_skills' in body, received '${req.body.type}'`
    });
    return;
  }

  try {
    const removeUserSkill = await skillsModel.removeUserSkill(
      req.body.user_id,
      req.body.skill_id,
      req.body.type
    );
    res.status(200).json(removeUserSkill);
  } catch (err) {
    res.status(500).json({ message: "Error removing user-skill" });
  }
});

module.exports = server;
