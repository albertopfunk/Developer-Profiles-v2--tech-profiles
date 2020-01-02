const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getSingle,
  update,
  remove
};

async function insert(newSkillForReview) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  if (dbEnv === "production") {
    const [id] = await db("skills_for_review")
      .returning("id")
      .insert(newSkillForReview);
    return getSingle(id);
  } else {
    const [id] = await db("skills_for_review").insert(newSkillForReview);
    return getSingle(id);
  }
}

function getAll() {
  return db("skills_for_review");
}

// getAllByUser

function getSingle(id) {
  return db("skills_for_review")
    .where({ id })
    .first();
}

function update(id, body) {
  return db("skills_for_review")
    .where({ id })
    .update(body);
}

function remove(id) {
  return db("skills_for_review")
    .where({ id })
    .delete();
}
