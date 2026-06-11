const express = require("express");
const router = express.Router();
const { getMe, updateMe, getConnections, uploadPhoto } = require("../controllers/users");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/me", getMe);
router.patch("/me", updateMe);
router.get("/connections", getConnections);
router.post("/me/photo", upload.single("photo"), uploadPhoto);

module.exports = router;
