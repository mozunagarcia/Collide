const express = require("express");
const router = express.Router();
const { getMatches } = require("../controllers/matches");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getMatches);

module.exports = router;
