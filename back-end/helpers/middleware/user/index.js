const NodeCache = require("node-cache");

module.exports = {
  setToCache,
  validateFilterOptions,
  getUsersFromCache
};

const usersCache = new NodeCache({ stdTTL: 21500, checkperiod: 22000 });

function setToCache(users) {
  return usersCache.set("users", users);
}

function validateFilterOptions(req, res, next) {
  function validationFail(variable) {
    return res.status(400).json({
      message: `Expected '${variable}' but recevied 'null', 'undefined', or the incorrect data type'`
    });
  }

  let {
    usersPage,
    isUsinginfinite,
    isWebDevChecked,
    isUIUXChecked,
    isIOSChecked,
    isAndroidChecked,
    isUsingCurrLocationFilter,
    selectedWithinMiles,
    chosenLocationLat,
    chosenLocationLon,
    isUsingRelocateToFilter,
    chosenRelocateToArr,
    isUsingSortByChoice,
    sortByChoice
  } = req.body;

  if (typeof usersPage !== "number") {
    return validationFail("num:usersPage");
  }

  if (typeof isUsinginfinite !== "boolean") {
    return validationFail("bool:isUsinginfinite");
  }

  if (typeof isWebDevChecked !== "boolean") {
    return validationFail("bool:isWebDevChecked");
  }

  if (typeof isUIUXChecked !== "boolean") {
    return validationFail("bool:isUIUXChecked");
  }

  if (typeof isIOSChecked !== "boolean") {
    return validationFail("bool:isIOSChecked");
  }

  if (typeof isAndroidChecked !== "boolean") {
    return validationFail("bool:isAndroidChecked");
  }

  if (typeof isUsingCurrLocationFilter !== "boolean") {
    return validationFail("bool:isUsingCurrLocationFilter");
  } else {
    if (typeof selectedWithinMiles !== "number") {
      return validationFail("num:selectedWithinMiles");
    }
    if (typeof chosenLocationLat !== "number") {
      return validationFail("num:chosenLocationLat");
    }
    if (typeof chosenLocationLon !== "number") {
      return validationFail("num:chosenLocationLon");
    }
  }

  if (typeof isUsingRelocateToFilter !== "boolean") {
    return validationFail("bool:isUsingRelocateToFilter");
  } else {
    if (!Array.isArray(chosenRelocateToArr)) {
      return validationFail("array:chosenRelocateToArr");
    }
  }

  if (typeof isUsingSortByChoice !== "boolean") {
    return validationFail("bool:isUsingSortByChoice");
  } else {
    if (typeof sortByChoice !== "string") {
      return validationFail("str:sortByChoice");
    }
  }

  next();
}

function getUsersFromCache(req, res, next) {
  let start = 0;
  let end = 14;

  const { usersPage, isUsinginfinite } = req.body;

  for (let i = 1; i < usersPage; i++) {
    start += 14;
    end += 14;
  }

  if (isUsinginfinite) {
    try {
      const cachedUsers = usersCache.get("users", true);
      console.log("CACHE", cachedUsers.length);
      const slicedUsers = cachedUsers.slice(start, end);
      res.json(slicedUsers);
    } catch (err) {
      next();
    }
  } else {
    next();
  }
}
