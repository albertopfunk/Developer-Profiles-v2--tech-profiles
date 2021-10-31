const userModel = require("./userModel");
const testUsers = require("../../helpers/testUsers");
const db = require("../../data/dbConfig");

describe("insert", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("should insert users", async () => {
    await userModel.insert({
      first_name: "Mr. Test",
      email: "test@email.com",
    });
    await userModel.insert({
      first_name: "Mr. Test2",
      email: "test@email2.com",
    });
    const users = await db("users");
    expect(users).toHaveLength(2);
  });

  it("should insert and return provided user", async () => {
    const user = await userModel.insert({
      first_name: "Mr. Test",
      email: "test@email.com",
    });
    expect(user.id).toBe(1);
    expect(user.email).toBe("test@email.com");
    expect(user.first_name).toBe("Mr. Test");

    const user2 = await userModel.insert({
      first_name: "Mr. Test2",
      email: "test@email2.com",
    });
    expect(user2.id).toBe(2);
    expect(user2.email).toBe("test@email2.com");
    expect(user2.first_name).toBe("Mr. Test2");

    const expectedFullUser2 = {
      id: 2,
      email: "test@email2.com",
      first_name: "Mr. Test2",
      last_name: null,
      public_email: null,
      profile_image: null,
      avatar_image: null,
      area_of_work: null,
      desired_title: null,
      summary: null,
      current_location_lat: null,
      current_location_lon: null,
      current_location_name: null,
      twitter: null,
      github: null,
      linkedin: null,
      portfolio: null,
      top_skills_prev: null,
      additional_skills_prev: null,
      stripe_customer_id: null,
      stripe_subscription_name: null,
    };
    expect(user2).toEqual(expectedFullUser2);
  });

  it("should accept any column of the user table", async () => {
    const user = {
      github: "theTestUser",
    };
    const newUser = await userModel.insert(user);
    expect(newUser.id).toBe(1);
    expect(newUser.github).toBe(user.github);
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
    const unSubscribedUser = {
      first_name: "Mr. Test",
      email: "test@email.com",
    };
    const subscribedUser = {
      first_name: "Mr. Test2",
      email: "test2@email.com",
      stripe_subscription_name: "subscribed"
    };
    await db("users").insert(unSubscribedUser);
    await db("users").insert(subscribedUser);
    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(1);
  });
});

describe("getAllFiltered", () => {
  beforeAll(async () => {
    await db("users").truncate();
  });
  afterAll(async () => {
    await db("users").truncate();
  });

  const filterOptions = {
    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false,
    isUsingCurrLocationFilter: false,
    isUsingRelocateToFilter: false,
    // boston
    selectedWithinMiles: 500,
    chosenLocationLat: 42.361145,
    chosenLocationLon: -71.057083,
    chosenRelocateTo: "Boston, MA, USA",
    sortChoice: "acending(oldest-newest)",
  };

  let users = [...testUsers.usersData];
  users = users.map((user) => {
    user.current_location_lat = +user.current_location_lat;
    user.current_location_lon = +user.current_location_lon;
    return user;
  });

  // testUsers:
  // ids 1-50
  // 18 Dev
  // 9 Design
  // 11 IOS
  // 12 Android
  // users within 500 miles of Boston = 4(boston)
  // users within 50 miles of Los Angeles = 7(LA,Calabasas)
  // users interested in relocating to Boston = 10
  // users interested in relocating to Boulder = 7
  // --------------

  it("should set up DB", async () => {
    let splitUsers;
    splitUsers = users.slice(0, 20);
    await db("users").insert(splitUsers);
    splitUsers = users.slice(20, 40);
    await db("users").insert(splitUsers);
    splitUsers = users.slice(40, 50);
    await db("users").insert(splitUsers);
    const testUsers = await db("users");
    expect(testUsers).toHaveLength(50);
  });

  it("should return all users if all filters are NOT being used", async () => {
    const filterOptionsCopy = { ...filterOptions };
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(50);
  });

  it("should return Web Dev users if checkbox is checked", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isWebDevChecked = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(18);
  });

  it("should return UIUX users if checkbox is checked", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUIUXChecked = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(9);
  });

  it("should return IOS/Android users if checkboxes are checked", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isIOSChecked = true;
    filterOptionsCopy.isAndroidChecked = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(23);
  });

  it("should return users within default 500 miles of default Boston", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(4);
  });

  it("should return users within 50 miles of Los Angeles", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.selectedWithinMiles = 50;
    filterOptionsCopy.chosenLocationLat = 34.052235;
    filterOptionsCopy.chosenLocationLon = -118.243683;
    filterOptionsCopy.isUsingCurrLocationFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(7);
  });

  it("should return users interested in default Boston", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.isUsingRelocateToFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(10);
  });

  it("should return users interested in Boulder", async () => {
    const filterOptionsCopy = { ...filterOptions };
    filterOptionsCopy.chosenRelocateTo = "Boulder, CO, USA";
    filterOptionsCopy.isUsingRelocateToFilter = true;
    const testUsers = await userModel.getAllFiltered(filterOptionsCopy);
    expect(testUsers).toHaveLength(7);
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
