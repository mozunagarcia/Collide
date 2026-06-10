const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const User = require("../models/User");
const Group = require("../models/Group");

const submitRating = async (req, res) => {
  try {
    const { rateeId, groupId, score, categories, comment } = req.body;
    const raterId = req.user._id;

    if (!rateeId || !groupId || !score) {
      return res.status(400).json({ message: "rateeId, groupId, and score are required" });
    }

    if (raterId.toString() === rateeId) {
      return res.status(400).json({ message: "You cannot rate yourself" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIds = group.members.map((m) => m.toString());
    if (!memberIds.includes(raterId.toString()) || !memberIds.includes(rateeId)) {
      return res.status(403).json({ message: "Both users must be members of the group" });
    }

    await Rating.create({ rater: raterId, ratee: rateeId, group: groupId, score, categories, comment });

    const [result] = await Rating.aggregate([
      { $match: { ratee: new mongoose.Types.ObjectId(rateeId) } },
      { $group: { _id: null, avg: { $avg: "$score" }, count: { $sum: 1 } } },
    ]);

    if (result) {
      await User.findByIdAndUpdate(rateeId, {
        averageRating: Math.round(result.avg * 10) / 10,
        ratingCount: result.count,
      });
    }

    res.status(201).json({ message: "Rating submitted" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already rated this user in this group" });
    }
    console.error("submitRating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name averageRating ratingCount");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ratings = await Rating.find({ ratee: userId })
      .select("-rater")
      .populate("group", "name course");

    res.json({ user, ratings });
  } catch (err) {
    console.error("getUserRatings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { submitRating, getUserRatings };
