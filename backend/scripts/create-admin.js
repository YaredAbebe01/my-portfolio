const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../src/models/Admin");

dotenv.config();

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.status = "approved";
    await existing.save();
    console.log("Admin updated");
    await mongoose.disconnect();
    return;
  }

  await Admin.create({ email: normalizedEmail, passwordHash, status: "approved" });
  console.log("Admin created");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
