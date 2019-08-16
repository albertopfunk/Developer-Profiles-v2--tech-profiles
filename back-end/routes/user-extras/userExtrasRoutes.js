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

// expects user extra, either 'education', 'experience', 'projects' in params
// expects 'user_id' of existing user in body
// returns inserted user extra object
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
      message: `Expected 'projects' or  'education', or 'experience' in parameters, received '${user_extra}'`
    });
  } else if (!user_id) {
    res.status(400).json({ message: "Expected 'user_id' in body" });
  } else {
    try {
      const addNewUserExtra = await userExtrasModel.insert(
        user_extra,
        req.body
      );
      res.status(201).json(addNewUserExtra);
    } catch (err) {
      res.status(500).json({
        message: `Error adding the user's '${user_extra}' to the database`,
        err
      });
    }
  }
});

// expects id of existing user in params
// expects user extra, either 'education', 'experience', 'projects' in params
// returns [user extra objects]
server.get("/:user_id/:user_extra", async (req, res) => {
  const { user_id, user_extra } = req.params;
  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in parameters, received '${user_extra}'`
    });
  } else {
    try {
      const getAllUserExtra = await userExtrasModel.getAll(user_id, user_extra);
      res.json(getAllUserExtra);
    } catch (err) {
      res.status(500).json({
        message: `The user's '${user_extra}' could not be retrieved`,
        err
      });
    }
  }
});

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of existing user extra in params
// returns user extra object
server.get("/single/:user_extra/:user_extra_id", async (req, res) => {
  const { user_extra, user_extra_id } = req.params;

  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in parameters, received '${user_extra}'`
    });
  } else {
    try {
      const getSingleUserExtra = await userExtrasModel.getSingle(
        user_extra,
        user_extra_id
      );
      getSingleUserExtra
        ? res.json(getSingleUserExtra)
        : res.status(404).json({
            message: `The user's '${user_extra}' with the specified ID of '${user_extra_id}' does not exist`
          });
    } catch (err) {
      res.status(500).json({
        message: `The user's '${user_extra}' could not be retrieved`,
        err
      });
    }
  }
});

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of existing user extra in params
// returns updated user extra object if successful
server.put("/:user_extra/:user_extra_id", async (req, res) => {
  const { user_extra, user_extra_id } = req.params;
  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in parameters, received '${user_extra}'`
    });
  } else {
    try {
      const editUser = await userExtrasModel.update(
        user_extra,
        user_extra_id,
        req.body
      );
      editUser
        ? res.json(editUser)
        : res.status(404).json({
            message: `The user's '${user_extra}' with the specified ID of '${user_extra_id}' does not exist`
          });
    } catch (err) {
      res.status(500).json({
        message: `The user's '${user_extra}' could not be modified`,
        err
      });
    }
  }
});

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of existing user extra in params
// returns a number 1 if successful
server.delete("/:user_extra/:user_extra_id", async (req, res) => {
  const { user_extra, user_extra_id } = req.params;
  if (
    !user_extra ||
    (user_extra !== "projects" &&
      user_extra !== "education" &&
      user_extra !== "experience")
  ) {
    res.status(400).json({
      message: `Expected 'projects' or  'education', or 'experience' in parameters, received '${user_extra}'`
    });
  } else {
    try {
      const removeUser = await userExtrasModel.remove(
        user_extra,
        user_extra_id
      );
      removeUser
        ? res.json(removeUser)
        : res.status(404).json({
            message: `The user's '${user_extra}' with the specified ID of '${user_extra_id}' does not exist`
          });
    } catch (err) {
      res.status(500).json({
        message: `The user's '${user_extra}' could not be removed`,
        err
      });
    }
  }
});

module.exports = server;
