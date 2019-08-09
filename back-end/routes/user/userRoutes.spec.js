const request = require("supertest");
const server = require("../../api/server");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("POST /new", () => {
  beforeAll(async () => {
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
    await request(server)
      .post("/users/new")
      .send({})
      .expect(201)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500 and correct error message", async () => {
    const err = await request(server)
      .post("/users/new")
      .send({ emailS: "test@test.com" })
      .expect(500);
    expect(err.body.message).toBe("Error adding the user to the database");
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
  beforeAll(async () => {
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

  it("returns all 8 users", async () => {
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

  it("returns a max of 14 users", async () => {
    let users = await request(server).get("/users");
    expect(users.body).toHaveLength(0);

    let usersArr = [];
    for (let i = 0; i < 25; i++) {
      usersArr.push({ email: `hello${i}@mail.com` });
    }

    await db("users").insert(usersArr);

    users = await request(server).get("/users");
    expect(users.body).toHaveLength(14);
  });
});

describe("POST /infinite/:usersPage", () => {});

describe("GET /:id", () => {
  beforeAll(async () => {
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

  it("responds with 404 and correct error message", async () => {
    await db("users").insert({ email: "test@test.com" });

    await request(server)
      .get("/users/testR@test.com")
      .expect(404);

    const err = await request(server)
      .get("/users/99")
      .expect(404);
    expect(err.body.message).toBe(
      "The user with the specified ID of '99' does not exist"
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
  beforeAll(async () => {
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

  it("responds with 500 and correct error message", async () => {
    await db("users").insert({ email: "test@test.com" });

    const err = await request(server)
      .put("/users/1")
      .send({ emailS: "testNEW@test.com" })
      .expect(500);
    expect(err.body.message).toBe("The user information could not be modified");
  });

  it("responds with 404 and correct error message", async () => {
    await db("users").insert({ email: "test@test.com" });

    const err = await request(server)
      .put("/users/99")
      .send({ email: "testNEW@test.com" })
      .expect(404);
    expect(err.body.message).toBe(
      "The user with the specified ID of '99' does not exist"
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
  beforeAll(async () => {
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

  it("responds with 404 and correct error message", async () => {
    await db("users").insert({ email: "test@test.com" });

    const err = await request(server)
      .delete("/users/99")
      .expect(404);
    expect(err.body.message).toBe(
      "The user with the specified ID of '99' does not exist"
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
