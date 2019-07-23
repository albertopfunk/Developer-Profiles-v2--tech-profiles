const request = require("supertest");
const server = require("../../api/server");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("POST /new/:user_extra", () => {
  beforeEach(async () => {
    await db("users").truncate();
    await db("projects").truncate();
    await db("education").truncate();
    await db("experience").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("projects").truncate();
    await db("education").truncate();
    await db("experience").truncate();
  });

  it("responds with 201 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newEducation = {
      user_id: 1,
      school: "TestSchool"
    };

    await request(server)
      .post("/extras/new/education")
      .send(newEducation)
      .expect(201)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500 server error", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newEducation = {
      user_id: 1,
      school: "TestSchool"
    };
    const newExperience = {
      user_id: 1,
      school: "TestWorkExperience"
    };

    await request(server)
      .post("/extras/new/educations")
      .send(newEducation)
      .expect(500);

    await request(server)
      .post("/extras/new/experience")
      .send(newExperience)
      .expect(500);
  });

  it("should return the correct 500 error message", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newProject = {
      user_id: 1,
      project_titleS: "TestProject"
    };

    const err = await request(server)
      .post("/extras/new/projects")
      .send(newProject);
    expect(err.body.message).toBe(
      "Error adding the user's 'projects' to the database"
    );
  });

  it("should return inserted user extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newEducation = {
      user_id: 1,
      school: "TestSchool"
    };

    const newUserExtra = await request(server)
      .post("/extras/new/education")
      .send(newEducation);
    expect(newUserExtra.body.school).toBe(newEducation.school);
  });
});

describe("GET /:user_id/:user_extra", () => {
  beforeEach(async () => {
    await db("users").truncate();
    await db("projects").truncate();
    await db("education").truncate();
    await db("experience").truncate();
  });
  afterEach(async () => {
    await db("users").truncate();
    await db("projects").truncate();
    await db("education").truncate();
    await db("experience").truncate();
  });

  it("responds with 201 OK and JSON", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });

    await request(server)
      .get("/extras/1/education")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });

    await request(server)
      .get("/extras/1/educations")
      .expect(500)
      .expect("Content-Type", /json/i);
  });

  it("should return 400 if user ID is invalid", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });
    const invalidID = await request(server)
      .get("/extras/999/education")
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(invalidID.body.message).toBe(
      "Error finding user's 'education', check user id or add a user 'education'"
    );
  });

  it("should return 400 if user extra is empty", async () => {
    await db("users").insert({ email: "test@email.com" });
    const emptyUserExtra = await request(server)
      .get("/extras/1/projects")
      .expect(400)
      .expect("Content-Type", /json/i);
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
