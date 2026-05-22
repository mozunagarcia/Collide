const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");

router.post("/register", register); //runs register logic
router.post("/login", login); //runs login logic

module.exports = router;
