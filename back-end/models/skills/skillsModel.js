const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getAllFiltered,
  insertUserSkill,
  getSingle,
  update,
  remove
};

async function insert(newSkill) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  if (dbEnv === "production") {
    const [id] = await db("skills")
      .returning("id")
      .insert(newSkill);
    return getSingle(id);
  } else {
    const [id] = await db("skills").insert(newSkill);
    return getSingle(id);
  }
}

async function insertUserSkill(lePackage) {
  const { type, user_id, skill_id } = lePackage;

  await db(type).insert({ user_id, skill_id });

  const currentSkills = await db("skills")
    .join(`${type}`, "skills.id", `${type}.skill_id`)
    .select("skills.skill as name")
    .where(`${type}.user_id`, user_id);

  let currentSkillsString = "";
  currentSkills.map(skill => (currentSkillsString += `${skill.name},`));

  if (type === "user_top_skills") {
    await db("users")
      .where({ id: user_id })
      .update({ top_skills_prev: currentSkillsString });
  } else {
    await db("users")
      .where({ id: user_id })
      .update({ additional_skills_prev: currentSkillsString });
  }
}

function getAll() {
  return db("skills");
}

function getAllFiltered(input) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  if (dbEnv === "production") {
    return db("skills").where("skill", "ilike", `%${input}%`);
  } else {
    return db("skills").where("skill", "like", `%${input}%`);
  }
}

function getSingle(id) {
  return db("skills")
    .where({ id })
    .first();
}

function update(id, body) {
  return db("skills")
    .where({ id })
    .update(body);
}

function remove(id) {
  return db("skills")
    .where({ id })
    .delete();
}
