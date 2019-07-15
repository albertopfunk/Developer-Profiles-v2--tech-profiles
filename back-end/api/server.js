const express = require("express");
const routes = require("../routes/routes");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up and running" });
});

server.use("/", routes);

module.exports = server;
