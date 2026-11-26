const jwt = require("jsonwebtoken");

// Extract JWT from Authorization header or cookie
const getToken = (req) => {

  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    return header.substring(7).trim();
  }

  const cookies = req.headers.cookie;

  if (cookies) {
    const found = cookies
      .split(";")
      .find((c) => c.trim().startsWith("token="));

    if (found) {
      return decodeURIComponent(
        found.trim().substring(6)
      );
    }
  }

  return null;
};


// Verify JWT
const verifyToken = (req, res, next) => {

  const token = getToken(req);

  if (!token) {
    return res.status(403).json({
      message: "No token provided"
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "Authentication configuration error"
    });
  }

  try {

    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
};


// Role-Based Access Control
const allowRoles = (...roles) => {

  return (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied for your role"
      });
    }

    next();
  };

};

module.exports = {
  verifyToken,
  allowRoles
};
