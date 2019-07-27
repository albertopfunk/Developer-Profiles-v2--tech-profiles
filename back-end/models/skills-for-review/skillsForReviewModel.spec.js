const skillsForReviewModel = require("./skillsForReviewModel");
const db = require("../../data/dbConfig");

describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("insert", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("should insert skills for review", async () => {
    await skillsForReviewModel.insert({
      user_id: 1,
      skill_for_review: "TestSkillForReview"
    });
    await skillsForReviewModel.insert({
      user_id: 1,
      skill_for_review: "TestSkillForReview2"
    });
    const skillsForReview = await db("skills_for_review");
    expect(skillsForReview).toHaveLength(2);
  });

  it("should return inserted skills for review", async () => {
    const newSkillForReview = await skillsForReviewModel.insert({
      user_id: 1,
      skill_for_review: "TestSkillForReview"
    });
    expect(newSkillForReview.id).toBe(1);
    expect(newSkillForReview.skill_for_review).toBe("TestSkillForReview");

    const newSkillForReview2 = await skillsForReviewModel.insert({
      user_id: 1,
      skill_for_review: "TestSkillForReview2"
    });
    expect(newSkillForReview2.id).toBe(2);
    expect(newSkillForReview2.skill_for_review).toBe("TestSkillForReview2");

    const fullSkillForReview2 = {
      id: 2,
      user_id: 1,
      skill_for_review: "TestSkillForReview2"
    };
    expect(newSkillForReview2).toEqual(fullSkillForReview2);
  });
});

describe("getAll", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("should return an empty array", async () => {
    const allSkillsForReview = await skillsForReviewModel.getAll();
    expect(allSkillsForReview).toHaveLength(0);
  });

  it("should return all skills for review", async () => {
    await db("skills_for_review").insert([
      { user_id: 1, skill_for_review: "TestSkill1" },
      { user_id: 1, skill_for_review: "TestSkill2" },
      { user_id: 1, skill_for_review: "TestSkill3" }
    ]);

    const skillsForReview = await skillsForReviewModel.getAll();
    expect(skillsForReview).toHaveLength(3);
  });
});

describe("getSingle", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("Should return single skill", async () => {
    await db("skills_for_review").insert([
      { user_id: 1, skill_for_review: "TestSkill1" },
      { user_id: 1, skill_for_review: "TestSkill2" },
      { user_id: 1, skill_for_review: "TestSkill3" }
    ]);

    const skillForReview1 = await skillsForReviewModel.getSingle(1);
    expect(skillForReview1.skill_for_review).toBe("TestSkill1");

    const skillForReview3 = await skillsForReviewModel.getSingle(3);
    expect(skillForReview3.skill_for_review).toBe("TestSkill3");
  });
});

describe("update", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("should return 1 on success", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill1"
    });
    const update = { skill_for_review: "NEWTestSkill1" };
    const isSuccessfull = await skillsForReviewModel.update(1, update);
    expect(isSuccessfull).toBe(1);
  });

  it("should update skill for review", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill1"
    });
    const update = { skill_for_review: "NEWTestSkill1" };
    await skillsForReviewModel.update(1, update);

    const updatedSkill = await db("skills_for_review")
      .where({ id: 1 })
      .first();
    expect(updatedSkill.skill_for_review).toBe("NEWTestSkill1");
  });
});

describe("remove", () => {
  beforeAll(async () => {
    await db("skills_for_review").truncate();
  });
  afterEach(async () => {
    await db("skills_for_review").truncate();
  });

  it("should return number 1 on success of removing skill", async () => {
    await db("skills_for_review").insert({
      user_id: 1,
      skill_for_review: "TestSkill1"
    });
    const isSuccessfull = await skillsForReviewModel.remove(1);
    expect(isSuccessfull).toBe(1);
  });

  it("Should remove skill", async () => {
    await db("skills_for_review").insert([
      { user_id: 1, skill_for_review: "TestSkill1" },
      { user_id: 1, skill_for_review: "TestSkill2" },
      { user_id: 1, skill_for_review: "TestSkill3" }
    ]);
    let skills = await db("skills_for_review");
    expect(skills).toHaveLength(3);
    await skillsForReviewModel.remove(1);
    skills = await db("skills_for_review");
    expect(skills).toHaveLength(2);
    await skillsForReviewModel.remove(3);
    skills = await db("skills_for_review");
    expect(skills).toHaveLength(1);
    expect(skills[0].skill_for_review).toBe("TestSkill2");
  });
});
