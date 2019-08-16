const express = require("express");
const NodeCache = require("node-cache");
const userModel = require("../../models/user/userModel");

const server = express.Router();
const infinityCache = new NodeCache({ stdTTL: 21500, checkperiod: 22000 });

// middleware

const validateInfinityOptions = (req, res, next) => {
  let stopRunning = false;
  function returnFail(variableMissing) {
    stopRunning = true;
    return res.status(400).json({
      message: `Expected '${variableMissing} but recevied 'null', 'undefined', or the incorrect data type'`
    });
  }

  // they should ALL be strings, can't be null or undefined
  let {
    usersPage,
    infinite,
    isWebDevChecked,
    isUIUXChecked,
    isIOSChecked,
    isAndroidChecked,
    isUsingCurrLocationFilter,
    selectedWithinMiles,
    chosenLocationLat,
    chosenLocationLon,
    isUsingRelocateToFilter,
    chosenRelocateTo,
    isUsingSortByChoice,
    sortByChoice
  } = req.query;

  // normalize or reject
  if (typeof usersPage === "string") {
    usersPage = +usersPage;
    Number.isNaN(usersPage) ? returnFail("num:usersPage") : null;
  } else {
    returnFail("num:usersPage");
  }

  if (typeof infinite === "string") {
    if (infinite === "true" || infinite === "false") {
      infinite = infinite === "true";
    } else {
      returnFail("bool:infinite");
    }
  } else {
    returnFail("bool:infinite");
  }

  if (typeof isWebDevChecked === "string") {
    if (isWebDevChecked === "true" || isWebDevChecked === "false") {
      isWebDevChecked = isWebDevChecked === "true";
    } else {
      returnFail("bool:isWebDevChecked");
    }
  } else {
    returnFail("bool:isWebDevChecked");
  }

  if (typeof isUIUXChecked === "string") {
    if (isUIUXChecked === "true" || isUIUXChecked === "false") {
      isUIUXChecked = isUIUXChecked === "true";
    } else {
      returnFail("bool:isUIUXChecked");
    }
  } else {
    returnFail("bool:isUIUXChecked");
  }

  if (typeof isIOSChecked === "string") {
    if (isIOSChecked === "true" || isIOSChecked === "false") {
      isIOSChecked = isIOSChecked === "true";
    } else {
      returnFail("bool:isIOSChecked");
    }
  } else {
    returnFail("bool:isIOSChecked");
  }

  if (typeof isAndroidChecked === "string") {
    if (isAndroidChecked === "true" || isAndroidChecked === "false") {
      isAndroidChecked = isAndroidChecked === "true";
    } else {
      returnFail("bool:isAndroidChecked");
    }
  } else {
    returnFail("bool:isAndroidChecked");
  }

  if (typeof isUsingCurrLocationFilter === "string") {
    if (
      isUsingCurrLocationFilter === "true" ||
      isUsingCurrLocationFilter === "false"
    ) {
      isUsingCurrLocationFilter = isUsingCurrLocationFilter === "true";
    } else {
      returnFail("bool:isUsingCurrLocationFilter");
    }
  } else {
    returnFail("bool:isUsingCurrLocationFilter");
  }

  if (isUsingCurrLocationFilter) {
    if (typeof selectedWithinMiles === "string") {
      selectedWithinMiles = +selectedWithinMiles;
      Number.isNaN(selectedWithinMiles)
        ? returnFail("num:selectedWithinMiles")
        : null;
    } else {
      returnFail("num:selectedWithinMiles");
    }

    if (typeof chosenLocationLat === "string") {
      chosenLocationLat = +chosenLocationLat;
      Number.isNaN(chosenLocationLat)
        ? returnFail("num:chosenLocationLat")
        : null;
    } else {
      returnFail("num:chosenLocationLat");
    }

    if (typeof chosenLocationLon === "string") {
      chosenLocationLon = +chosenLocationLon;
      Number.isNaN(chosenLocationLon)
        ? returnFail("num:chosenLocationLon")
        : null;
    } else {
      returnFail("num:chosenLocationLon");
    }
  }

  if (typeof isUsingRelocateToFilter === "string") {
    typeof chosenRelocateTo === "string"
      ? null
      : returnFail("str:chosenRelocateTo");
    if (
      isUsingRelocateToFilter === "true" ||
      isUsingRelocateToFilter === "false"
    ) {
      isUsingRelocateToFilter = isUsingRelocateToFilter === "true";
    } else {
      returnFail("bool:isUsingRelocateToFilter");
    }
  } else {
    returnFail("bool:isUsingRelocateToFilter");
  }

  if (typeof isUsingSortByChoice === "string") {
    typeof sortByChoice === "string" ? null : returnFail("str:sortByChoice");
    if (isUsingSortByChoice === "true" || isUsingSortByChoice === "false") {
      isUsingSortByChoice = isUsingSortByChoice === "true";
    } else {
      returnFail("bool:isUsingSortByChoice");
    }
  } else {
    returnFail("bool:isUsingSortByChoice");
  }

  req.query = {
    usersPage,
    infinite,
    isWebDevChecked,
    isUIUXChecked,
    isIOSChecked,
    isAndroidChecked,
    isUsingCurrLocationFilter,
    selectedWithinMiles,
    chosenLocationLat,
    chosenLocationLon,
    isUsingRelocateToFilter,
    chosenRelocateTo,
    isUsingSortByChoice,
    sortByChoice
  };

  // unhandled promise rejection if this condition is not present
  if (stopRunning) {
    return;
  } else {
    next();
  }
};

const getUsersFromCache = (req, res, next) => {
  let start = 0;
  let end = 14;

  const { usersPage, infinite } = req.query;

  for (let i = 1; i < usersPage; i++) {
    start += 14;
    end += 14;
  }

  if (infinite) {
    try {
      const cachedUsers = infinityCache.get("users", true);
      console.log(cachedUsers.length);
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
    console.log(users.length);
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
// requires usersPage and filter options on req.query
// maybe add validation middleware?
server.get(
  "/infinite",
  validateInfinityOptions,
  getUsersFromCache,
  async (req, res) => {
    let start = 0;
    let end = 14;

    const { usersPage } = req.query;

    for (let i = 1; i < usersPage; i++) {
      start += 14;
      end += 14;
    }

    try {
      const users = await userModel.getAllFiltered(req.query);
      console.log(users.length);
      cachedUsersSuccess = infinityCache.set("users", users);
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
