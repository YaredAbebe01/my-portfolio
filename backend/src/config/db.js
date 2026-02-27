const mongoose = require("mongoose");

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected (${mongoose.connection.name})`);
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDb;
