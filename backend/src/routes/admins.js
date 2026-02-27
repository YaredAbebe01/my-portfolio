const express = require("express");
const { listAdminRequests, approveAdmin, rejectAdmin } = require("../controllers/admins");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/requests", requireAuth, listAdminRequests);
router.patch("/:id/approve", requireAuth, approveAdmin);
router.patch("/:id/reject", requireAuth, rejectAdmin);

module.exports = router;
