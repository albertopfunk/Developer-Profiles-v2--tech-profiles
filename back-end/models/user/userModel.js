const sortingHelpers = require("../../helpers/sorting/sortingHelpers");
const locationHelpers = require("../../helpers/filtering/location/locationHelpers");
const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getFullUser,
  getAllFiltered,
  getSingle,
  getSingleByEmail,
  update,
  remove
};

async function insert(newUser) {
  await db("users").insert(newUser);
  return;
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
    chosenRelocateToArr,
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
      tempUsers = await db("users").where("area_of_work", "Development");
      users = [...users, ...tempUsers];
    }

    if (isUIUXChecked) {
      tempUsers = await db("users").where("area_of_work", "Design");
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
      chosenRelocateToArr
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
    .where({ id })
    .first();
}

async function getFullUser(userId) {
  async function getUser() {
    return db("users").where("id", userId);
  }

  async function getLocations() {
    return db("locations")
      .join("user_locations", "locations.id", "user_locations.location_id")
      .select("locations.location as name")
      .where("user_locations.user_id", userId);
  }

  async function getTopSkills() {
    return db("skills")
      .join("user_top_skills", "skills.id", "user_top_skills.skill_id")
      .select("skills.skill as name")
      .where("user_top_skills.user_id", userId);
  }

  async function getAdditionalSkills() {
    return db("skills")
      .join(
        "user_additional_skills",
        "skills.id",
        "user_additional_skills.skill_id"
      )
      .select("skills.skill as name")
      .where("user_additional_skills.user_id", userId);
  }

  async function getEducation() {
    return db("education")
      .join("users", "users.id", "education.user_id")
      .select(
        "education.school",
        "education.school_dates",
        "education.field_of_study"
      )
      .where("education.user_id", userId);
  }

  async function getExperience() {
    return db("experience")
      .join("users", "users.id", "experience.user_id")
      .select(
        "experience.company_name",
        "experience.job_title",
        "experience.job_dates",
        "experience.job_description"
      )
      .where("experience.user_id", userId);
  }

  async function getProjects() {
    return db("projects")
      .join("users", "users.id", "projects.user_id")
      .select(
        "projects.project_title",
        "projects.link",
        "projects.project_description",
        "projects.project_img"
      )
      .where("projects.user_id", userId);
  }

  const [
    user,
    locations,
    topSkills,
    additionalSkills,
    education,
    experience,
    projects
  ] = await Promise.all([
    getUser(),
    getLocations(),
    getTopSkills(),
    getAdditionalSkills(),
    getEducation(),
    getExperience(),
    getProjects()
  ]);

  return {
    ...user[0],
    locations,
    top_skills: topSkills,
    additional_skills: additionalSkills,
    education,
    experience,
    projects
  };
}

function getSingleByEmail(email) {
  return db("users")
    .where({ email })
    .first();
}

async function update(id, body) {
  await db("users")
    .where({ id })
    .update(body);
  return getSingle(id);
}

function remove(id) {
  return db("users")
    .where({ id })
    .delete();
}
