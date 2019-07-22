const userExtrasModel = require("./userExtrasModel");
const db = require("../../data/dbConfig");


describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});


describe("insert", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  afterAll(async () => {
    await db("users").truncate();
  });

  it("should insert user extra", async () => {
    await db("users").insert({email: "test@email.com"})
    const newProject = {
      user_id: 1,
      project_title: "TestProject"
    }
    const newUserExtra = await userExtrasModel.insert("projects", newProject);
    expect(newUserExtra.project_title).toBe(newProject.project_title);
  });

  //it("should insert and return provided user extra");

  //it("should accept either 'education' or 'experience' or 'projects'");
});
