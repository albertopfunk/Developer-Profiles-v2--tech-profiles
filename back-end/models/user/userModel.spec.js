const userModel = require("./userModel");
const db = require("../../data/dbConfig");
const { userMaker } = require("../../tests/utils/generate");

describe("insert", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("should insert users", async () => {
    const user1 = userMaker({email: "test@email.com"})
    const user2 = userMaker({email: "test2@email.com"})

    const userRes1 = await userModel.insert(user1);
    const userRes2 = await userModel.insert(user2);

    const users = await db("users");
    expect(users).toHaveLength(2);

    expect(userRes1.id).toBe(1);
    expect(userRes1.email).toBe("test@email.com");

    expect(userRes2.id).toBe(2);
    expect(userRes2.email).toBe("test2@email.com");
  });

  it("should return provided user", async () => {
    const user = userMaker({email: "test@email.com"})
    const userCopy = userMaker({id: 1, email: "test@email.com"})

    const userRes = await userModel.insert(user);
    expect(userRes).toEqual(userCopy);
  });

  it("should accept any column of the user table", async () => {
    const user = userMaker({github: "theTestUser"})

    const userRes = await userModel.insert(user);
    expect(userRes.id).toBe(1);
    expect(userRes.github).toBe(user.github);
  });

  it("should accept a user with no columns", async () => {
    const user = {};

    const newUser = await userModel.insert(user);
    expect(newUser.id).toBe(1);
    expect(newUser.email).toBeNull;
  });
});

describe("getAll", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("should return an empty array", async () => {
    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(0);
  });

  it("should return all subscribed users", async () => {
    const user1 = userMaker({email: "test@email.com"})
    const user2 = userMaker({
      email: "test2@email.com",
      stripe_subscription_name: null
    });

    await db("users").insert(user1);
    await db("users").insert(user2);

    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].email).toBe("test@email.com")
    expect(allUsers[0].id).toBe(1)
  });
});

