const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String },
    description: { type: String },
    skills: [{ type: String }],
    imageUrl: { type: String },
    link: { type: String },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Certificate", certificateSchema);
