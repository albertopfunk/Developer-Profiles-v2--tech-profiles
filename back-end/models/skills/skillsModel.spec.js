const skillsModel = require("./skillsModel");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("insert", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("should insert skills", async () => {
    await skillsModel.insert({
      skill: "TestSkill"
    });
    await skillsModel.insert({
      skill: "TestSkill2"
    });
    const skills = await db("skills");
    expect(skills).toHaveLength(2);
  });

  it("should return inserted skills", async () => {
    const newSkill = await skillsModel.insert({
      skill: "TestSkill"
    });
    expect(newSkill.id).toBe(1);
    expect(newSkill.skill).toBe("TestSkill");

    const newSkill2 = await skillsModel.insert({
      skill: "TestSkill2"
    });
    expect(newSkill2.id).toBe(2);
    expect(newSkill2.skill).toBe("TestSkill2");

    const fullSkill2 = {
      id: 2,
      skill: "TestSkill2"
    };
    expect(newSkill2).toEqual(fullSkill2);
  });
});

describe("getAll", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("should return an empty array", async () => {
    const allSkills = await skillsModel.getAll();
    expect(allSkills).toHaveLength(0);
  });

  it("should return all skills", async () => {
    await db("skills").insert([
      { skill: "TestSkill1" },
      { skill: "TestSkill2" },
      { skill: "TestSkill3" }
    ]);

    const skills = await skillsModel.getAll();
    expect(skills).toHaveLength(3);
  });
});

describe("getSingle", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("Should return single skill", async () => {
    await db("skills").insert([
      { skill: "TestSkill1" },
      { skill: "TestSkill2" },
      { skill: "TestSkill3" }
    ]);

    const skill2 = await skillsModel.getSingle(2);
    expect(skill2.skill).toBe("TestSkill2");

    const skill3 = await skillsModel.getSingle(3);
    expect(skill3.skill).toBe("TestSkill3");
  });
});

describe("update", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("should return 1 on success", async () => {
    await db("skills").insert({ skill: "TestSkill1" });
    const update = { skill: "NEWTestSkill1" };
    const isSuccessfull = await skillsModel.update(1, update);
    expect(isSuccessfull).toBe(1);
  });

  it("should update skill", async () => {
    await db("skills").insert({ skill: "TestSkill1" });
    const update = { skill: "NEWTestSkill1" };
    await skillsModel.update(1, update);

    const updatedSkill = await db("skills")
      .where({ id: 1 })
      .first();
    expect(updatedSkill.skill).toBe("NEWTestSkill1");
  });
});

describe("remove", () => {
  beforeAll(async () => {
    await db("skills").truncate();
  });
  afterEach(async () => {
    await db("skills").truncate();
  });

  it("should return 1 on success", async () => {
    await db("skills").insert({ skill: "TestSkill1" });
    const isSuccessfull = await skillsModel.remove(1);
    expect(isSuccessfull).toBe(1);
  });

  it("Should remove skill", async () => {
    await db("skills").insert([
      { skill: "TestSkill1" },
      { skill: "TestSkill2" },
      { skill: "TestSkill3" }
    ]);
    let skills = await db("skills");
    expect(skills).toHaveLength(3);
    await skillsModel.remove(1);
    skills = await db("skills");
    expect(skills).toHaveLength(2);
    await skillsModel.remove(3);
    skills = await db("skills");
    expect(skills).toHaveLength(1);
    expect(skills[0].skill).toBe("TestSkill2");
  });
});
