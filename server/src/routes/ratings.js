const express = require("express");
const router = express.Router();
const { submitRating, getUserRatings } = require("../controllers/ratings");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", submitRating);
router.get("/user/:userId", getUserRatings);

module.exports = router;
