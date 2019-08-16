const locationHelpers = require("./locationHelpers");

// Global users - Do not get modified
const users = [
  {
    current_location_lat: 34.052235,
    current_location_lon: -118.243683,
    current_location_name: "Los Angeles, CA, USA",
    interested_location_names: "Boston, MA, USA|Seattle, WA, USA"
  },
  {
    current_location_lat: 37.773972,
    current_location_lon: -122.431297,
    current_location_name: "San Francisco, CA, USA",
    interested_location_names: "Los Angeles, CA, USA|Seattle, WA, USA"
  },
  {
    current_location_lat: 42.361145,
    current_location_lon: -71.057083,
    current_location_name: "Boston, MA, USA",
    interested_location_names: "San Francisco, CA, USA|Seattle, WA, USA"
  },
  {
    current_location_lat: 47.608013,
    current_location_lon: -122.335167,
    current_location_name: "Seattle, WA, USA",
    interested_location_names:
      "Boston, MA, USA|San Francisco, CA, USA|Boulder, CO, USA"
  },
  {
    current_location_lat: 40.014984,
    current_location_lon: -105.270546,
    current_location_name: "Boulder, CO, USA",
    interested_location_names: "Boston, MA, USA|Los Angeles, CA, USA"
  }
];

describe("locationFilters", () => {
  // filters for locationFilters - Do not get modified
  const filterOptions = {
    isUsingCurrLocationFilter: false,
    isUsingRelocateToFilter: false,
    selectedWithinMiles: 500,
    // los angeles
    chosenLocationLat: 34.052235,
    chosenLocationLon: -118.243683,
    chosenRelocateTo: "Los Angeles, CA, USA"
  };

  it("should return 0 users since filters are false", () => {
    const filteredUsers = locationHelpers.locationFilters(filterOptions, users);
    expect(filteredUsers).toHaveLength(0);
  });

  it("should return 2 users that live within 500miles of default Los Angeles", () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const filteredUsers = locationHelpers.locationFilters(
      filterOptionsCopy,
      users
    );
    expect(filteredUsers).toHaveLength(2);
  });

  it("should return 2 users that want to relocate to default Los Angeles", () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingRelocateToFilter = true;
    const filteredUsers = locationHelpers.locationFilters(
      filterOptionsCopy,
      users
    );
    expect(filteredUsers).toHaveLength(2);
  });

  it("should return 3 users that live within 500miles of default Los Angeles AND want to relocate to default Los Angeles", () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    filterOptionsCopy.isUsingRelocateToFilter = true;
    const filteredUsers = locationHelpers.locationFilters(
      filterOptionsCopy,
      users
    );
    expect(filteredUsers).toHaveLength(3);
  });
});

describe("currentLocationFilter", () => {
  it("should return 4 users that live within 1400miles of Seattle, WA", () => {
    let miles = 1400;
    // Seattle, WA, USA
    let chosenLocationLat = 47.608013;
    let chosenLocationLon = -122.335167;
    const filteredUsers = locationHelpers.currentLocationFilter(
      users,
      miles,
      chosenLocationLat,
      chosenLocationLon
    );
    expect(filteredUsers).toHaveLength(4);
  });

  it("should return 2 users that live within 1800miles of Boston, MA", () => {
    let miles = 1800;
    // Boston, MA, USA
    let chosenLocationLat = 42.361145;
    let chosenLocationLon = -71.057083;
    const filteredUsers = locationHelpers.currentLocationFilter(
      users,
      miles,
      chosenLocationLat,
      chosenLocationLon
    );
    expect(filteredUsers).toHaveLength(2);
  });

  it("should return 1 user that lives within 1750miles of Boston, MA", () => {
    let miles = 1750;
    // Boston, MA, USA
    let chosenLocationLat = 42.361145;
    let chosenLocationLon = -71.057083;
    const filteredUsers = locationHelpers.currentLocationFilter(
      users,
      miles,
      chosenLocationLat,
      chosenLocationLon
    );
    expect(filteredUsers).toHaveLength(1);
  });
});

describe("distanceWithinFilter", () => {
  it("should return true since Boston, MA is within 1785miles of Boulder, CO", () => {
    // Boston - Boulder ~=~ 1775miles
    let miles = 1785;

    // Boston, MA, USA
    let lat = 42.361145;
    let lon = -71.057083;

    // Boulder, CO, USA
    let lat2 = 40.014984;
    let lon2 = -105.270546;

    const isWithinDistance = locationHelpers.distanceWithinFilter(
      lat,
      lon,
      lat2,
      lon2,
      miles
    );
    expect(isWithinDistance).toBeTruthy();
  });

  it("should return false since Boston, MA is NOT within 1765miles of Boulder, CO", () => {
    // Boston - Boulder ~=~ 1775miles
    let miles = 1765;

    // Boston, MA, USA
    let lat = 42.361145;
    let lon = -71.057083;

    // Boulder, CO, USA
    let lat2 = 40.014984;
    let lon2 = -105.270546;

    const isWithinDistance = locationHelpers.distanceWithinFilter(
      lat,
      lon,
      lat2,
      lon2,
      miles
    );
    expect(isWithinDistance).toBeFalsy();
  });

  it("should return true since New York is within 5000miles of Honolulu", () => {
    // NY - Honolulu ~=~ 4950miles
    let miles = 5000;

    // New York, NY, USA
    let lat = 40.73061;
    let lon = -73.935242;

    // Honolulu, HI, USA
    let lat2 = 21.315603;
    let lon2 = -157.858093;

    const isWithinDistance = locationHelpers.distanceWithinFilter(
      lat,
      lon,
      lat2,
      lon2,
      miles
    );
    expect(isWithinDistance).toBeTruthy();
  });

  it("should return false since New York is NOT within 4900miles of Honolulu", () => {
    // NY - Honolulu ~=~ 4950miles
    let miles = 4900;

    // New York, NY, USA
    let lat = 40.73061;
    let lon = -73.935242;

    // Honolulu, HI, USA
    let lat2 = 21.315603;
    let lon2 = -157.858093;

    const isWithinDistance = locationHelpers.distanceWithinFilter(
      lat,
      lon,
      lat2,
      lon2,
      miles
    );
    expect(isWithinDistance).toBeFalsy();
  });
});

describe("relocateToFilter", () => {
  it("should return 3 users that want to relocate to Seattle", () => {
    const relocateTo = "Seattle, WA, USA";
    const filteredUsers = locationHelpers.relocateToFilter(users, relocateTo);
    expect(filteredUsers).toHaveLength(3);
  });

  it("should return 3 users that want to relocate to Boston", () => {
    const relocateTo = "Boston, MA, USA";
    const filteredUsers = locationHelpers.relocateToFilter(users, relocateTo);
    expect(filteredUsers).toHaveLength(3);
  });

  it("should return 1 user that wants to relocate to Boulder", () => {
    const relocateTo = "Boulder, CO, USA";
    const filteredUsers = locationHelpers.relocateToFilter(users, relocateTo);
    expect(filteredUsers).toHaveLength(1);
  });
});
