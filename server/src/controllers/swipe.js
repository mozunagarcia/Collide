const Swipe = require("../models/Swipe");
const Match = require("../models/Match");
const User = require("../models/User");

const getCandidates = async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser.courses.length) {
      return res.json([]);
    }

    const alreadySwiped = await Swipe.find({ swiper: currentUser._id }).select("swiped");
    const swipedIds = alreadySwiped.map((s) => s.swiped);

    const candidates = await User.find({
      _id: { $nin: [...swipedIds, currentUser._id] },
      courses: { $in: currentUser.courses },
    })
      .select("-password")
      .populate("courses", "department number name quarter");

    res.json(candidates);
  } catch (err) {
    console.error("getCandidates error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const recordSwipe = async (req, res) => {
  try {
    const { swipedUserId, direction } = req.body;
    const swiperId = req.user._id;

    if (!swipedUserId || !direction) {
      return res.status(400).json({ message: "swipedUserId and direction are required" });
    }

    const swipedUser = await User.findById(swipedUserId).select("courses");
    if (!swipedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const sharedCourse = req.user.courses.find((c) =>
      swipedUser.courses.some((sc) => sc.toString() === c.toString())
    );

    if (!sharedCourse) {
      return res.status(400).json({ message: "No shared course with this user" });
    }

    await Swipe.create({
      swiper: swiperId,
      swiped: swipedUserId,
      course: sharedCourse,
      direction,
    });

    let match = null;

    if (direction === "like") {
      const mutual = await Swipe.findOne({
        swiper: swipedUserId,
        swiped: swiperId,
        course: sharedCourse,
        direction: "like",
      });

      if (mutual) {
        match = await Match.create({
          users: [swiperId, swipedUserId],
          course: sharedCourse,
        });
        await match.populate("users", "-password");
        await match.populate("course", "department number name quarter");
      }
    }

    res.status(201).json({ match });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already swiped on this user" });
    }
    console.error("recordSwipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCandidates, recordSwipe };
