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
    expect(user.email).toBe("test@email.com");
    expect(user.first_name).toBe("Mr. Test");
  });
});

// describe("getAll", () => {
// beforeEach(async () => {
//   await db("users").truncate();
// });
//   it("should return an array of objects", async () => {
//     const users = await userModel.getAll();
//   });
// });

// describe("getSingle", () => {
// beforeEach(async () => {
//   await db("users").truncate();
// });

//   it("should return an object containing the user", async () => {
//     const user = {
//       first_name: "Mr. Test",
//       email: "test@email.com"
//     };
//     await userModel.insert(user);
//     const user = await userModel.getSingle(user.email);
//   });
// });

// describe("update", () => {
// beforeEach(async () => {
//   await db("users").truncate();
// });

//   it("should return an array of objects", async () => {
//     const users = await userModel.getAll();
//   });
// });

// describe("remove", () => {
// beforeEach(async () => {
//   await db("users").truncate();
// });

//   it("should return an array of objects", async () => {
//     const users = await userModel.getAll();
//   });
// });
