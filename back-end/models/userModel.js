const db = require("../data/dbConfig");

module.exports = {
  getAll,
  getSingle,
  insert,
  update,
  remove
};

async function getAll() {
  return db("users");
}

async function getSingle(email) {
  return db("users")
    .where({ email })
    .first();
}

async function insert(newUser) {
  const [id] = await db("users").insert(newUser, [
    "email",
    "first_name",
    "last_name"
  ]);
  return db("users")
    .where({ id })
    .first();
}

async function update() {
  return db("users")
    .where({ id })
    .update(req.body);
}

async function remove() {
  return db("users")
    .where({ id })
    .delete();
}