describe("getAllFiltered", () => {
  beforeAll(async () => {
    await db("users").truncate();
    await db("locations").truncate();
    await db("user_locations").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("locations").truncate();
    await db("user_locations").truncate();
  });

  const filterOptions = {
    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false,
    isUsingCurrLocationFilter: false,
    isUsingRelocateToFilter: false,
    selectedWithinMiles: 0,
    chosenLocationLat: 0,
    chosenLocationLon: 0,
    chosenRelocateToObj: {},
    sortChoice: "acending(oldest-newest)",
  };

  it("should return all subscribed users if no filter is being used", async () => {
    const user = userMaker()
    
    await db("users").insert(user);
    await db("users").insert(user);

    const filterOptionsCopy = { ...filterOptions };
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(2);
  });

  it("should return Development users", async () => {
    const user1 = userMaker()
    const user2 = userMaker({area_of_work: "Development"});
    const user3 = userMaker({area_of_work: "Android"});

    await db("users").insert([user1, user2, user3]);

    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isWebDevChecked = true;

    const filteredUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(filteredUsers).toHaveLength(1);
    expect(filteredUsers[0].area_of_work).toBe("Development")
  });

  it("should return Design users", async () => {
    const user1 = userMaker()
    const user2 = userMaker({area_of_work: "Design"});
    const user3 = userMaker({area_of_work: "iOS"});

    await db("users").insert([user1, user2, user3]);

    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUIUXChecked = true;

    const filteredUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(filteredUsers).toHaveLength(1);
    expect(filteredUsers[0].area_of_work).toBe("Design")
  });

  it("should return IOS and Android users", async () => {
    const user1 = userMaker()
    const user2 = userMaker({area_of_work: "Design"});
    const user3 = userMaker({area_of_work: "iOS"});
    const user4 = userMaker({area_of_work: "Android"});

    await db("users").insert([user1, user2, user3, user4]);

    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isIOSChecked = true;
    filterOptionsCopy.isAndroidChecked = true;

    const filteredUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(filteredUsers).toHaveLength(2);
    expect(filteredUsers[0].area_of_work).toBe("iOS")
    expect(filteredUsers[1].area_of_work).toBe("Android")
  });

  // Exclusive/reductive - user must have desired area_of_work
  it("should return empty array if no user has desired area_of_work", async () => {
    const user = userMaker()
    const user2 = userMaker({area_of_work: "Design"});
    const user3 = userMaker({area_of_work: "iOS"});
    
    await db("users").insert([user, user2, user3]);

    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isWebDevChecked = true;

    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(0);
  });

  it("should return users within default 100 miles of Los Angeles", async () => {
    // Los Angeles
    const user1 = userMaker({
      current_location_lat: 34.052235,
      current_location_lon: -118.243683,
    });
    // riverside ~70 miles from LA
    const user2 = userMaker({
      current_location_lat: 33.9806005,
      current_location_lon: -117.3754942,
    });
    // Las Vegas ~250 miles from LA
    const user3 = userMaker({
      current_location_lat: 36.1699412,
      current_location_lon: -115.1398296,
    });

    await db("users").insert([user1, user2, user3]);
    
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    filterOptionsCopy.selectedWithinMiles = 100
    // Los Angeles
    filterOptionsCopy.chosenLocationLat = 34.052235
    filterOptionsCopy.chosenLocationLon = -118.243683
    
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(2);
  });

  it("should return users interested in Los Angeles", async () => {
    const user = userMaker();
    const locations = [
      {location: "Los Angeles, CA, USA"},
      {location: "Boston, MA, USA"},
      {location: "Boulder, CO, USA"}
    ]
    const userLocations = [
      { user_id: 1, location_id: 1 },
      { user_id: 2, location_id: 2 },
      { user_id: 3, location_id: 3 },
      { user_id: 3, location_id: 1 },
    ]

    await db("users").insert([user, user, user])
    await db("locations").insert(locations)
    await db("user_locations").insert(userLocations)

    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingRelocateToFilter = true;
    filterOptionsCopy.chosenRelocateToObj = {
      "Los Angeles, CA, USA": "Los Angeles, CA, USA"
    };
  
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(2);
    expect(testUsers[0].id).toBe(1);
    expect(testUsers[1].id).toBe(3);
  });

  it("should return users interested in Boston or Boulder", async () => {
    const user = userMaker();
    const locations = [
      {location: "Los Angeles, CA, USA"},
      {location: "Boston, MA, USA"},
      {location: "Boulder, CO, USA"}
    ]
    const userLocations = [
      { user_id: 1, location_id: 1 },
      { user_id: 2, location_id: 2 },
      { user_id: 3, location_id: 1 },
      { user_id: 3, location_id: 3 },
    ]

    await db("users").insert([user, user, user])
    await db("locations").insert(locations)
    await db("user_locations").insert(userLocations)

    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingRelocateToFilter = true;
    filterOptionsCopy.chosenRelocateToObj = {
      "Boston, MA, USA": "Boston, MA, USA",
      "Boulder, CO, USA": "Boulder, CO, USA"
    };
  
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(2);
    expect(testUsers[0].id).toBe(2);
    expect(testUsers[1].id).toBe(3);
  });

  // Exclusive/reductive - user must have desired current location 
  // or interested location
  it("should return empty array if no user lives or wants to relocate to LA", async () => {
    const user = userMaker();
    // Las Vegas ~250 miles from LA
    const user2 = userMaker({
      current_location_lat: 36.1699412,
      current_location_lon: -115.1398296,
    });
    const locations = [
      {location: "Los Angeles, CA, USA"},
      {location: "Boston, MA, USA"},
      {location: "Boulder, CO, USA"}
    ]
    const userLocations = [
      { user_id: 1, location_id: 2 },
      { user_id: 2, location_id: 2 },
      { user_id: 3, location_id: 3 },
    ]

    await db("users").insert([user, user, user2])
    await db("locations").insert(locations)
    await db("user_locations").insert(userLocations)

    const filterOptionsCopy = { ...filterOptions };
    // lives within 100miles of Los Angeles
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    filterOptionsCopy.selectedWithinMiles = 100
    filterOptionsCopy.chosenLocationLat = 34.052235
    filterOptionsCopy.chosenLocationLon = -118.243683
    // Interested in Los Angeles
    filterOptionsCopy.isUsingRelocateToFilter = true;
    filterOptionsCopy.chosenRelocateToObj = {
      "Los Angeles, CA, USA": "Los Angeles, CA, USA",
    };
  
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(0);
  });

  it("should return default acending sorted users", async () => {
    const filterOptionsCopy = { ...filterOptions };
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers[0].id).toBe(1);
  });

  it("should return descending sorted users", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.sortChoice = "descending(newest-oldest)";
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers[0].id).toBe(50);
  });

  it("should return 0 users since 0 Design users live close to Boston", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUIUXChecked = true;
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(0);
  });

  it("should return 2 users since 2 Web Dev users live close to Boston", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isWebDevChecked = true;
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(2);
  });

  it("should return 2 users since 2 IOS/Android users live close to Boston", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isIOSChecked = true;
    filterOptionsCopy.isAndroidChecked = true;
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(2);
  });

  it("should return 2 users since 2 IOS/Android users live close to Boston sorted default acending(oldest-newest)", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isIOSChecked = true;
    filterOptionsCopy.isAndroidChecked = true;
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers[0].id).toBe(6);
  });

  it("should return 2 users since 2 IOS/Android users live close to Boston sorted descending(newest-oldest)", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isIOSChecked = true;
    filterOptionsCopy.isAndroidChecked = true;
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    filterOptionsCopy.sortChoice = "descending(newest-oldest)";
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers[0].id).toBe(17);
  });















});

