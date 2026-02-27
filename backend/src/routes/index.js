const express = require("express");
const projectRoutes = require("./projects");
const certificateRoutes = require("./certificates");
const messageRoutes = require("./messages");
const authRoutes = require("./auth");
const uploadRoutes = require("./uploads");
const hackathonRoutes = require("./hackathons");
const linkRoutes = require("./links");
const adminRoutes = require("./admins");
const analyticsRoutes = require("./analytics");
const profileRoutes = require("./profile");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/certificates", certificateRoutes);
router.use("/messages", messageRoutes);
router.use("/uploads", uploadRoutes);
router.use("/hackathons", hackathonRoutes);
router.use("/links", linkRoutes);
router.use("/admins", adminRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
