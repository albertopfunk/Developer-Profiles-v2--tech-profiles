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
  afterEach(async () => {
    await db("users").truncate();
  });

  it("responds with 201 OK and JSON", async () => {
    await request(server)
      .post("/users/new")
      .send({ email: "test@test.com" })
      .expect(201)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500 server error", async () => {
    await request(server)
      .post("/users/new")
      .send({ emailS: "test@test.com" })
      .expect(500);
  });

  it("should return inserted new user if emails do not match", async () => {
    const user = await request(server)
      .post("/users/new")
      .send({
        first_name: "Mr. Test",
        last_name: "Testington",
        github: "theTester",
        email: "test@email.com"
      });
    expect(user.body.id).toBe(1);
    expect(user.body.email).toEqual("test@email.com");
    expect(user.body.github).toBe("theTester");

    const userWithDifferentEmail = await request(server)
      .post("/users/new")
      .send({
        first_name: "Mr. Test",
        last_name: "Testington",
        github: "theTesterNEW",
        email: "testNEW@email.com"
      });
    expect(userWithDifferentEmail.body.id).toBe(2);
    expect(userWithDifferentEmail.body.email).toEqual("testNEW@email.com");
    expect(userWithDifferentEmail.body.github).toBe("theTesterNEW");
  });

  it("should return existing user if emails match", async () => {
    const user = await request(server)
      .post("/users/new")
      .send({
        first_name: "Mr. Test",
        last_name: "Testington",
        github: "theTester",
        email: "test@email.com"
      });
    expect(user.body.id).toBe(1);
    expect(user.body.email).toEqual("test@email.com");
    expect(user.body.github).toBe("theTester");

    const userWithSameEmail = await request(server)
      .post("/users/new")
      .send({
        first_name: "Mr. Test",
        last_name: "Testington",
        github: "theTesterNEW",
        email: "test@email.com"
      });
    expect(userWithSameEmail.body.id).toBe(1);
    expect(userWithSameEmail.body.email).toEqual("test@email.com");
    expect(userWithSameEmail.body.github).toBe("theTester");
  });
});

describe("GET /", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await request(server)
      .get("/users")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("returns all users", async () => {
    let users = await request(server).get("/users");
    expect(users.body).toHaveLength(0);

    await db("users").insert([
      { email: "hello1@mail.com" },
      { email: "hello2@mail.com" },
      { email: "hello3@mail.com" },
      { email: "hello4@mail.com" },
      { email: "hello5@mail.com" },
      { email: "hello6@mail.com" },
      { email: "hello7@mail.com" },
      { email: "hello8@mail.com" }
    ]);

    users = await request(server).get("/users");
    expect(users.body).toHaveLength(8);
  });
});

describe("GET /:id", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@test.com" });

    await request(server)
      .get("/users/test@test.com")
      .expect(200)
      .expect("Content-Type", /json/i);
    await request(server)
      .get("/users/1")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 404 Error", async () => {
    await db("users").insert({ email: "test@test.com" });

    await request(server)
      .get("/users/testR@test.com")
      .expect(404);

    const err = await request(server)
      .get("/users/0")
      .expect(404);
    expect(err.body.message).toBe(
      "The user with the specified ID does not exist"
    );
  });

  it("Should return the user by email", async () => {
    await db("users").insert({ email: "test@test.com" });
    const user = await request(server).get("/users/test@test.com");
    expect(user.body.email).toEqual("test@test.com");
  });

  it("Should return the user by ID", async () => {
    await db("users").insert({ email: "test@test.com" });
    const user = await request(server).get("/users/1");
    expect(user.body.email).toEqual("test@test.com");
  });

  it("Should only accept email or ID", async () => {
    await db("users").insert({ email: "test@test.com", github: "TheTester" });
    await request(server)
      .get("/users/TheTester")
      .expect(404);
  });
});

describe("PUT /:id", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@test.com" });

    await request(server)
      .put("/users/1")
      .send({ email: "testNEW@test.com" })
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500", async () => {
    await db("users").insert({ email: "test@test.com" });

    await request(server)
      .put("/users/1")
      .send({ emailS: "testNEW@test.com" })
      .expect(500);
  });

  it("responds with 404", async () => {
    await db("users").insert({ email: "test@test.com" });

    const err = await request(server)
      .put("/users/test@test.com")
      .send({ email: "testNEW@test.com" })
      .expect(404);
    expect(err.body.message).toBe(
      "The user with the specified ID does not exist"
    );
  });

  it("updates user and returns number 1 on success", async () => {
    await db("users").insert({ email: "test@test.com" });
    const user = await db("users")
      .where({ id: 1 })
      .first();
    expect(user.email).toEqual("test@test.com");
    const isSuccessful = await request(server)
      .put("/users/1")
      .send({ email: "testNEW@test.com" });
    const updatedUser = await db("users")
      .where({ id: 1 })
      .first();
    expect(isSuccessful.body).toBe(1);
    expect(updatedUser.email).toEqual("testNEW@test.com");
  });
});

describe("DELETE /:id", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@test.com" });

    await request(server)
      .delete("/users/1")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 404", async () => {
    await db("users").insert({ email: "test@test.com" });

    const err = await request(server)
      .delete("/users/test@test.com")
      .expect(404);
    expect(err.body.message).toBe(
      "The user with the specified ID does not exist"
    );
  });

  it("deletes user and returns number 1 on success", async () => {
    await db("users").insert({ email: "test@test.com" });
    const users = await db("users");
    expect(users).toHaveLength(1);
    const isSuccessful = await request(server).delete("/users/1");
    const updatedUsers = await db("users");
    expect(isSuccessful.body).toBe(1);
    expect(updatedUsers).toHaveLength(0);
  });
});
