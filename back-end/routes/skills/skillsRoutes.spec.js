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
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("responds with 201 OK and JSON", async () => {
    await request(server)
      .post("/skills/new")
      .send({ skill: "TestSkill" })
      .expect(201)
      .expect("Content-Type", /json/i);
  });

  it("responds with 500 and correct error message", async () => {
    const err = await request(server)
      .post("/skills/new")
      .send({ skill: "TestSkill", accident: "TEST" })
      .expect(500)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Error adding the skill to the database");
  });

  it("responds with 400 and correct error message", async () => {
    let err = await request(server)
      .post("/skills/new")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Expected 'skill' in body");
    err = await request(server)
      .post("/skills/new")
      .send({ skillS: "TestSkill" })
      .expect(400);
    expect(err.body.message).toBe("Expected 'skill' in body");
  });

  it("should return inserted new skill", async () => {
    const newSkill = await request(server)
      .post("/skills/new")
      .send({ skill: "TestSkill" });
    expect(newSkill.body.id).toBe(1);
    expect(newSkill.body.skill).toBe("TestSkill");
  });
});

describe("GET /", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await request(server)
      .get("/skills")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("returns all skills", async () => {
    let skills = await request(server).get("/skills");
    expect(skills.body).toHaveLength(0);

    await db("skills").insert([
      { skill: "TestSkill1" },
      { skill: "TestSkill2" },
      { skill: "TestSkill3" },
      { skill: "TestSkill4" },
      { skill: "TestSkill5" },
      { skill: "TestSkill6" },
      { skill: "TestSkill7" },
      { skill: "TestSkill8" }
    ]);

    skills = await request(server).get("/skills");
    expect(skills.body).toHaveLength(8);
  });
});

describe("GET /:id", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("skills").insert({ skill: "TestSkill1" });
    await request(server)
      .get("/skills/1")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 404 and correct error message", async () => {
    await db("skills").insert([
      { skill: "TestSkill1" },
      { skill: "TestSkill2" }
    ]);

    const err = await request(server)
      .get("/skills/99")
      .expect(404)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "The skill with the specified ID of '99' does not exist"
    );
  });

  it("should return skill", async () => {
    await db("skills").insert([
      { skill: "TestSkill1" },
      { skill: "TestSkill2" },
      { skill: "TestSkill3" }
    ]);

    const skill1 = await request(server).get("/skills/1");
    expect(skill1.body.id).toBe(1);
    expect(skill1.body.skill).toBe("TestSkill1");
    const skill3 = await request(server).get("/skills/3");
    expect(skill3.body.id).toBe(3);
    expect(skill3.body.skill).toBe("TestSkill3");
  });
});

describe("PUT /:id", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("skills").insert({ skill: "TestSkill" });

    await request(server)
      .put("/skills/1")
      .send({ skill: "NEWTestSkill" })
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 400 with correct message", async () => {
    await db("skills").insert({ skill: "TestSkill" });

    let err = await request(server)
      .put("/skills/1")
      .send({ skillZ: "NEWTestSkill" })
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Expected 'skill' in body");
    err = await request(server)
      .put("/skills/1")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe("Expected 'skill' in body");
  });

  it("responds with 404 and correct error message", async () => {
    await db("skills").insert({ skill: "TestSkill" });

    const err = await request(server)
      .put("/skills/99")
      .send({ skill: "NEWTestSkill" })
      .expect(404)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "The skill with the specified ID of '99' does not exist"
    );
  });

  it("updates skill and returns number 1 on success", async () => {
    await db("skills").insert({ skill: "TestSkill" });

    const isSuccessfull = await request(server)
      .put("/skills/1")
      .send({ skill: "NEWTestSkill" });
    expect(isSuccessfull.body).toBe(1);

    const updatedSkill = await db("skills")
      .where({ id: 1 })
      .first();
    expect(updatedSkill.skill).toBe("NEWTestSkill");
  });
});

describe("DELETE /:id", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("responds with 200 OK and JSON", async () => {
    await db("skills").insert({ skill: "TestSkill" });

    await request(server)
      .delete("/skills/1")
      .expect(200)
      .expect("Content-Type", /json/i);
  });

  it("responds with 404 and correct error message", async () => {
    await db("skills").insert({ skill: "TestSkill" });

    const err = await request(server)
      .delete("/skills/99")
      .expect(404)
      .expect("Content-Type", /json/i);
    expect(err.body.message).toBe(
      "The skill with the specified ID of '99' does not exist"
    );
  });

  it("deletes skill and returns number 1 on success", async () => {
    await db("skills").insert({ skill: "TestSkill" });
    let skills = await db("skills");
    expect(skills).toHaveLength(1);
    const isSuccessful = await request(server).delete("/skills/1");
    expect(isSuccessful.body).toBe(1);
    skills = await db("skills");
    expect(skills).toHaveLength(0);
  });
});
