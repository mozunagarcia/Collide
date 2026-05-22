const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    status: {
      type: String,
      enum: ["active", "unmatched"],
      default: "active",
    },
  },
  { timestamps: true }
);

matchSchema.index({ users: 1 });

module.exports = mongoose.model("Match", matchSchema);
