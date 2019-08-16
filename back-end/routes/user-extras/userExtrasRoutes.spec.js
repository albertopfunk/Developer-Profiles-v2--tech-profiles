const request = require("supertest");
const server = require("../../api/server");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("POST /new/:user_extra", () => {
  beforeAll(async () => {
    await db("users").truncate();
    await db("experience").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("experience").truncate();
  });

  it("responds with 201 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });

    await request(server)
      .post("/extras/new/experience")
      .send({ user_id: 1 })
      .expect(201)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newExperience = {
      user_id: 1,
      company_nameS: "TestCompany"
    };

    const err = await request(server)
      .post("/extras/new/experience")
      .send(newExperience)
      .expect(500);
    expect(err.body.message).toBe(
      "Error adding the user's 'experience' to the database"
    );
  });

  it("responds with 400 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });

    let err = await request(server)
      .post("/extras/new/experienceZ")
      .send({ user_id: 1 })
      .expect(400);
    expect(err.body.message).toBe(
      `Expected 'projects' or  'education', or 'experience' in parameters, received 'experienceZ'`
    );

    err = await request(server)
      .post("/extras/new/experience")
      .send({ user_idZ: 1 })
      .expect(400);
    expect(err.body.message).toBe("Expected 'user_id' in body");

    err = await request(server)
      .post("/extras/new/experience")
      .send({})
      .expect(400);
    expect(err.body.message).toBe("Expected 'user_id' in body");
  });

  it("should return inserted user extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newExperience = {
      user_id: 1,
      company_name: "TestCompany"
    };

    const newUserExtra = await request(server)
      .post("/extras/new/experience")
      .send(newExperience);
    expect(newUserExtra.body.company_name).toBe(newExperience.company_name);
  });
});

describe("GET /:user_id/:user_extra", () => {
  beforeAll(async () => {
    await db("users").truncate();
    await db("projects").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("projects").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    await request(server)
      .get("/extras/1/projects")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 400 and correct error message if user extra is incorrect", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    const err = await request(server)
      .get("/extras/1/projectss")
      .expect(400);
    expect(err.body.message).toBe(
      "Expected 'projects' or  'education', or 'experience' in parameters, received 'projectss'"
    );
  });

  it("responds with 200 and empty array if user ID is invalid", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });
    const invalidID = await request(server)
      .get("/extras/999/projects")
      .expect(200);
    expect(invalidID.body).toHaveLength(0);
  });

  it("responds with 200 and empty array if user extra is empty", async () => {
    await db("users").insert({ email: "test@email.com" });
    const emptyUserExtra = await request(server)
      .get("/extras/1/projects")
      .expect(200);
    expect(emptyUserExtra.body).toHaveLength(0);
  });

  it("should return all items of specified user's extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert([
      { user_id: 1 },
      { user_id: 1 },
      { user_id: 1 }
    ]);

    userExtras = await request(server).get("/extras/1/projects");
    expect(userExtras.body).toHaveLength(3);
  });
});

describe("GET /single/:user_extra/:user_extra_id", () => {
  beforeAll(async () => {
    await db("users").truncate();
    await db("education").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("education").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });
    await request(server)
      .get("/extras/single/education/1")
      .expect(200)
      .expect("content-type", /json/i);
  });

  it("responds with 400 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([
      { user_id: 1, school: "TestSchool1" },
      { user_id: 1, school: "TestSchool2" },
      { user_id: 1, school: "TestSchool3" }
    ]);

    const err = await request(server)
      .get("/extras/single/educationS/2")
      .expect(400);
    expect(err.body.message).toBe(
      "Expected 'projects' or  'education', or 'experience' in parameters, received 'educationS'"
    );
  });

  it("should return 404 with correct message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([
      { user_id: 1, school: "TestSchool1" },
      { user_id: 1, school: "TestSchool2" },
      { user_id: 1, school: "TestSchool3" }
    ]);

    const err = await request(server)
      .get("/extras/single/education/99")
      .expect(404);
    expect(err.body.message).toBe(
      "The user's 'education' with the specified ID of '99' does not exist"
    );
  });

  it("should return single user extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([
      { user_id: 1, school: "TestSchool1" },
      { user_id: 1, school: "TestSchool2" },
      { user_id: 1, school: "TestSchool3" }
    ]);

    const userExtras = await request(server)
      .get("/extras/single/education/2")
      .expect(200)
      .expect("Content-Type", /json/i);
    expect(userExtras.body.school).toBe("TestSchool2");
  });
});

describe("PUT /:user_extra/:user_extra_id", () => {
  beforeAll(async () => {
    await db("users").truncate();
    await db("education").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("education").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });

    await request(server)
      .put("/extras/education/1")
      .send({ school: "TestSchool" })
      .expect(200)
      .expect("content-type", /json/i);
  });

  it("responds with 400 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });

    const err = await request(server)
      .put("/extras/educationS/1")
      .send({ school: "TestSchool" })
      .expect(400);
    expect(err.body.message).toBe(
      "Expected 'projects' or  'education', or 'experience' in parameters, received 'educationS'"
    );
  });

  it("should return 404 with correct message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });

    const err = await request(server)
      .put("/extras/education/99")
      .send({ school: "TestSchool" })
      .expect(404);
    expect(err.body.message).toBe(
      "The user's 'education' with the specified ID of '99' does not exist"
    );
  });

  it("should return the updated user extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });
    const update = {
      school: "TestSchool",
      field_of_study: "TestDeveloper"
    };
    const updatedEducation = await request(server)
      .put("/extras/education/1")
      .send(update);
    expect(updatedEducation.body.school).toBe("TestSchool");
  });
});

describe("DELETE /:user_extra/:user_extra_id", () => {
  beforeAll(async () => {
    await db("users").truncate();
    await db("projects").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("projects").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });
    await request(server)
      .delete("/extras/projects/1")
      .expect(200)
      .expect("content-type", /json/i);
  });

  it("responds with 400 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    const err = await request(server)
      .delete("/extras/projectsS/1")
      .expect(400);
    expect(err.body.message).toBe(
      "Expected 'projects' or  'education', or 'experience' in parameters, received 'projectsS'"
    );
  });

  it("responds with 404 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    const err = await request(server)
      .delete("/extras/projects/99")
      .expect(404);
    expect(err.body.message).toBe(
      "The user's 'projects' with the specified ID of '99' does not exist"
    );
  });

  it("deletes user extra and returns number 1 on success", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert([{ user_id: 1 }, { user_id: 1 }]);
    let userExtras = await db("projects").where({ user_id: 1 });
    expect(userExtras).toHaveLength(2);
    const isSuccessful = await request(server).delete("/extras/projects/1");
    expect(isSuccessful.body).toBe(1);
    userExtras = await db("projects").where({ user_id: 1 });
    expect(userExtras).toHaveLength(1);
  });
});
