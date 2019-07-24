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
    const newExperience = {
      user_id: 1,
      company_name: "TestCompany"
    };

    await request(server)
      .post("/extras/new/experience")
      .send(newExperience)
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

  it("responds with 500 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    const err = await request(server)
      .get("/extras/1/projectss")
      .expect(500);
    expect(err.body.message).toBe(
      "The user's 'projectss' could not be retrieved"
    );
  });

  it("should return 400 if user ID is invalid", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });
    const invalidID = await request(server)
      .get("/extras/999/projects")
      .expect(400);
    expect(invalidID.body.message).toBe(
      "Error finding user's 'projects', check user id or add a user 'projects'"
    );
  });

  it("should return 400 if user extra is empty", async () => {
    await db("users").insert({ email: "test@email.com" });
    const emptyUserExtra = await request(server)
      .get("/extras/1/projects")
      .expect(400);
    expect(emptyUserExtra.body.message).toBe(
      "Error finding user's 'projects', check user id or add a user 'projects'"
    );
  });

  it("should return all items in user's extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert([
      { user_id: 1 },
      { user_id: 1 },
      { user_id: 1 }
    ]);

    userExtras = await request(server)
      .get("/extras/1/projects")
      .expect(200)
      .expect("Content-Type", /json/i);
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

  it("responds with 500 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([
      { user_id: 1, school: "TestSchool1" },
      { user_id: 1, school: "TestSchool2" },
      { user_id: 1, school: "TestSchool3" }
    ]);

    const userExtras = await request(server)
      .get("/extras/single/educationS/2")
      .expect(500);
    expect(userExtras.body.message).toBe(
      "The user's 'educationS' could not be retrieved"
    );
  });

  it("should return 404 with correct message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([
      { user_id: 1, school: "TestSchool1" },
      { user_id: 1, school: "TestSchool2" },
      { user_id: 1, school: "TestSchool3" }
    ]);

    const userExtras = await request(server)
      .get("/extras/single/education/99")
      .expect(404);
    expect(userExtras.body.message).toBe(
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

  it("responds with 500 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });

    const err = await request(server)
      .put("/extras/educationS/1")
      .send({ school: "TestSchool" })
      .expect(500);
    expect(err.body.message).toBe(
      "The user's 'educationS' could not be modified"
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

  it("responds with 500 and correct error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    const err = await request(server)
      .delete("/extras/projectsS/1")
      .expect(500);
    expect(err.body.message).toBe(
      "The user's 'projectsS' could not be removed"
    );
  });

  it("should return 404 with correct message", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });

    const err = await request(server)
      .delete("/extras/projects/99")
      .expect(404);
    expect(err.body.message).toBe(
      "The user's 'projects' with the specified ID of '99' does not exist"
    );
  });

  it("should remove user extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert([{ user_id: 1 }, { user_id: 1 }]);
    let userExtras = await db("projects").where({ user_id: 1 });
    expect(userExtras).toHaveLength(2);
    await request(server).delete("/extras/projects/1");
    userExtras = await db("projects").where({ user_id: 1 });
    expect(userExtras).toHaveLength(1);
  });
});
