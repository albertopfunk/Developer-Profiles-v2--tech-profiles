const express = require("express");
const userModel = require("../../models/user/userModel");
const NodeCache = require("node-cache");

const server = express.Router();

const usersCache = new NodeCache({ stdTTL: 21500, checkperiod: 22000 });

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
    summary
    stripe_customer_id
    stripe_subscription_name
    top_skills
    additional_skills

    clicks_to_expand
    clicks_to_view_profile
    profile_views


    // ----------------- //
    Possible Other User
    name
    email
    favorite_profiles
    viewed_profiles
    expanded_profiles
    current_location_name
    current_location_lat
    current_location_lon
    interested_skills
    interested areas of work
    
*/
//----------------------------------------------------------------------

server.post("/new", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      message: `Expected 'email' in body, received '${req.body.email}'`
    });
    return;
  }

  const doesUserExist = await userModel.getSingleByEmail(req.body.email);
  if (doesUserExist) {
    res.status(200).json(doesUserExist);
  } else {
    try {
      const addNewUser = await userModel.insert(req.body);
      res.status(201).json(addNewUser);
    } catch (err) {
      res.status(500).json({ message: "Error adding user to database" });
    }
  }
});

server.get("/", async (_, res) => {
  try {
    const users = await userModel.getAll();
    cachedUsersSuccess = usersCache.set("users", users);
    if (cachedUsersSuccess) {
      const slicedUsers = users.slice(0, 14);
      res.status(200).json({ users: slicedUsers, len: users.length });
    } else {
      res.status(500).json({ message: "Error adding users to cache" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error getting users from database" });
  }
});

server.get("/load-more/:page", async (req, res) => {
  if (!req.params.page) {
    res.status(400).json({
      message: `Expected 'page' in params, received '${req.params.page}'`
    });
    return;
  }

  let end = 14 * +req.params.page;
  let start = end - 14;
  const cachedUsers = usersCache.get("users", true);

  if (!cachedUsers) {
    res.status(500).json({ message: "Error getting users from cache" });
    return;
  }

  const slicedUsers = cachedUsers.slice(start, end);
  res.status(200).json(slicedUsers);
});

server.post("/filtered", async (req, res) => {
  if (!req.body.page) {
    res.status(400).json({
      message: `Expected 'page' in body, received '${req.body.page}'`
    });
    return;
  }

  let end = 14 * req.body.page;
  let start = end - 14;

  try {
    const users = await userModel.getAllFiltered(req.body);
    cachedUsersSuccess = usersCache.set("users", users);
    if (cachedUsersSuccess) {
      slicedUsers = users.slice(start, end);
      res.status(200).json({ users: slicedUsers, len: users.length });
    } else {
      res.status(500).json({ message: "Error adding users to cache" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error getting users from database" });
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
    const getSingleUser = await userModel.getSingle(req.params.id);
    getSingleUser
      ? res.status(200).json(getSingleUser)
      : res.status(404).json({
          message: `User with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error getting user from database" });
  }
});

server.post("/get-single", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      message: `Expected 'email' in body, received '${req.body.email}'`
    });
    return;
  }

  try {
    const getSingleUser = await userModel.getSingleByEmail(req.body.email);
    getSingleUser
      ? res.status(200).json(getSingleUser)
      : res.status(404).json({
          message: `User with the specified ID of '${id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error getting user from database" });
  }
});

server.put("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`
    });
    return;
  }
  try {
    const editUser = await userModel.update(req.params.id, req.body);
    editUser
      ? res.status(200).json(editUser)
      : res.status(404).json({
          message: `User with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
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
    const removeUser = await userModel.remove(req.params.id);
    removeUser
      ? res.status(200).json(removeUser)
      : res.status(404).json({
          message: `User with the specified ID of '${req.params.id}' does not exist`
        });
  } catch (err) {
    res.status(500).json({ message: "Error removing user" });
  }
});

module.exports = server;
