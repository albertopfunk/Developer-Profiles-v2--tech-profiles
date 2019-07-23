const express = require("express");
const helmet = require("helmet");
const routes = require("../routes/routes");

const server = express();

server.use(express.json());
server.use(helmet());

server.get("/hello", (req, res) => {
  res.json({ api: "up and running" });
});

server.use("/", routes);

module.exports = server;
