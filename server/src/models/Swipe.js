const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema(
  {
    swiper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    swiped: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    direction: { type: String, enum: ["like", "pass"], required: true },
  },
  { timestamps: true }
);

swipeSchema.index({ swiper: 1, swiped: 1 }, { unique: true });

module.exports = mongoose.model("Swipe", swipeSchema);
