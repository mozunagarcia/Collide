const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, uppercase: true, trim: true },
    number: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    section: { type: String, trim: true },
    instructor: { type: String, trim: true },
    quarter: { type: String, trim: true },
    signUpCode: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

courseSchema.index({ department: 1, number: 1, quarter: 1, section: 1 }, { unique: true });

module.exports = mongoose.model("Course", courseSchema);
