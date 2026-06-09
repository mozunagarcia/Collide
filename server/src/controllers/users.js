const User = require("../models/User");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("courses", "department number name quarter");
    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, major, year, bio, skillTags, workingStyle, groupSizePreference } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, major, year, bio, skillTags, workingStyle, groupSizePreference },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("courses", "department number name quarter");

    res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.error("updateMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe, updateMe };