describe("getSingle", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("should return an object containing the user", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    await db("users").insert(user);
    const newUser = await userModel.getSingle(user.email);
    expect(newUser.id).toBe(1);
    expect(newUser.email).toBe(user.email);

    const expectedFullUser = {
      id: 1,
      email: "test@email.com",
      first_name: "Mr. Test",
      additional_skills: null,
      area_of_work: null,
      current_location_lat: null,
      current_location_lon: null,
      current_location_name: null,
      desired_title: null,
      github: null,
      image: null,
      interested_location_names: null,
      last_name: null,
      linkedin: null,
      portfolio: null,
      public_email: null,
      stripe_customer_id: null,
      stripe_subscription_name: null,
      summary: null,
      top_skills: null,
    };
    expect(newUser).toEqual(expectedFullUser);
  });

  it("should be able to accept a users ID or Email", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    await db("users").insert(user);
    const newUserById = await userModel.getSingle(1);
    const newUserByEmail = await userModel.getSingle(user.email);
    expect(newUserById.email).toBe(user.email);
    expect(newUserByEmail.first_name).toBe(user.first_name);
  });

  it("should return undefined if an ID or Email was NOT passed in", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    await db("users").insert(user);
    const newUser = await userModel.getSingle(user.first_name);
    expect(newUser).toBeUndefined;
    const newUser2 = await userModel.getSingle({});
    expect(newUser2).toBeUndefined;
  });
});

describe("update", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("should return number 1 on success of updating user", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    const updateUser = {
      email: "NEWtest@email.com",
    };
    await db("users").insert(user);
    const isSuccessful = await userModel.update(1, updateUser);
    expect(isSuccessful).toBe(1);
  });

  it("should update the user that was added", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    const updateUser = {
      email: "NEWtest@email.com",
    };
    await db("users").insert(user);
    await userModel.update(1, updateUser);
    const updatedUser = await db("users").where({ id: 1 }).first();
    expect(updatedUser.email).not.toBe(user.email);
    expect(updatedUser.email).toBe(updateUser.email);
  });
});

describe("remove", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("should return number 1 on success of removing user", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    await db("users").insert(user);
    const isSuccessful = await userModel.remove(1);
    expect(isSuccessful).toBe(1);
  });

  it("should remove the user that was added", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    const user2 = {
      first_name: "Mr. Test2",
      email: "test2@email.com",
    };
    await db("users").insert(user);
    await db("users").insert(user2);
    await userModel.remove(2);
    const allUsers = await db("users");
    expect(allUsers).toHaveLength(1);
  });
});
