const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const { signToken } = require("../utils/token");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      signUpCode,
      major,
      year,
      bio,
      skillTags,
      workingStyle,
      groupSizePreference
    } = req.body;

    const normalizedCode = signUpCode?.trim();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!name || !normalizedEmail || !password || !normalizedCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.findOne({ signUpCode: normalizedCode });
    console.log("Looking for course:", normalizedCode);
    console.log("Course found:", course);
    if (!course) {
      return res.status(400).json({ message: "Invalid sign-up code" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      major,
      year,
      bio,
      skillTags,
      workingStyle,
      groupSizePreference,
      courses: [course._id]
    });

    res.status(201).json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        courses: user.courses,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }

    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        courses: user.courses,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };