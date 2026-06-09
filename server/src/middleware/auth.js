const { verifyToken } = require("../utils/token");
const User = require("../models/User");

// Before any protected page loads, the server runs a check on the token in your request

//protect reads Authorization: Bearer <token>, verifies it, attaches req.user so that next step can use it
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = verifyToken(header.split(" ")[1]);
    req.user = await User.findById(decoded.id).select("-password");
    //No token -> blocked
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    //Expired or fake token -> blocked
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, isAdmin };
