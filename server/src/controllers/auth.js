const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const { signToken } = require("../utils/token");

const register = async (req, res) => {
  try {
    const { name, email, password, signUpCode } = req.body;
    //check all fields are filled in
    if (!name || !email || !password || !signUpCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify sign-up code matches a real course section
    const course = await Course.findOne({ signUpCode });
    if (!course) {
      return res.status(400).json({ message: "Invalid sign-up code" });
    }

    // Checks to make sure email isnt already taken
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    //encrypt password before saving it
    const hashed = await bcrypt.hash(password, 12);

    //create account
    const user = await User.create({
      name,
      email,
      password: hashed,
      courses: [course._id],
    });

    //send back a token so user gets logged in right away
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
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //find account with that email
    const user = await User.findOne({ email });
    //check the password matches what was saved
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //send back a token
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
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
