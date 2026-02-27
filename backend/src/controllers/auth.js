const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (admin.status !== "approved") {
      return res.status(403).json({ message: "Admin approval pending" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ email: normalizedEmail, passwordHash, status: "pending" });

    res.status(201).json({ message: "Registration submitted" });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    const admin = await Admin.findById(req.user?.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    admin.passwordHash = passwordHash;
    await admin.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, changePassword };
