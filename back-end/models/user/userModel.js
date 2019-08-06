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
    isUsingLocationFilter,
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
    !isUsingLocationFilter &&
    !isUsingRelocateToFilter &&
    !isUsingSortByChoice
  ) {
    return db("users");
  }

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

  if (isUsingLocationFilter) {
    users.length === 0 ? (users = await db("users")) : null;
    users = locationFilter(
      users,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon
    );
    if (users.length === 0) {
      return users;
    }
  }

  if (isUsingRelocateToFilter) {
    users.length === 0 ? (users = await db("users")) : null;

    if (isUsingLocationFilter) {
      tempUsers = relocateToFilter(users, chosenRelocateTo);
      users = [...new Set([...users, ...tempUsers])];
    } else {
      tempUsers = relocateToFilter(users, chosenRelocateTo);
      users = tempUsers;
    }
    
    if (users.length === 0) {
      return users;
    }
  }

  if (isUsingSortByChoice) {
    users.length === 0 ? (users = await db("users")) : null;
    users = sortUsers(users, sortByChoice);
  }

  return users;
}

function locationFilter(
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

function relocateToFilter(users, chosenRelocateTo) {
  let filteredUsers;
  let filteredUserArr = [];

  filteredUsers = users.filter(user => {
    if (user.interested_location_names) {
      filteredUserArr = user.interested_location_names.split("|");
      return filteredUserArr.includes(chosenRelocateTo);
    } else {
      return false;
    }
  });

  return filteredUsers;
}

function sortUsers(users, sortByChoice) {
  let sortedUsers;

  if (sortByChoice === "acending(oldest-newest)") {
    sortedUsers = users.sort(function(a, b) {
      return a.id - b.id;
    });
  }

  if (sortByChoice === "descending(newest-oldest)") {
    sortedUsers = users.sort(function(a, b) {
      return b.id - a.id;
    });
  }

  return sortedUsers;
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
