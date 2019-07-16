const db = require("../data/dbConfig");

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

async function getAll() {
  return db("users");
}

async function getSingle(id) {
  return db("users")
    .where({ email: id })
    .orWhere({ id: id })
    .first();
}

async function update(id, body) {
  return db("users")
    .where({ id })
    .update(body);
}

async function remove(id) {
  return db("users")
    .where({ id })
    .delete();
}
