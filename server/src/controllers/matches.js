const Match = require("../models/Match");

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id, status: "active" })
      .populate("users", "-password")
      .populate("course", "department number name quarter");
    res.json(matches);
  } catch (err) {
    console.error("getMatches error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMatches };
