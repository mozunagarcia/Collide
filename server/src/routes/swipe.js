const express = require("express");
const router = express.Router();
const { getCandidates, recordSwipe } = require("../controllers/swipe");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/candidates", getCandidates);
router.post("/", recordSwipe);

module.exports = router;
