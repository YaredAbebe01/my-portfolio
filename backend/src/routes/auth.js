const express = require("express");
const { login, register, changePassword } = require("../controllers/auth");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/change-password", requireAuth, changePassword);

module.exports = router;
