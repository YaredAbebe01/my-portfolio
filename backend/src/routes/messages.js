const express = require("express");
const { getMessages, createMessage, deleteMessage } = require("../controllers/messages");
const { requireAuth } = require("../middleware/auth");
const { requireFields } = require("../middleware/validate");

const router = express.Router();

router.get("/", requireAuth, getMessages);
router.delete("/:id", requireAuth, deleteMessage);
router.post("/", requireFields(["name", "email", "message"]), createMessage);

module.exports = router;
