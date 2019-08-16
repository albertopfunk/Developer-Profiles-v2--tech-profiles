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
  let stopRunning = false;
  function returnFail(variableMissing) {
    stopRunning = true;
    return res.status(400).json({
      message: `Expected '${variableMissing}' but recevied 'null', 'undefined', or the incorrect data type'`
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

  // normalize or reject
  if (typeof usersPage === "string") {
    usersPage = +usersPage;
    Number.isNaN(usersPage) ? returnFail("num:usersPage") : null;
  } else {
    returnFail("num:usersPage");
  }

  if (typeof isUsinginfinite === "string") {
    if (isUsinginfinite === "true" || isUsinginfinite === "false") {
      isUsinginfinite = isUsinginfinite === "true";
    } else {
      returnFail("bool:isUsinginfinite");
    }
  } else {
    returnFail("bool:isUsinginfinite");
  }

  if (typeof isWebDevChecked === "string") {
    if (isWebDevChecked === "true" || isWebDevChecked === "false") {
      isWebDevChecked = isWebDevChecked === "true";
    } else {
      returnFail("bool:isWebDevChecked");
    }
  } else {
    returnFail("bool:isWebDevChecked");
  }

  if (typeof isUIUXChecked === "string") {
    if (isUIUXChecked === "true" || isUIUXChecked === "false") {
      isUIUXChecked = isUIUXChecked === "true";
    } else {
      returnFail("bool:isUIUXChecked");
    }
  } else {
    returnFail("bool:isUIUXChecked");
  }

  if (typeof isIOSChecked === "string") {
    if (isIOSChecked === "true" || isIOSChecked === "false") {
      isIOSChecked = isIOSChecked === "true";
    } else {
      returnFail("bool:isIOSChecked");
    }
  } else {
    returnFail("bool:isIOSChecked");
  }

  if (typeof isAndroidChecked === "string") {
    if (isAndroidChecked === "true" || isAndroidChecked === "false") {
      isAndroidChecked = isAndroidChecked === "true";
    } else {
      returnFail("bool:isAndroidChecked");
    }
  } else {
    returnFail("bool:isAndroidChecked");
  }

  if (typeof isUsingCurrLocationFilter === "string") {
    if (
      isUsingCurrLocationFilter === "true" ||
      isUsingCurrLocationFilter === "false"
    ) {
      isUsingCurrLocationFilter = isUsingCurrLocationFilter === "true";
    } else {
      returnFail("bool:isUsingCurrLocationFilter");
    }
  } else {
    returnFail("bool:isUsingCurrLocationFilter");
  }

  if (isUsingCurrLocationFilter) {
    if (typeof selectedWithinMiles === "string") {
      selectedWithinMiles = +selectedWithinMiles;
      Number.isNaN(selectedWithinMiles)
        ? returnFail("num:selectedWithinMiles")
        : null;
    } else {
      returnFail("num:selectedWithinMiles");
    }

    if (typeof chosenLocationLat === "string") {
      chosenLocationLat = +chosenLocationLat;
      Number.isNaN(chosenLocationLat)
        ? returnFail("num:chosenLocationLat")
        : null;
    } else {
      returnFail("num:chosenLocationLat");
    }

    if (typeof chosenLocationLon === "string") {
      chosenLocationLon = +chosenLocationLon;
      Number.isNaN(chosenLocationLon)
        ? returnFail("num:chosenLocationLon")
        : null;
    } else {
      returnFail("num:chosenLocationLon");
    }
  }

  if (typeof isUsingRelocateToFilter === "string") {
    typeof chosenRelocateTo === "string"
      ? null
      : returnFail("str:chosenRelocateTo");
    if (
      isUsingRelocateToFilter === "true" ||
      isUsingRelocateToFilter === "false"
    ) {
      isUsingRelocateToFilter = isUsingRelocateToFilter === "true";
    } else {
      returnFail("bool:isUsingRelocateToFilter");
    }
  } else {
    returnFail("bool:isUsingRelocateToFilter");
  }

  if (typeof isUsingSortByChoice === "string") {
    typeof sortByChoice === "string" ? null : returnFail("str:sortByChoice");
    if (isUsingSortByChoice === "true" || isUsingSortByChoice === "false") {
      isUsingSortByChoice = isUsingSortByChoice === "true";
    } else {
      returnFail("bool:isUsingSortByChoice");
    }
  } else {
    returnFail("bool:isUsingSortByChoice");
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

  // unhandled promise rejection if this condition is not present
  if (stopRunning) {
    return;
  } else {
    next();
  }
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
