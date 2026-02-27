const express = require("express");
const {
  getHackathons,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} = require("../controllers/hackathons");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getHackathons);
router.get("/admin", requireAuth, getHackathons);
router.post("/", requireAuth, createHackathon);
router.put("/:id", requireAuth, updateHackathon);
router.delete("/:id", requireAuth, deleteHackathon);

module.exports = router;
