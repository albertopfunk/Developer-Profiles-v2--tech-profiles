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
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("responds with 201 OK and JSON", async () => {
    await request(server)
      .post("/skills-for-review/new")
      .send({ user_id: 1, skill_for_review: "TestSkill" })
      .expect(201)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500 and correct error message", async () => {
    const err = await request(server)
      .post("/skills-for-review/new")
      .send({ user_id: 1, skill_for_review: "TestSkill", accident: "TEST" })
      .expect(500)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Error adding the skill to the database");
  });

  it("responds with 400 and correct error message", async () => {
    let err = await request(server)
      .post("/skills-for-review/new")
      .send({ skill_for_review: "TestSkill" })
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "Expected 'user_id' and 'skill_for_review' in body"
    );
    err = await request(server)
      .post("/skills-for-review/new")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "Expected 'user_id' and 'skill_for_review' in body"
    );
    err = await request(server)
      .post("/skills-for-review/new")
      .send({ user_id: 1, skill_for_reviewS: "TestSkill" })
      .expect(400);
    expect(err.body.message).toBe(
      "Expected 'user_id' and 'skill_for_review' in body"
    );
  });

  it("should return inserted new skill", async () => {
    const newSkill = await request(server).post("/skills-for-review/new").send({
      user_id: 1,
      skill_for_review: "TestSkill",
    });
    expect(newSkill.body.id).toBe(1);
    expect(newSkill.body.skill_for_review).toBe("TestSkill");
  });
});

describe("GET /", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await request(server)
      .get("/skills-for-review")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("returns all skills", async () => {
    let skills = await request(server).get("/skills-for-review");
    expect(skills.body).toHaveLength(0);

    await db("skills_for_review").insert([
      { user_id: 1, skill_for_review: "TestSkill1" },
      { user_id: 1, skill_for_review: "TestSkill2" },
      { user_id: 1, skill_for_review: "TestSkill3" },
      { user_id: 1, skill_for_review: "TestSkill4" },
      { user_id: 1, skill_for_review: "TestSkill5" },
      { user_id: 1, skill_for_review: "TestSkill6" },
      { user_id: 1, skill_for_review: "TestSkill7" },
      { user_id: 1, skill_for_review: "TestSkill8" },
    ]);

    skills = await request(server).get("/skills-for-review");
    expect(skills.body).toHaveLength(8);
  });
});

describe("GET /:id", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill1",
    });
    await request(server)
      .get("/skills-for-review/1")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 404 and correct error message", async () => {
    await db("skills_for_review").insert([
      { user_id: 1, skill_for_review: "TestSkill1" },
      { user_id: 1, skill_for_review: "TestSkill2" },
    ]);

    const err = await request(server)
      .get("/skills-for-review/99")
      .expect(404)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "The skill with the specified ID of '99' does not exist"
    );
  });

  it("should return skill", async () => {
    await db("skills_for_review").insert([
      { user_id: 1, skill_for_review: "TestSkill1" },
      { user_id: 1, skill_for_review: "TestSkill2" },
      { user_id: 1, skill_for_review: "TestSkill3" },
    ]);

    const skill1 = await request(server).get("/skills-for-review/1");
    expect(skill1.body.id).toBe(1);
    expect(skill1.body.skill_for_review).toBe("TestSkill1");
    const skill3 = await request(server).get("/skills-for-review/3");
    expect(skill3.body.id).toBe(3);
    expect(skill3.body.skill_for_review).toBe("TestSkill3");
  });
});

describe("PUT /:id", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill",
    });

    await request(server)
      .put("/skills-for-review/1")
      .send({ skill_for_review: "NEWTestSkill" })
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 400 with correct message", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill",
    });

    let err = await request(server)
      .put("/skills-for-review/1")
      .send({ skill_for_reviewS: "NEWTestSkill" })
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Expected 'skill_for_review' in body");
    err = await request(server)
      .put("/skills-for-review/1")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Expected 'skill_for_review' in body");
  });

  it("responds with 404 and correct error message", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill",
    });

    const err = await request(server)
      .put("/skills-for-review/99")
      .send({ skill_for_review: "NEWTestSkill" })
      .expect(404)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "The skill with the specified ID of '99' does not exist"
    );
  });

  it("updates skill and returns number 1 on success", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill",
    });

    const isSuccessfull = await request(server)
      .put("/skills-for-review/1")
      .send({ skill_for_review: "NEWTestSkill" });
    expect(isSuccessfull.body).toBe(1);

    const updatedSkill = await db("skills_for_review").where({ id: 1 }).first();
    expect(updatedSkill.skill_for_review).toBe("NEWTestSkill");
  });
});

describe("DELETE /:id", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "NEWTestSkill",
    });

    await request(server)
      .delete("/skills-for-review/1")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 404 and correct error message", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "NEWTestSkill",
    });

    const err = await request(server)
      .delete("/skills-for-review/99")
      .expect(404)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "The skill with the specified ID of '99' does not exist"
    );
  });

  it("deletes skill and returns number 1 on success", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "NEWTestSkill",
    });
    let skills = await db("skills_for_review");
    expect(skills).toHaveLength(1);
    const isSuccessful = await request(server).delete("/skills-for-review/1");
    expect(isSuccessful.body).toBe(1);
    skills = await db("skills_for_review");
    expect(skills).toHaveLength(0);
  });
});
