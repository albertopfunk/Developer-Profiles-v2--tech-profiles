const express = require("express");
const knex = require("knex");
const dbconfig = require("../../knexfile");
const db = knex(dbconfig.development)
const server = express.Router();



module.exports = server;