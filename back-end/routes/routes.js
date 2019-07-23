const express = require("express");
const router = express.Router();

const userRoutes = require("./user/userRoutes");
const userExtrasRoutes = require("./user-extras/userExtrasRoutes");
const skillsRoutes = require("./skills/skillsRoutes");
const apiRoutes = require("./3rd-party/apiRoutes");

router.use("/users", userRoutes);
router.use("/extras", userExtrasRoutes);
router.use("/skills", skillsRoutes);
router.use("/api", apiRoutes);

module.exports = router;
