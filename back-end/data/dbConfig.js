const knex = require("knex");
const config = require("../knexfile");
require("dotenv").config();

const dbEnv = process.env.DB_ENV || process.env.DB;

module.exports = knex(config[dbEnv]);
