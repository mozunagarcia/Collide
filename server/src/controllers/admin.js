const crypto = require("crypto");
const Course = require("../models/Course");
const User = require("../models/User");
const Match = require("../models/Match");
const Group = require("../models/Group");

const createCourse = async (req, res) => {
  try {
    const { department, number, name, section, instructor, quarter } = req.body;
    if (!department || !number || !name || !quarter) {
      return res.status(400).json({ message: "department, number, name, and quarter are required" });
    }

    // Generate a unique 8-char alphanumeric sign-up code
    const signUpCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const course = await Course.create({
      department: department.toUpperCase().trim(),
      number: number.trim(),
      name: name.trim(),
      section: section?.trim(),
      instructor: instructor?.trim(),
      quarter: quarter.trim(),
      signUpCode,
    });

    res.status(201).json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "A course with those details already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ quarter: -1, department: 1, number: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Remove course from all enrolled users
    await User.updateMany({ courses: course._id }, { $pull: { courses: course._id } });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("courses", "department number name quarter");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const bootstrapAdmin = async (req, res) => {
  try {
    const { email, secret } = req.body;
    if (!secret || secret !== process.env.BOOTSTRAP_SECRET) {
      return res.status(403).json({ message: "Invalid bootstrap secret" });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: `${user.email} is now an admin`, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const matchedUserIds = await Match.distinct("users");
    const matchedUserCount = matchedUserIds.length;
    const matchRatePercent = totalUsers > 0 ? Math.round((matchedUserCount / totalUsers) * 100) : 0;

    const groupSizeStats = await Group.aggregate([
      { $project: { size: { $size: "$members" } } },
      { $group: { _id: null, avgSize: { $avg: "$size" }, totalGroups: { $sum: 1 } } },
    ]);

    const groupSizeDistribution = await Group.aggregate([
      { $project: { size: { $size: "$members" } } },
      { $group: { _id: "$size", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const majorBreakdown = await User.aggregate([
      { $match: { major: { $exists: true, $ne: "" } } },
      { $group: { _id: "$major", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      matchRate: { totalUsers, matchedUsers: matchedUserCount, percentage: matchRatePercent },
      groupSize: {
        totalGroups: groupSizeStats[0]?.totalGroups || 0,
        averageSize: groupSizeStats[0] ? Math.round(groupSizeStats[0].avgSize * 10) / 10 : 0,
        distribution: groupSizeDistribution,
      },
      majorBreakdown,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createCourse, getCourses, deleteCourse, getUsers, bootstrapAdmin, getAnalytics };
