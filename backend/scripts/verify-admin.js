const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Admin = require("../src/models/Admin");

dotenv.config();

const run = async () => {
  const email = process.env.ADMIN_EMAIL;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const normalizedEmail = String(email).trim().toLowerCase();
  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin) {
    console.log("Admin not found for email:", normalizedEmail);
  } else {
    console.log("Admin found for email:", normalizedEmail);
  }

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
