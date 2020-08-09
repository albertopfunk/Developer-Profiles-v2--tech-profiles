const express = require("express");
const userExtrasModel = require("../../models/user-extras/userExtrasModel");

const server = express.Router();

//----------------------------------------------------------------------
/*
    USER EXTRAS
      education - id, school, school_dates, field_of_study, *user_id (not nullable)
      
      experience - id, company_name, job_title, job_dates, job_description, *user_id (not nullable)
      
      projects - id, project_title, link, project_description, project_img, *user_id (not nullable)
*/
//----------------------------------------------------------------------

server.post("/new/:user_extra", async (req, res) => {
  const { user_extra } = req.params;
  const { user_id } = req.body;

  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in params, received '${user_extra}'`,
    });
    return;
  }

  if (!user_id) {
    res
      .status(400)
      .json({ message: `Expected 'user_id' in body, received '${user_id}'` });
    return;
  }

  try {
    const addNewUserExtra = await userExtrasModel.insert(user_extra, req.body);
    res.status(201).json(addNewUserExtra);
  } catch (err) {
    res.status(500).json({
      message: `Error adding user's '${user_extra}' to database`,
    });
  }
});

server.get("/:user_id/:user_extra", async (req, res) => {
  const { user_id, user_extra } = req.params;

  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in params, received '${user_extra}'`,
    });
    return;
  }

  if (!user_id) {
    res
      .status(400)
      .json({ message: `Expected 'user_id' in params, received '${user_id}'` });
    return;
  }

  try {
    const getAllUserExtra = await userExtrasModel.getAll(user_id, user_extra);
    res.status(200).json(getAllUserExtra);
  } catch (err) {
    res.status(500).json({
      message: `Error getting user's '${user_extra}'`,
    });
  }
});

server.get("/single/:user_extra/:user_extra_id", async (req, res) => {
  const { user_extra, user_extra_id } = req.params;

  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in params, received '${user_extra}'`,
    });
    return;
  }

  if (!user_extra_id) {
    res.status(400).json({
      message: `Expected 'user_extra_id' in params, received '${user_extra_id}'`,
    });
    return;
  }

  try {
    const getSingleUserExtra = await userExtrasModel.getSingle(
      user_extra,
      user_extra_id
    );
    getSingleUserExtra
      ? res.status(200).json(getSingleUserExtra)
      : res.status(404).json({
          message: `User's '${user_extra}' with the specified ID of '${user_extra_id}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({
      message: `Error getting user's '${user_extra}'`,
    });
  }
});

server.put("/:user_extra/:user_extra_id", async (req, res) => {
  const { user_extra, user_extra_id } = req.params;
  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in params, received '${user_extra}'`,
    });
    return;
  }

  if (!user_extra_id) {
    res.status(400).json({
      message: `Expected 'user_extra_id' in params, received '${user_extra_id}'`,
    });
    return;
  }

  try {
    const editExtra = await userExtrasModel.update(
      user_extra,
      user_extra_id,
      req.body
    );
    editExtra
      ? res.status(200).json(editExtra)
      : res.status(404).json({
          message: `User's '${user_extra}' with the specified ID of '${user_extra_id}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({
      message: `Error updating user's '${user_extra}'`,
    });
  }
});

server.delete("/:user_extra/:user_extra_id", async (req, res) => {
  const { user_extra, user_extra_id } = req.params;

  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in params, received '${user_extra}'`,
    });
    return;
  }

  if (!user_extra_id) {
    res.status(400).json({
      message: `Expected 'user_extra_id' in params, received '${user_extra_id}'`,
    });
    return;
  }

  try {
    const removeExtra = await userExtrasModel.remove(user_extra, user_extra_id);
    removeExtra
      ? res.status(200).json(removeExtra)
      : res.status(404).json({
          message: `User's '${user_extra}' with the specified ID of '${user_extra_id}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({
      message: `Error removing user's '${user_extra}'`,
    });
  }
});

module.exports = server;
