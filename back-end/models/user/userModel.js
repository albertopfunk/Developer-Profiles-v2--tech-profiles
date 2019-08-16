const sortingHelpers = require("../../helpers/sorting/sortingHelpers");
const locationHelpers = require("../../helpers/filtering/location/locationHelpers");
const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getAllFiltered,
  getSingle,
  update,
  remove
};

async function insert(newUser) {
  const [id] = await db("users").insert(newUser);
  return getSingle(id);
}

function getAll() {
  return db("users");
}

async function getAllFiltered(filters) {
  let users = [];
  let tempUsers;
  const {
    isWebDevChecked,
    isUIUXChecked,
    isIOSChecked,
    isAndroidChecked,
    isUsingCurrLocationFilter,
    isUsingRelocateToFilter,
    selectedWithinMiles,
    chosenLocationLat,
    chosenLocationLon,
    chosenRelocateTo,
    isUsingSortByChoice,
    sortByChoice
  } = filters;

  if (
    !isWebDevChecked &&
    !isUIUXChecked &&
    !isIOSChecked &&
    !isAndroidChecked &&
    !isUsingCurrLocationFilter &&
    !isUsingRelocateToFilter &&
    !isUsingSortByChoice
  ) {
    return db("users");
  }

  if (isWebDevChecked || isUIUXChecked || isIOSChecked || isAndroidChecked) {
    if (isWebDevChecked) {
      tempUsers = await db("users").where("area_of_work", "Web Development");
      users = [...users, ...tempUsers];
    }

    if (isUIUXChecked) {
      tempUsers = await db("users").where("area_of_work", "UI/UX");
      users = [...users, ...tempUsers];
    }

    if (isIOSChecked) {
      tempUsers = await db("users").where("area_of_work", "iOS");
      users = [...users, ...tempUsers];
    }

    if (isAndroidChecked) {
      tempUsers = await db("users").where("area_of_work", "Android");
      users = [...users, ...tempUsers];
    }
    if (users.length === 0) {
      return users;
    }
  }

  if (isUsingCurrLocationFilter || isUsingRelocateToFilter) {
    users.length === 0 ? (users = await db("users")) : null;
    const locationOptions = {
      isUsingCurrLocationFilter,
      isUsingRelocateToFilter,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon,
      chosenRelocateTo
    };
    users = locationHelpers.locationFilters(locationOptions, users);
    if (users.length === 0) {
      return users;
    }
  }

  if (isUsingSortByChoice) {
    users.length === 0 ? (users = await db("users")) : null;
    if (sortByChoice !== "acending(oldest-newest)") {
      users = sortingHelpers.sortUsers(users, sortByChoice);
    }
  }

  return users;
}

function getSingle(id) {
  return db("users")
    .where({ email: id })
    .orWhere({ id })
    .first();
}

function update(id, body) {
  return db("users")
    .where({ id })
    .update(body);
}

function remove(id) {
  return db("users")
    .where({ id })
    .delete();
}
