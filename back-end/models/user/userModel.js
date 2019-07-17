const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getSingle,
  update,
  remove
};

async function insert(newUser) {
  const [id] = await db("users").insert(newUser);
  return db("users")
    .where({ id })
    .first();
}

function getAll() {
  return db("users");
}

function getSingle(id) {
  return db("users")
    .where({ email: id })
    .orWhere({ id: id })
    .first();
}

function update(id, body) {
  return db("users")
    .where({ id })
    .update(body);
}

function remove(id) {
  return db("users")
    .where({ id })
    .delete();
}
