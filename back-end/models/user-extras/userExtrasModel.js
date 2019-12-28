const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getSingle,
  update,
  remove
};

async function insert(userExtra, body) {


  return await db(`${userExtra}`).insert(body);
}

function getAll(userId, userExtra) {
  return db(`${userExtra}`).where({ user_id: userId });
}

function getSingle(userExtra, userExtraId) {
  return db(`${userExtra}`)
    .where({ id: userExtraId })
    .first();
}

async function update(userExtra, userExtraId, body) {
  await db(`${userExtra}`)
    .where({ id: userExtraId })
    .update(body);
  return getSingle(userExtra, userExtraId);
}

function remove(userExtra, userExtraId) {
  return db(`${userExtra}`)
    .where({ id: userExtraId })
    .delete();
}
