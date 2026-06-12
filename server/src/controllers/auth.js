const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const Course = require("../models/Course");
const { signToken } = require("../utils/token");
const sendEmail = require("../utils/sendEmail");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function sendVerificationEmail(user) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 1000 * 60 * 60;
  await user.save();

  const verifyLink = `${process.env.SERVER_URL}/api/auth/verify-email/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your Collide account",
    html: `
      <h2>Welcome to Collide!</h2>
      <p>Please verify your account by clicking the button below:</p>
      <a 
        href="${verifyLink}" 
        style="
          display:inline-block;
          padding:12px 18px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Verify Account
      </a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}

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

    if (!name || !email || !password || !signUpCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.findOne({ signUpCode });
    if (!course) {
      return res.status(400).json({ message: "Invalid sign-up code" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      major,
      year,
      bio,
      skillTags,
      workingStyle,
      groupSizePreference,
      courses: [course._id],
      isVerified: false,
    });

    await sendVerificationEmail(user);

    res.status(201).json({
      message: "Account created. Please check your email to verify your account before logging in.",
    });
  } catch (err) {
    console.log(err);

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

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send(`
        <h1>Verification failed</h1>
        <p>This verification link is invalid or expired.</p>
      `);
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.send(`
      <h1>Your account has been verified!</h1>
      <p>You can now go back to Collide and log in.</p>
    `);
  } catch (err) {
    res.status(500).send(`
      <h1>Server error</h1>
      <p>Could not verify your account.</p>
    `);
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    await sendVerificationEmail(user);

    res.json({
      message: "Verification email sent again. Please check your inbox.",
    });
  } catch (err) {
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

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    res.json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        courses: user.courses,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
};