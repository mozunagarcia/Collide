const jwt = require("jsonwebtoken");

// server creates a small string (JWT token) and sends it back to us
// Browser saves it and sends it along with every request in the future so  that the server knows its still you

// Basically crates token (7d experation )
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Checks if token is valid
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
