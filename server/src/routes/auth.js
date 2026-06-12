const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  resendVerification,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;