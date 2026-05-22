const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    score: { type: Number, required: true, min: 1, max: 5 },
    categories: {
      reliability: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      contribution: { type: Number, min: 1, max: 5 },
    },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

ratingSchema.index({ rater: 1, ratee: 1, group: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
