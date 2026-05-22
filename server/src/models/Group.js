const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxSize: { type: Number, default: 6, min: 2, max: 20 },
    description: { type: String, maxlength: 500 },
    meetingSchedule: { type: String },
    sharedLinks: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["forming", "active", "completed"],
      default: "forming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
