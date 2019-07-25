const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getSingle,
  update,
  remove
};

async function insert(newSkill) {
  const [id] = await db("skills").insert(newSkill);
  return getSingle(id);
}

function getAll() {
  return db("skills");
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
