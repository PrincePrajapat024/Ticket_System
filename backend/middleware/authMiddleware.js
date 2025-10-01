const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, role }
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
