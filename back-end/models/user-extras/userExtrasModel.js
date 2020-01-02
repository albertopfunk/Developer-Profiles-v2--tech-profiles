const db = require("../../data/dbConfig");

module.exports = {
  insert,
  getAll,
  getSingle,
  update,
  remove
};

async function insert(userExtra, body) {
  const dbEnv = process.env.DB_ENV || process.env.DB;

  if (dbEnv === "production") {
    const [id] = await db(`${userExtra}`)
      .returning("id")
      .insert(body);
    return getSingle(userExtra, id);
  } else {
    const [id] = await db(`${userExtra}`).insert(body);
    return getSingle(userExtra, id);
  }
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
