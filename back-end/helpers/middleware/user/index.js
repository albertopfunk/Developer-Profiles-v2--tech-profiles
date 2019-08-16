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
    chosenRelocateTo,
    isUsingSortByChoice,
    sortByChoice
  } = req.query;

  if (typeof usersPage === "string") {
    usersPage = +usersPage;
    if (Number.isNaN(usersPage)) {
      return validationFail("num:usersPage");
    }
  } else {
    return validationFail("num:usersPage");
  }

  if (typeof isUsinginfinite === "string") {
    if (isUsinginfinite === "true" || isUsinginfinite === "false") {
      isUsinginfinite = isUsinginfinite === "true";
    } else {
      return validationFail("bool:isUsinginfinite");
    }
  } else {
    return validationFail("bool:isUsinginfinite");
  }

  if (typeof isWebDevChecked === "string") {
    if (isWebDevChecked === "true" || isWebDevChecked === "false") {
      isWebDevChecked = isWebDevChecked === "true";
    } else {
      return validationFail("bool:isWebDevChecked");
    }
  } else {
    return validationFail("bool:isWebDevChecked");
  }

  if (typeof isUIUXChecked === "string") {
    if (isUIUXChecked === "true" || isUIUXChecked === "false") {
      isUIUXChecked = isUIUXChecked === "true";
    } else {
      return validationFail("bool:isUIUXChecked");
    }
  } else {
    return validationFail("bool:isUIUXChecked");
  }

  if (typeof isIOSChecked === "string") {
    if (isIOSChecked === "true" || isIOSChecked === "false") {
      isIOSChecked = isIOSChecked === "true";
    } else {
      return validationFail("bool:isIOSChecked");
    }
  } else {
    return validationFail("bool:isIOSChecked");
  }

  if (typeof isAndroidChecked === "string") {
    if (isAndroidChecked === "true" || isAndroidChecked === "false") {
      isAndroidChecked = isAndroidChecked === "true";
    } else {
      return validationFail("bool:isAndroidChecked");
    }
  } else {
    return validationFail("bool:isAndroidChecked");
  }

  if (typeof isUsingCurrLocationFilter === "string") {
    if (
      isUsingCurrLocationFilter === "true" ||
      isUsingCurrLocationFilter === "false"
    ) {
      isUsingCurrLocationFilter = isUsingCurrLocationFilter === "true";
    } else {
      return validationFail("bool:isUsingCurrLocationFilter");
    }
  } else {
    return validationFail("bool:isUsingCurrLocationFilter");
  }

  if (isUsingCurrLocationFilter) {
    if (typeof selectedWithinMiles === "string") {
      selectedWithinMiles = +selectedWithinMiles;
      if (Number.isNaN(selectedWithinMiles)) {
        return validationFail("num:selectedWithinMiles");
      }
    } else {
      return validationFail("num:selectedWithinMiles");
    }

    if (typeof chosenLocationLat === "string") {
      chosenLocationLat = +chosenLocationLat;
      if (Number.isNaN(chosenLocationLat)) {
        return validationFail("num:chosenLocationLat");
      }
    } else {
      return validationFail("num:chosenLocationLat");
    }

    if (typeof chosenLocationLon === "string") {
      chosenLocationLon = +chosenLocationLon;
      if (Number.isNaN(chosenLocationLon)) {
        return validationFail("num:chosenLocationLon");
      }
    } else {
      return validationFail("num:chosenLocationLon");
    }
  }

  if (typeof isUsingRelocateToFilter === "string") {
    if (
      isUsingRelocateToFilter === "true" ||
      isUsingRelocateToFilter === "false"
    ) {
      isUsingRelocateToFilter = isUsingRelocateToFilter === "true";
    } else {
      return validationFail("bool:isUsingRelocateToFilter");
    }

    if (typeof chosenRelocateTo !== "string") {
      return validationFail("str:chosenRelocateTo");
    }
  } else {
    return validationFail("bool:isUsingRelocateToFilter");
  }

  if (typeof isUsingSortByChoice === "string") {
    if (isUsingSortByChoice === "true" || isUsingSortByChoice === "false") {
      isUsingSortByChoice = isUsingSortByChoice === "true";
    } else {
      return validationFail("bool:isUsingSortByChoice");
    }

    if (typeof sortByChoice !== "string") {
      return validationFail("str:sortByChoice");
    }
  } else {
    return validationFail("bool:isUsingSortByChoice");
  }

  req.query = {
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
    chosenRelocateTo,
    isUsingSortByChoice,
    sortByChoice
  };

  console.log("isrunning...");
  next();
}

function getUsersFromCache(req, res, next) {
  let start = 0;
  let end = 14;

  const { usersPage, isUsinginfinite } = req.query;

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
