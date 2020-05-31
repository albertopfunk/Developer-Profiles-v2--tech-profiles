const express = require("express");
const router = express.Router();

const userRoutes = require("./user/userRoutes");
const userExtrasRoutes = require("./user-extras/userExtrasRoutes");
const skillsRoutes = require("./skills/skillsRoutes");
const skillsForReviewRoutes = require("./skills-for-review/skillsForReviewRoutes");
const locations = require("./locations/locationsRoutes");
const apiRoutes = require("./3rd-party/apiRoutes");

router.use("/users", userRoutes);
router.use("/extras", userExtrasRoutes);
router.use("/skills", skillsRoutes);
router.use("/skills-for-review", skillsForReviewRoutes);
router.use("/locations", locations);
router.use("/api", apiRoutes);

module.exports = router;
