/*eslint no-console: ["error", { allow: ["error"] }] */
const express = require("express");
const userModel = require("../../models/user/userModel");

const server = express.Router();

//----------------------------------------------------------------------
/*
    USERS(users)
    id
    email
    public_email
    first_name
    last_name
    image
    desired_title
    area_of_work
    current_location_name
    current_location_lat
    current_location_lon
    interested_location_names
    github
    linkedin
    portfolio
    badge
    badgeURL
    summary
    stripe_customer_id
    stripe_subscription_name
    top_skills
    additional_skills
    familiar_skills

*/
//----------------------------------------------------------------------

// does not expect anything
// checks for existing user by email(authO free plan creates doubles) or id
// returns inserted user object
server.post("/new", async (req, res) => {
  let id = 0;
  if (req.body.email) {
    id = req.body.email;
  } else if (req.body.id) {
    id = req.body.id;
  }

  const checkIfUserExists = await userModel.getSingle(id);
  if (checkIfUserExists) {
    res.json(checkIfUserExists);
  } else {
    try {
      const addNewUser = await userModel.insert(req.body);
      res.status(201).json(addNewUser);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding the user to the database", err });
    }
  }
});

// does not expect anything
// returns 14 [user objects]
server.get("/", async (req, res) => {
  try {
    const users = await userModel.getAll();
    slicedUsers = users.slice(0, 14);
    res.json(slicedUsers);
  } catch (err) {
    res.status(500).json({ message: "The users could not be retrieved", err });
  }
});

// create a catch to store and splice users for infinite scroll
// only replace when filters change or refresh
// for now request all users and splice based on page
server.post("/infinite/:usersPage", async (req, res) => {
  let start = 0;
  let end = 14;

  const { usersPage } = req.params;

  for (let i = 1; i < usersPage; i++) {
    start += 14;
    end += 14;
  }

  try {
    const users = await userModel.getAllFiltered(req.body);
    slicedUsers = users.slice(start, end);
    res.json(slicedUsers);
  } catch (err) {
    res.status(500).json({ message: "The users could not be retrieved", err });
  }
});

// expects id of existing user in params
// returns user object
server.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getSingleUser = await userModel.getSingle(id);
    getSingleUser
      ? res.json(getSingleUser)
      : res.status(404).json({
          message: `The user with the specified ID of '${id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "The user could not be retrieved", err });
  }
});

// expects id of existing user in params
// returns a number 1 if successful
server.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const editUser = await userModel.update(id, req.body);
    editUser
      ? res.json(editUser)
      : res.status(404).json({
          message: `The user with the specified ID of '${id}' does not exist`
        });
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user information could not be modified", err });
  }
});

// expects id of existing user in params
// returns a number 1 if successful
server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removeUser = await userModel.remove(id);
    removeUser
      ? res.json(removeUser)
      : res.status(404).json({
          message: `The user with the specified ID of '${id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "The user could not be removed", err });
  }
});

module.exports = server;
