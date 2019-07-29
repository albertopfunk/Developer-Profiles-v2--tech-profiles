const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("../routes/routes");

const server = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};

server.use(express.json());
server.use(helmet());
server.use(cors(corsOptions));

server.get("/hello", (req, res) => {
  res.json({ api: "up and running" });
});

server.use("/", routes);

module.exports = server;
