const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getSingle,
  update,
  remove
};

async function insert(userExtra, body) {
  const [id] = await db(`${userExtra}`).insert(body);
  return db(`${userExtra}`)
    .where({ id })
    .first();
}

function getSingle() {
  return null;
}

function update() {
  return null;
}

function remove() {
  return null;
}