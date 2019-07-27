const userModel = require("./userModel");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

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
      email: "test@email.com"
    });
    await userModel.insert({
      first_name: "Mr. Test2",
      email: "test@email2.com"
    });
    const users = await db("users");
    expect(users).toHaveLength(2);
  });

  it("should insert and return provided user", async () => {
    const user = await userModel.insert({
      first_name: "Mr. Test",
      email: "test@email.com"
    });
    expect(user.id).toBe(1);
    expect(user.email).toBe("test@email.com");
    expect(user.first_name).toBe("Mr. Test");

    const user2 = await userModel.insert({
      first_name: "Mr. Test2",
      email: "test@email2.com"
    });
    expect(user2.id).toBe(2);
    expect(user2.email).toBe("test@email2.com");
    expect(user2.first_name).toBe("Mr. Test2");

    const expectedFullUser2 = {
      id: 2,
      email: "test@email2.com",
      first_name: "Mr. Test2",
      additional_skills: null,
      area_of_work: null,
      badge: null,
      badgeURL: null,
      current_location_lat: null,
      current_location_lon: null,
      current_location_name: null,
      desired_title: null,
      familiar_skills: null,
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
      top_skills: null
    };
    expect(user2).toEqual(expectedFullUser2);
  });

  it("should accept any column of the user table", async () => {
    const user = {
      github: "theTestUser"
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

  it("should return all users", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    const user2 = {
      first_name: "Mr. Test2",
      email: "test2@email.com"
    };
    await db("users").insert(user);
    await db("users").insert(user2);
    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(2);
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
      email: "test@email.com"
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
      badge: null,
      badgeURL: null,
      current_location_lat: null,
      current_location_lon: null,
      current_location_name: null,
      desired_title: null,
      familiar_skills: null,
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
      top_skills: null
    };
    expect(newUser).toEqual(expectedFullUser);
  });

  it("should be able to accept a users ID or Email", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
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
      email: "test@email.com"
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
      email: "test@email.com"
    };
    const updateUser = {
      email: "NEWtest@email.com"
    };
    await db("users").insert(user);
    const isSuccessful = await userModel.update(1, updateUser);
    expect(isSuccessful).toBe(1);
  });

  it("should update the user that was added", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    const updateUser = {
      email: "NEWtest@email.com"
    };
    await db("users").insert(user);
    await userModel.update(1, updateUser);
    const updatedUser = await db("users")
      .where({ id: 1 })
      .first();
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
      email: "test@email.com"
    };
    await db("users").insert(user);
    const isSuccessful = await userModel.remove(1);
    expect(isSuccessful).toBe(1);
  });

  it("should remove the user that was added", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    const user2 = {
      first_name: "Mr. Test2",
      email: "test2@email.com"
    };
    await db("users").insert(user);
    await db("users").insert(user2);
    await userModel.remove(2);
    const allUsers = await db("users");
    expect(allUsers).toHaveLength(1);
  });
});
