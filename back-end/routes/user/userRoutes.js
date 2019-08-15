const express = require("express");
const NodeCache = require("node-cache");
const userModel = require("../../models/user/userModel");

const server = express.Router();
const infinityCache = new NodeCache({ stdTTL: 21500, checkperiod: 22000 });

// middleware
const getUsersFromCache = (req, res, next) => {
  let start = 0;
  let end = 14;
  const { infinite } = req.body;
  const { usersPage } = req.params;

  for (let i = 1; i < usersPage; i++) {
    start += 14;
    end += 14;
  }

  if (infinite === "infinite") {
    try {
      const cachedUsers = infinityCache.get("users", true);
      const slicedUsers = cachedUsers.slice(start, end);
      res.json(slicedUsers);
    } catch (err) {
      next();
    }
  } else {
    next();
  }
};

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
    cachedUsersSuccess = infinityCache.set("users", users);
    if (cachedUsersSuccess) {
      const slicedUsers = users.slice(0, 14);
      res.json(slicedUsers);
    } else {
      res.status(500).json({ message: "error setting users to cache" });
    }
  } catch (err) {
    res.status(500).json({ message: "The users could not be retrieved", err });
  }
});


// uses middleware cache for users
// requires usersPage param
// requires filter options on req.body
server.post("/infinite/:usersPage", getUsersFromCache, async (req, res) => {
  let start = 0;
  let end = 14;

  const { usersPage } = req.params;

  for (let i = 1; i < usersPage; i++) {
    start += 14;
    end += 14;
  }

  try {
    const users = await userModel.getAllFiltered(req.body);
    cachedUsersSuccess = infinityCache.set("users", users);
    if (cachedUsersSuccess) {
      slicedUsers = users.slice(start, end);
      res.json(slicedUsers);
    } else {
      res.status(500).json({ message: "error setting users and/or filters to cache" });
    }
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
