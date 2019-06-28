const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/api", apiRoutes);

module.exports = router;
