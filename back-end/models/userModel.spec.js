const userModel = require("./userModel");
const db = require("../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("insert", () => {
  beforeEach(async () => {
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
    const users = await userModel.getAll();
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
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("should return an array", async () => {
    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(0);
  });

  it("should return all inserted users", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    const user2 = {
      first_name: "Mr. Test2",
      email: "test2@email.com"
    };
    await userModel.insert(user);
    await userModel.insert(user2);
    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(2);
  });
});

describe("getSingle", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("should return an object containing the user", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    await userModel.insert(user);
    const newUser = await userModel.getSingle(user.email);
    expect(newUser.email).toBe(user.email);
  });
  
  it('should be able to accept a users ID or Email', async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    await userModel.insert(user);
    const newUserById = await userModel.getSingle(1);
    const newUserByEmail = await userModel.getSingle(user.email);
    expect(newUserById.email).toBe(user.email);
    expect(newUserByEmail.first_name).toBe(user.first_name);
  });
});

describe("update", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("should return number 1 on success of updating user", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    const updateUser = {
      email: "NEWtest@email.com"
    }
    await userModel.insert(user);
    const userToUpdate = await userModel.getSingle(user.email);
    const isSuccessful = await userModel.update(userToUpdate.id, updateUser);
    expect(isSuccessful).toBe(1);
  });
  
  it("should update the user that was added", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    const updateUser = {
      email: "NEWtest@email.com"
    }
    await userModel.insert(user);
    const userToUpdate = await userModel.getSingle(user.email);
    await userModel.update(userToUpdate.id, updateUser);
    const updatedUser = await userModel.getSingle(1);
    expect(updatedUser.email).not.toBe(user.email);
    expect(updatedUser.email).toBe(updateUser.email);
  });
});

describe("remove", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("should return number 1 on success of removing user", async () => {
    const user = {
      first_name: "Mr. Test",
      email: "test@email.com"
    };
    await userModel.insert(user);
    const userToRemove = await userModel.getSingle(user.email);
    const isSuccessful = await userModel.remove(userToRemove.id);
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
    await userModel.insert(user);
    await userModel.insert(user2);
    const userToRemove = await userModel.getSingle(user.email);
    await userModel.remove(userToRemove.id);
    const allUsers = await userModel.getAll();
    expect(allUsers).toHaveLength(1);
  });
});
