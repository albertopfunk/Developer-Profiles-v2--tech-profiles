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

  it("should insert user extra", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newProject = {
      user_id: 1,
      project_title: "TestProject"
    };
    const newUserExtra = await userExtrasModel.insert("projects", newProject);
    expect(newUserExtra.project_title).toBe(newProject.project_title);
  });

  it("should insert and return provided user extra 'experience'", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newExperience = {
      user_id: 1,
      job_title: "TestDeveloper"
    };
    const newExperienceFull = {
      id: 1,
      user_id: 1,
      job_title: "TestDeveloper",
      company_name: null,
      job_dates: null,
      job_description: null
    };

    const newUserExtra = await userExtrasModel.insert(
      "experience",
      newExperience
    );
    expect(newUserExtra).toEqual(newExperienceFull);
  });

  it("should insert and return provided user extra 'education'", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newEducation = {
      user_id: 1,
      school: "TestDeveloperAcademy"
    };
    const newEducationFull = {
      id: 1,
      user_id: 1,
      school: "TestDeveloperAcademy",
      school_dates: null,
      field_of_study: null
    };

    const newUserExtra = await userExtrasModel.insert(
      "education",
      newEducation
    );
    expect(newUserExtra).toEqual(newEducationFull);
  });

  it("should insert and return provided user extra 'projects'", async () => {
    await db("users").insert({ email: "test@email.com" });
    const newProject = {
      user_id: 1,
      project_title: "TestProject"
    };
    const newProjectFull = {
      id: 1,
      user_id: 1,
      project_title: "TestProject",
      link: null,
      project_description: null,
      project_img: null
    };

    const newUserExtra = await userExtrasModel.insert("projects", newProject);
    expect(newUserExtra).toEqual(newProjectFull);
  });
});

describe("getAll", () => {
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

  it("should return empty array if user ID invalid", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("experience").insert({ user_id: 1 });
    const userExtras = await userExtrasModel.getAll(999, "experience");
    expect(userExtras).toHaveLength(0);
  });

  it("should return empty array if user extra is empty", async () => {
    await db("users").insert({ email: "test@email.com" });
    const userExtras = await userExtrasModel.getAll(1, "projects");
    expect(userExtras).toHaveLength(0);
  });

  it("should return all items in user's extra 'education'", async () => {
    await db("users").insert({ email: "test@email.com" });
    let userExtras = await userExtrasModel.getAll(1, "education");
    expect(userExtras).toHaveLength(0);

    await db("education").insert([
      { user_id: 1 },
      { user_id: 1 },
      { user_id: 1 }
    ]);

    userExtras = await userExtrasModel.getAll(1, "education");
    expect(userExtras).toHaveLength(3);
  });

  it("should return all items in user's extra 'projects'", async () => {
    await db("users").insert({ email: "test@email.com" });
    let userExtras = await userExtrasModel.getAll(1, "projects");
    expect(userExtras).toHaveLength(0);

    await db("projects").insert([
      { user_id: 1 },
      { user_id: 1 },
      { user_id: 1 }
    ]);

    userExtras = await userExtrasModel.getAll(1, "projects");
    expect(userExtras).toHaveLength(3);
  });

  it("should return all items in user's extra 'experience'", async () => {
    await db("users").insert({ email: "test@email.com" });
    let userExtras = await userExtrasModel.getAll(1, "experience");
    expect(userExtras).toHaveLength(0);

    await db("experience").insert([
      { user_id: 1 },
      { user_id: 1 },
      { user_id: 1 }
    ]);

    userExtras = await userExtrasModel.getAll(1, "experience");
    expect(userExtras).toHaveLength(3);
  });
});

describe("getSingle", () => {
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

  it("should return a single user extra 'education'", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([
      { user_id: 1, school: "TestSchool1" },
      { user_id: 1, school: "TestSchool2" },
      { user_id: 1, school: "TestSchool3" }
    ]);

    const userExtras = await userExtrasModel.getSingle("education", 2);
    expect(userExtras.school).toBe("TestSchool2");
  });

  it("should return a single user extra 'projects'", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert([
      { user_id: 1, project_title: "TestProject1" },
      { user_id: 1, project_title: "TestProject2" },
      { user_id: 1, project_title: "TestProject3" }
    ]);

    const userExtras = await userExtrasModel.getSingle("projects", 3);
    expect(userExtras.project_title).toBe("TestProject3");
  });

  it("should return a single user extra 'experience'", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("experience").insert([
      { user_id: 1, company_name: "TestCompany1" },
      { user_id: 1, company_name: "TestCompany2" },
      { user_id: 1, company_name: "TestCompany3" }
    ]);

    const userExtras = await userExtrasModel.getSingle("experience", 1);
    expect(userExtras.company_name).toBe("TestCompany1");
  });
});

describe("update", () => {
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

  it("should return updated user extra 'experience' on success", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("experience").insert({ user_id: 1 });
    const update = {
      company_name: "TestCompany",
      job_title: "TestDeveloper"
    };
    const updatedExperience = await userExtrasModel.update(
      "experience",
      1,
      update
    );
    expect(updatedExperience.company_name).toBe("TestCompany");
  });

  it("should return updated user extra 'projects' on success", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert({ user_id: 1 });
    const update = {
      project_title: "TestProject"
    };
    const updatedProjects = await userExtrasModel.update("projects", 1, update);
    expect(updatedProjects.project_title).toBe("TestProject");
  });

  it("should return updated user extra 'education' on success", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert({ user_id: 1 });
    const update = {
      school: "TestSchool",
      field_of_study: "TestDeveloper"
    };
    const updatededucation = await userExtrasModel.update(
      "education",
      1,
      update
    );
    expect(updatededucation.field_of_study).toBe("TestDeveloper");
  });
});

describe("remove", () => {
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

  it("should remove user extra 'projects'", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("projects").insert([{ user_id: 1 }, { user_id: 1 }]);
    const isSuccessful = await userExtrasModel.remove("projects", 1);
    expect(isSuccessful).toBe(1);
    const userExtras = await db("projects").where({ user_id: 1 });
    expect(userExtras).toHaveLength(1);
  });

  it("should remove user extra 'education'", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("education").insert([{ user_id: 1 }, { user_id: 1 }]);
    const isSuccessful = await userExtrasModel.remove("education", 1);
    expect(isSuccessful).toBe(1);
    const userExtras = await db("education").where({ user_id: 1 });
    expect(userExtras).toHaveLength(1);
  });

  it("should remove user extra 'experience'", async () => {
    await db("users").insert({ email: "test@email.com" });
    await db("experience").insert([{ user_id: 1 }, { user_id: 1 }]);
    const isSuccessful = await userExtrasModel.remove("experience", 1);
    expect(isSuccessful).toBe(1);
    const userExtras = await db("experience").where({ user_id: 1 });
    expect(userExtras).toHaveLength(1);
  });
});
