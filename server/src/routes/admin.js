const express = require("express");
const router = express.Router();
const { createCourse, getCourses, deleteCourse, getUsers, bootstrapAdmin, getAnalytics } = require("../controllers/admin");
const { protect, isAdmin } = require("../middleware/auth");

// Not behind admin guard — secret in body acts as the credential
router.post("/bootstrap", bootstrapAdmin);

router.use(protect, isAdmin);

router.post("/courses", createCourse);
router.get("/courses", getCourses);
router.delete("/courses/:id", deleteCourse);
router.get("/users", getUsers);
router.get("/analytics", getAnalytics);

module.exports = router;
