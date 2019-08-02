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
    chosenRelocateTo
  } = filters;

  if (
    !isWebDevChecked &&
    !isUIUXChecked &&
    !isIOSChecked &&
    !isAndroidChecked &&
    !isUsingLocationFilter &&
    !isUsingRelocateToFilter
  ) {
    return db("users");
  }

  if (isWebDevChecked) {
    tempUsers = await db("users").where("area_of_work", "Web Development");
    users = [...users, ...tempUsers]
  }

  if (isUIUXChecked) {
    tempUsers = await db("users").where("area_of_work", "UI/UX");
    users = [...users, ...tempUsers]
  }

  if (isIOSChecked) {
    tempUsers = await db("users").where("area_of_work", "iOS");
    users = [...users, ...tempUsers]
  }

  if (isAndroidChecked) {
    tempUsers = await db("users").where("area_of_work", "Android");
    users = [...users, ...tempUsers]
  }



  // cant run both locationFilter n relocateToFilter
    // without there being either duplicates
    // without filtering errors
  // if locationFilter runs first, then users will not have some users with the interested locations since they get filtered out
  // if relocateFilter runs first, then users will not have some users with the current location since they get filtered out
  // if I try to spead, either way around, it will create dups

  // need to figure out a way to filter for users to be 'within location range' *AND* 'interesed in chosen location'
    // without dups or extra unwanted filtering

  if (isUsingLocationFilter) {
    users.length === 0 ? users = await db("users") : null
    users = locationFilter(users, selectedWithinMiles, chosenLocationLat, chosenLocationLon)
  }

  if (isUsingRelocateToFilter) {
    users.length === 0 ? users = await db("users") : null
    tempUsers = relocateToFilter(users, chosenRelocateTo)
    users = [...users, ...tempUsers]
  }





  return users;
}





function locationFilter(users, selectedWithinMiles, chosenLocationLat, chosenLocationLon) {

  const filteredUsers = users.filter(user => {
    if (user.current_location_lat && user.current_location_lon) {
      userLat = user.current_location_lat;
      userLon = user.current_location_lon;
      return distanceWithFilter(chosenLocationLat, chosenLocationLon, userLat, userLon, selectedWithinMiles)
    } else {
      return false;
    }
  })
  return filteredUsers;
}


function distanceWithFilter(lat1, lon1, lat2, lon2, filter) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return true;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;

    if (dist < filter) {
      console.log('user is within chosen miles of origin location!')
      return true;
    } else {
      console.log('user to too far!')
      return false;
    }
	}
}





function relocateToFilter(users, chosenRelocateTo) {
  let filteredUsers;
  let filteredUserArr = [];

  filteredUsers = users.filter(user => {
    if (user.interested_location_names) {
      filteredUserArr = user.interested_location_names.split('|');
      return filteredUserArr.includes(chosenRelocateTo);
    } else {
      return false;
    }
  })

  return filteredUsers;
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
