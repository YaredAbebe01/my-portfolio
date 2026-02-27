const express = require("express");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProjects);
router.get("/admin", requireAuth, getProjects);
router.post("/", requireAuth, createProject);
router.put("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);

module.exports = router;
