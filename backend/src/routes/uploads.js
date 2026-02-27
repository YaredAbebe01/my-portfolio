const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploads");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/image", requireAuth, upload.single("image"), uploadImage);

module.exports = router;
