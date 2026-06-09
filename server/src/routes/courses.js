const express = require("express");
const router = express.Router();
const { enroll, getMyCourses } = require("../controllers/courses");
const { protect } = require("../middleware/auth");

router.post("/enroll", protect, enroll);
router.get("/mine", protect, getMyCourses);

module.exports = router;
