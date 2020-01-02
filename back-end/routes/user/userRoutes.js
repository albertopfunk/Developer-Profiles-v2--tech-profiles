const express = require("express");
const userMiddleware = require("../../helpers/middleware/user");
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
    badge - might deprecate
    badgeURL - might deprecate
    summary
    stripe_customer_id
    stripe_subscription_name
    top_skills
    additional_skills
    familiar_skills - might deprecate

    years_of_related_work_experience
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

// does not expect anything
// checks for existing user by email(authO free plan creates doubles)
// returns inserted user object
server.post("/new", async (req, res) => {
  const { email } = req.body;

  const doesUserExist = await userModel.getSingleByEmail(email);
  if (doesUserExist) {
    res.status(200).json(doesUserExist);
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

// uses middleware to cache initial users
// does not expect anything
// returns 14 [user objects]
server.get("/", async (req, res) => {
  try {
    const users = await userModel.getAll();
    console.log("INIT", users.length);
    cachedUsersSuccess = userMiddleware.setToCache(users);
    if (cachedUsersSuccess) {
      const slicedUsers = users.slice(0, 14);
      res.json(slicedUsers);
    } else {
      res.status(500).json({ message: "error setting initial users to cache" });
    }
  } catch (err) {
    res.status(500).json({ message: "The users could not be retrieved", err });
  }
});

// uses middleware to authenticate data and uses a cache for users
// requires ALL filter options on req.query(params), that includes isUsinginfinite and usersPage
// ALL data should be present with the correct data type
// returns 14 [user objects]
server.post(
  "/infinite",
  userMiddleware.validateFilterOptions,
  userMiddleware.getUsersFromCache,
  async (req, res) => {
    let start = 0;
    let end = 14;

    const { usersPage } = req.body;

    for (let i = 1; i < usersPage; i++) {
      start += 14;
      end += 14;
    }

    try {
      const users = await userModel.getAllFiltered(req.body);
      console.log("/INFINITE", users.length);
      cachedUsersSuccess = userMiddleware.setToCache(users);
      if (cachedUsersSuccess) {
        slicedUsers = users.slice(start, end);
        res.json(slicedUsers);
      } else {
        res.status(500).json({ message: "error setting users to cache" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "The users could not be retrieved", err });
    }
  }
);

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

// expects email of user in body
// returns user object
server.post("/get-single", async (req, res) => {
  const { email } = req.body;
  try {
    const getSingleUser = await userModel.getSingleByEmail(email);
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
// authorization for updates? like user ID
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
// authorization for deletes? like user ID
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
