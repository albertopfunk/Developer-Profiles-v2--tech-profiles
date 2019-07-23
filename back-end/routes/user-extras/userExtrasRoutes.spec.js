const request = require("supertest");
const server = require("../../api/server");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("POST /:user_extras", () => {
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

  it("should return user extra", async () => {
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
