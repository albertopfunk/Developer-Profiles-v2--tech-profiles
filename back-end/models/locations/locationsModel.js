const db = require("../../data/dbConfig");

module.exports = {
  insertUserLocation,
  removeUserLocations,
  removeUserLocation,
};

function getSingle(location) {
  return db("locations").where({ location }).first();
}

async function insertLocation(location) {
  const dbEnv = process.env.DB_ENV || process.env.DB;
  let id;

  if (dbEnv === "production") {
    id = await db("locations").returning("id").insert({
      location,
    });
  } else {
    id = await db("locations").insert({
      location,
    });
  }

  return id[0];
}

async function insertUserLocation(lePackage) {
  for (let i = 0; i < lePackage.locations.length; i++) {
    let id;
    let doesLocationExist = await getSingle(lePackage.locations[i].name);

    if (!doesLocationExist) {
      id = await insertLocation(lePackage.locations[i].name);
    } else {
      id = doesLocationExist.id;
    }

    await db("user_locations").insert({
      user_id: lePackage.user_id,
      location_id: id,
    });
  }
}

function removeUserLocations(userId) {
  return db("user_locations").where({ user_id: userId }).delete();
}

function removeUserLocation(userId, locationId) {
  return db("user_locations")
    .where({ user_id: userId, location_id: locationId })
    .delete();
}
