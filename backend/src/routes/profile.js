const express = require("express");
const { getProfile, upsertProfile } = require("../controllers/profile");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProfile);
router.put("/", requireAuth, upsertProfile);

module.exports = router;
