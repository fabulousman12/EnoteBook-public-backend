const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Adjust the path according to your project structure
const JWT_SIGN = "Jitcodeissuper"; // Make sure JWT_SIGN is set in your environment variables

const authenticateToken = (req, res, next) => {
  const token = req.header('Auth');

  if (!token) {
    return res.status(401).json({ errors: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SIGN);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ errors: "Invalid token" });
  }
};

module.exports = authenticateToken;