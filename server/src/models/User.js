const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    googleId: { type: String, sparse: true },
    major: { type: String, trim: true },
    year: {
      type: String,
      enum: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
    },
    bio: { type: String, maxlength: 500 },
    profilePhoto: { type: String },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    skillTags: [{ type: String, trim: true }],
    workingStyle: {
      location: {
        type: String,
        enum: ["Remote", "In-person", "Flexible"],
      },
      pace: {
        type: String,
        enum: ["Well ahead of deadline", "Balanced", "Close to deadline"],
      },
      hours: {
        type: String,
        enum: ["Morning", "Afternoon", "Evening", "Night"],
      },
      communicationStyle: {
        type: String,
        enum: ["Very frequent", "Regular check-ins", "As needed"],
      },
    },
    groupSizePreference: {
      type: String,
      enum: ["Small (2-3)", "Medium (4-6)", "Large (7+)"],
    },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
