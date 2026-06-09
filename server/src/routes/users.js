const express = require("express");
const router = express.Router();
const { getMe, updateMe } = require("../controllers/users");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/me", getMe);
router.patch("/me", updateMe);

module.exports = router;
