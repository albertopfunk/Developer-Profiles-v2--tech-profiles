const sortingHelpers = require("../../helpers/sorting/sortingHelpers");
const locationHelpers = require("../../helpers/filtering/location/locationHelpers");
const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getAllFiltered,
  getSingle,
  getSingleByEmail,
  getUserExtras,
  getFullUser,
  update,
  remove,
};


/**
 * inserts user object to users db table
 * @param newUser object containing any or none user properties
 * @returns full provided user object
 */
async function insert(newUser) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  // PG requires returning method
  if (dbEnv === "production") {
    const [id] = await db("users").returning("id").insert(newUser);
    return getSingle(id);
  } else {
    const [id] = await db("users").insert(newUser);
    return getSingle(id);
  }
}

/**
 * returns all subscribed users from users db table
 * @returns subscribed users
 */
function getAll() {
  return db("users").whereNotNull("stripe_subscription_name");
}

/**
 * Exclusive/reductive filtering
 * @param filters object containing any or none filter properties
 * @returns subscribed filtered users
 */
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
    chosenRelocateToObj,
    sortChoice,
  } = filters;

  if (
    !isWebDevChecked &&
    !isUIUXChecked &&
    !isIOSChecked &&
    !isAndroidChecked &&
    !isUsingCurrLocationFilter &&
    !isUsingRelocateToFilter &&
    sortChoice === "acending(oldest-newest)"
  ) {
    return getAll();
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
    users.length === 0 ? (users = await getAll()) : null;
    const locationOptions = {
      isUsingCurrLocationFilter,
      isUsingRelocateToFilter,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon,
      chosenRelocateToObj,
    };
    users = await locationHelpers.locationFilters(locationOptions, users);
    if (users.length === 0) {
      return users;
    }
  }

  users.length === 0 ? (users = await getAll()) : null;
  if (sortChoice !== "acending(oldest-newest)") {
    users = sortingHelpers.sortUsers(users, sortChoice);
  }

  users = users.filter((user) => user.stripe_subscription_name !== null);

  return users;
}

function getSingle(id) {
  return db("users").where({ id }).first();
}

async function getUserExtras(userId) {
  function getLocations() {
    return db("locations")
      .join("user_locations", "locations.id", "user_locations.location_id")
      .select("locations.location as name", "locations.id")
      .where("user_locations.user_id", userId);
  }

  function getTopSkills() {
    return db("skills")
      .join("user_top_skills", "skills.id", "user_top_skills.skill_id")
      .select("skills.skill as name", "skills.id")
      .where("user_top_skills.user_id", userId);
  }

  function getAdditionalSkills() {
    return db("skills")
      .join(
        "user_additional_skills",
        "skills.id",
        "user_additional_skills.skill_id"
      )
      .select("skills.skill as name", "skills.id")
      .where("user_additional_skills.user_id", userId);
  }

  function getEducation() {
    return db("education")
      .join("users", "users.id", "education.user_id")
      .select(
        "education.id",
        "education.school",
        "education.school_dates",
        "education.field_of_study",
        "education.education_description"
      )
      .where("education.user_id", userId);
  }

  function getExperience() {
    return db("experience")
      .join("users", "users.id", "experience.user_id")
      .select(
        "experience.id",
        "experience.company_name",
        "experience.job_title",
        "experience.job_dates",
        "experience.job_description"
      )
      .where("experience.user_id", userId);
  }

  function getProjects() {
    return db("projects")
      .join("users", "users.id", "projects.user_id")
      .select(
        "projects.id",
        "projects.project_title",
        "projects.project_img",
        "projects.image_id",
        "projects.link",
        "projects.project_description"
      )
      .where("projects.user_id", userId);
  }

  const [
    locations,
    topSkills,
    additionalSkills,
    education,
    experience,
    projects,
  ] = await Promise.all([
    getLocations(),
    getTopSkills(),
    getAdditionalSkills(),
    getEducation(),
    getExperience(),
    getProjects(),
  ]);

  return {
    locations,
    topSkills,
    additionalSkills,
    education,
    experience,
    projects,
  };
}

async function getFullUser(email) {
  const user = await getSingleByEmail(email);
  const extras = await getUserExtras(user.id);
  return { ...user, ...extras };
}

function getSingleByEmail(email) {
  return db("users").where({ email }).first();
}

async function update(id, body) {
  await db("users").where({ id }).update(body);
  return getSingle(id);
}

function remove(id) {
  return db("users").where({ id }).delete();
}
