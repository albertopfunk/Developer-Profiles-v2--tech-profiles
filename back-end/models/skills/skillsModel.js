const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getAllFiltered,
  getSingle,
  update,
  remove
};

async function insert(newSkill) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  if (dbEnv === "production") {
    const [id] = await db("skills").returning("id").insert(newSkill);
    return getSingle(id);
  } else {
    const [id] = await db("skills").insert(newSkill);
    return getSingle(id);
  }
}

function getAll() {
  return db("skills");
}

function getAllFiltered(input) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  if (dbEnv === "production") {
    return db("skills").where('skill', 'ilike', `%${input}%`);
  } else {
    return db("skills").where('skill', 'like', `%${input}%`);
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
