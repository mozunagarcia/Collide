const express = require("express");
const router = express.Router();
const { createGroup, getMyGroups, getGroup, updateGroup, joinGroup, leaveGroup } = require("../controllers/groups");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", createGroup);
router.get("/mine", getMyGroups);
router.get("/:id", getGroup);
router.patch("/:id", updateGroup);
router.post("/:id/join", joinGroup);
router.post("/:id/leave", leaveGroup);

module.exports = router;
