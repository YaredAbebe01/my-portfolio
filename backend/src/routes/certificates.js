const express = require("express");
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificates");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCertificates);
router.get("/admin", requireAuth, getCertificates);
router.post("/", requireAuth, createCertificate);
router.put("/:id", requireAuth, updateCertificate);
router.delete("/:id", requireAuth, deleteCertificate);

module.exports = router;
