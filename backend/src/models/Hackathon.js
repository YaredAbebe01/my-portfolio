const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    result: { type: String },
    focus: { type: String },
    link: { type: String },
    date: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Hackathon", hackathonSchema);
