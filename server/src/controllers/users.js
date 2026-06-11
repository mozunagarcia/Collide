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

    const updates = {};
    if (name)               updates.name = name;
    if (major)              updates.major = major;
    if (year)               updates.year = year;
    if (bio !== undefined)  updates.bio = bio;
    if (skillTags)          updates.skillTags = skillTags;
    if (groupSizePreference) updates.groupSizePreference = groupSizePreference;

    if (workingStyle) {
      const ws = {};
      if (workingStyle.location)           ws.location = workingStyle.location;
      if (workingStyle.pace)               ws.pace = workingStyle.pace;
      if (workingStyle.hours)              ws.hours = workingStyle.hours;
      if (workingStyle.communicationStyle) ws.communicationStyle = workingStyle.communicationStyle;
      if (Object.keys(ws).length) updates.workingStyle = ws;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
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

const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("connections")
      .populate("connections", "-password -connections");
    res.json(user.connections);
  } catch (err) {
    console.error("getConnections error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: req.file.path },
      { new: true }
    ).select("-password").populate("courses", "department number name quarter");
    res.json(user);
  } catch (err) {
    console.error("uploadPhoto error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe, updateMe, getConnections, uploadPhoto };
