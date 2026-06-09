const Course = require("../models/Course");
const User = require("../models/User");

const enroll = async (req, res) => {
  try {
    const { signUpCode } = req.body;
    if (!signUpCode) {
      return res.status(400).json({ message: "Sign-up code is required" });
    }

    const course = await Course.findOne({ signUpCode: signUpCode.trim() });
    if (!course) {
      return res.status(404).json({ message: "Invalid sign-up code" });
    }

    const alreadyEnrolled = req.user.courses.some(
      (id) => id.toString() === course._id.toString()
    );
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { courses: course._id },
    });

    res.json({
      message: "Enrolled successfully",
      course: {
        id: course._id,
        department: course.department,
        number: course.number,
        name: course.name,
        section: course.section,
        quarter: course.quarter,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "courses",
      "department number name section instructor quarter"
    );
    res.json(user.courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { enroll, getMyCourses };
