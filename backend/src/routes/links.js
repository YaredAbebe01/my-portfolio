const express = require("express");
const {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  trackLink,
} = require("../controllers/links");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getLinks);
router.post("/track", trackLink);
router.get("/admin", requireAuth, getLinks);
router.post("/", requireAuth, createLink);
router.put("/:id", requireAuth, updateLink);
router.delete("/:id", requireAuth, deleteLink);

module.exports = router;
