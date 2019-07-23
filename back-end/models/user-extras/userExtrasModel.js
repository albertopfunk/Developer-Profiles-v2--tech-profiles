const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  update,
  remove
};

async function insert(userExtra, body) {
  const [id] = await db(`${userExtra}`).insert(body);
  return db(`${userExtra}`)
    .where({ id })
    .first();
}

function getAll(userId, userExtra) {
  return db(`${userExtra}`).where({ user_id: userId });
}

function update() {
  return null;
}

function remove() {
  return null;
}
