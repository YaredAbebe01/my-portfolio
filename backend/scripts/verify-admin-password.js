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
  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin) {
    console.log("Admin not found for email:", normalizedEmail);
    await mongoose.disconnect();
    return;
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  console.log(isMatch ? "Password matches" : "Password does NOT match");

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
