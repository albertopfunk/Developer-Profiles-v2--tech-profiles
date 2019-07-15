const express = require("express");
const router = express.Router();

const userRoutes = require("./user/userRoutes");
const skillsRoutes = require("./skills/skillsRoutes");
const apiRoutes = require("./3rd-party/apiRoutes");

router.use("/users", userRoutes);
router.use("/skills", skillsRoutes);
router.use("/api", apiRoutes);

module.exports = router;
