const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const skillsRoutes = require("./skillsRoutes");
const apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/skills", skillsRoutes);
router.use("/api", apiRoutes);

module.exports = router;
