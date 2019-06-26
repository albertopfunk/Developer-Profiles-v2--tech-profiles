const express = require("express");
require("dotenv").config();

const server = express();

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 7000;
}

server.get("/", (req, res) => {
  res.send("API is up an running!");
});

server.listen(PORT, () => {
  console.log(
    `== backend server is running on ${PORT} ==\n== using the ${process.env.DB} database ==`
  );
});
