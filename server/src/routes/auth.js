const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login } = require("../controllers/auth");
const { signToken } = require("../utils/token");

router.post("/register", register);
router.post("/login", login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/?error=google_auth_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    const user = JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      courses: req.user.courses,
      isAdmin: req.user.isAdmin,
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(user)}`);
  }
);

module.exports = router;
