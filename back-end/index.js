require("dotenv").config();

const server = require("./api/server");

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 7000;
}

server.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(
    `== backend server is running on ${PORT} ==\n== using the ${process.env.DB} database ==`
  );
});
