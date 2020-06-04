const db = require("../../../data/dbConfig");

module.exports = {
  locationFilters
};

function locationFilters(locationOptions, users) {
  let tempLocationUsers = [];
  let tempRelocateToUsers = [];

  const {
    isUsingCurrLocationFilter,
    isUsingRelocateToFilter,
    selectedWithinMiles,
    chosenLocationLat,
    chosenLocationLon,
    chosenRelocateToArr
  } = locationOptions;

  if (isUsingCurrLocationFilter) {
    tempLocationUsers = currentLocationFilter(
      users,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon
    );
  }

  if (isUsingRelocateToFilter) {
    tempRelocateToUsers = relocateToFilter(users, chosenRelocateToArr);
  }

  users = [...new Set([...tempLocationUsers, ...tempRelocateToUsers])];

  return users;
}

function currentLocationFilter(
  users,
  selectedWithinMiles,
  chosenLocationLat,
  chosenLocationLon
) {
  const filteredUsers = users.filter(user => {
    if (user.current_location_lat && user.current_location_lon) {
      userLat = user.current_location_lat;
      userLon = user.current_location_lon;
      return distanceWithinFilter(
        chosenLocationLat,
        chosenLocationLon,
        userLat,
        userLon,
        selectedWithinMiles
      );
    } else {
      return false;
    }
  });
  return filteredUsers;
}

function distanceWithinFilter(lat1, lon1, lat2, lon2, filter) {
  if (lat1 == lat2 && lon1 == lon2) {
    return true;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    if (dist < filter) {
      return true;
    } else {
      return false;
    }
  }
}

async function relocateToFilter(users, chosenRelocateToArr) {
  let filteredUsers = [];
  let filteredUserArr = [];

  for (let i = 0; i < users.length; i++) {
    filteredUserArr = await db("user_locations").where("user_id", users[i].id);
    if (chosenRelocateToArr.some(item => filteredUserArr.includes(item))) {
      filteredUsers.push(users[i]);
    }
  }

  return filteredUsers;
}
