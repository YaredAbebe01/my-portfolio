const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, default: "social" },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Link", linkSchema);
