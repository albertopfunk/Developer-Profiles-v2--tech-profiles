const db = require("../../data/dbConfig");

// locations array, user_id

// for each location
// check if location exists
// if yes - get location ID
// if no - add location and get ID
// add entry to user-locations(userId and locationId)

module.exports = {
  insertLocation,
  insertUserLocation,
  getAll,
  getSingle
};

async function getAll() {
  return db("locations");
}

function getSingle(location) {
  return db("locations")
    .where({ location })
    .first();
}

async function insertLocation(location, user_id) {
  const dbEnv = process.env.DB_ENV || process.env.DB;
  let id;

  if (dbEnv === "production") {
    id = await db("locations")
      .returning("id")
      .insert({
        location
      });
  } else {
    id = await db("locations").insert({
      location
    });
  }
  await db("user_locations").insert({
    user_id,
    location_id: id[0]
  });
}

async function insertUserLocation(lePackage) {
  for (let i = 0; i < lePackage.locations.length; i++) {
    let doesLocationExist = await getSingle(lePackage.locations[i]);

    if (doesLocationExist) {
      await db("user_locations").insert({
        user_id: lePackage.user_id,
        location_id: doesLocationExist.id
      });
    } else {
      await insertLocation(lePackage.locations[i], lePackage.user_id);
    }
  }
}
