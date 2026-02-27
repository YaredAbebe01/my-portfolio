const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    imageUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
