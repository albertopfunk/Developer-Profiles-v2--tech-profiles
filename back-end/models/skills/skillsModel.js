const db = require("../../data/dbConfig");

module.exports = {
  insert,
  insertUserSkill,
  getAll,
  getAllFiltered,
  getSingle,
  update,
  remove,
  removeUserSkills,
  removeUserSkill
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
  const { type, user_id, skill_ids } = lePackage;

  for (let i = 0; i < skill_ids.length; i++) {
    await db(type).insert({ user_id, skill_id: skill_ids[i] });
  }

  return syncSkills(user_id, type);
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

async function removeUserSkills(userId, type) {
  await db(type)
    .where({ user_id: userId })
    .delete();
  return syncSkills(userId, type);
}

async function removeUserSkill(userId, skillId, type) {
  await db(type)
    .where({ user_id: userId, skill_id: skillId })
    .delete();
  return syncSkills(userId, type);
}

async function syncSkills(userId, type) {
  const currentSkills = await db("skills")
    .join(`${type}`, "skills.id", `${type}.skill_id`)
    .select("skills.skill as name")
    .where(`${type}.user_id`, userId);

  let currentSkillsString = "";
  for (let i = 0; i < currentSkills.length && i < 6; i++) {
    currentSkillsString += `${currentSkills[i].name},`;
  }

  if (type === "user_top_skills") {
    return db("users")
      .where({ id: userId })
      .update({ top_skills_prev: currentSkillsString });
  } else {
    return db("users")
      .where({ id: userId })
      .update({ additional_skills_prev: currentSkillsString });
  }
}
