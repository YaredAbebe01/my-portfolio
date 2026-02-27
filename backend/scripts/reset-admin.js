const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../src/models/Admin");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
  await Admin.deleteMany({
    email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i"),
  });

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email: normalizedEmail, passwordHash, status: "approved" });

  console.log("Admin reset");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
