const express = require("express");
const userModel = require("../../models/user/userModel");
const NodeCache = require("node-cache");

const server = express.Router();
const usersCache = new NodeCache({ stdTTL: 21500, checkperiod: 22000 });

server.post("/new", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      message: `Expected 'email' in body, received '${req.body.email}'`,
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
    const cachedUsersSuccess = usersCache.set("users", users);
    if (cachedUsersSuccess) {
      const slicedUsers = users.slice(0, 25);
      res.status(200).json({ users: slicedUsers, len: users.length });
    } else {
      res.status(500).json({ message: "Error adding users to cache" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting users from database" });
  }
});

server.get("/load-more/:page", async (req, res) => {
  if (!req.params.page) {
    res.status(400).json({
      message: `Expected 'page' in params, received '${req.params.page}'`,
    });
    return;
  }

  let end = 25 * +req.params.page;
  let start = end - 25;
  const cachedUsers = usersCache.get("users", true);

  if (!cachedUsers) {
    res.status(500).json({ message: "Error getting users from cache" });
    return;
  }

  const slicedUsers = cachedUsers.slice(start, end);
  res.status(200).json(slicedUsers);
});

server.post("/filtered", async (req, res) => {
  try {
    const users = await userModel.getAllFiltered(req.body);
    const cachedUsersSuccess = usersCache.set("users", users);
    if (cachedUsersSuccess) {
      const slicedUsers = users.slice(0, 25);
      res.status(200).json({ users: slicedUsers, len: users.length });
    } else {
      res.status(500).json({ message: "Error adding users to cache" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting users from database" });
  }
});

server.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`,
    });
    return;
  }

  try {
    const getSingleUser = await userModel.getSingle(req.params.id);
    getSingleUser
      ? res.status(200).json(getSingleUser)
      : res.status(404).json({
          message: `User with the specified ID of '${req.params.id}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({ message: "Error getting user from database" });
  }
});

server.post("/get-single", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      message: `Expected 'email' in body, received '${req.body.email}'`,
    });
    return;
  }

  try {
    const getSingleUser = await userModel.getSingleByEmail(req.body.email);
    getSingleUser
      ? res.status(200).json(getSingleUser)
      : res.status(404).json({
          message: `User with the specified email ID of '${req.body.email}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({ message: "Error getting user from database" });
  }
});

server.get("/get-extras/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`,
    });
    return;
  }

  try {
    const getUserExtras = await userModel.getUserExtras(req.params.id);
    res.status(200).json(getUserExtras);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting user extras from database" });
  }
});

server.post("/get-full", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      message: `Expected 'email' in body, received '${req.body.email}'`,
    });
    return;
  }

  try {
    const getFullUser = await userModel.getFullUser(req.body.email);
    res.status(200).json(getFullUser);
  } catch (err) {
    res.status(500).json({ message: "Error getting full user from database" });
  }
});

server.put("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`,
    });
    return;
  }
  try {
    const editUser = await userModel.update(req.params.id, req.body);
    editUser
      ? res.status(200).json(editUser)
      : res.status(404).json({
          message: `User with the specified ID of '${req.params.id}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

server.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      message: `Expected 'id' in params, received '${req.params.id}'`,
    });
    return;
  }
  try {
    const removeUser = await userModel.remove(req.params.id);
    removeUser
      ? res.status(200).json(removeUser)
      : res.status(404).json({
          message: `User with the specified ID of '${req.params.id}' does not exist`,
        });
  } catch (err) {
    res.status(500).json({ message: "Error removing user" });
  }
});

module.exports = server;
