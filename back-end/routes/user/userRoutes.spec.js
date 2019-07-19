const request = require("supertest");
const server = require("../../api/server");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("POST /", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("responds with 201 OK", async () => {
    await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" })
      .expect(201);
  });

  it("Should return the added user", async () => {
    const addUser = await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" });
    expect(addUser.body.email).toEqual("test@test.com");
  });
});

describe("GET /", () => {
  it("responds with 200 OK", async () => {
    await request(server)
      .get("/users")
      .expect(200);
  });
});

describe("GET /:id", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("responds with 200 OK", async () => {
    await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" });
    await request(server)
      .get("/users/test@test.com")
      .expect(200);
    await request(server)
      .get("/users/1")
      .expect(200);
  });

  it("Should return the user", async () => {
    await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" });
    const user = await request(server).get("/users/1");
    expect(user.body.email).toEqual("test@test.com");
  });
});

describe("PUT /:id", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("updates user", async () => {
    await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" });
    const user = await request(server).get("/users/1");
    expect(user.body.email).toEqual("test@test.com");
    await request(server)
      .put("/users/1")
      .send({ email: "testNEW@test.com" });
    const updatedUser = await request(server).get("/users/1");
    expect(updatedUser.body.email).toEqual("testNEW@test.com");
  });
});

describe("DELETE /:id", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("deletes user", async () => {
    await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" });
    const users = await request(server).get("/users");
    expect(users.body).toHaveLength(1);
    await request(server).delete("/users/1");
    const updatedUsers = await request(server).get("/users");
    expect(updatedUsers.body).toHaveLength(0);
  });
});
