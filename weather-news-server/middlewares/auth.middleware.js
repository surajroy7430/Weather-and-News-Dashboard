const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({
        status: "error",
        code: "NO_TOKEN",
        message: "Access token required",
      });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select("-refreshTokens");

    if (!user) {
      return res.status(401).json({
        status: "error",
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        code: "INVALID_TOKEN",
        message: "Invalid access token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        code: "TOKEN_EXPIRED",
        message: "Access token expired",
      });
    }

    res.status(500).json({
      status: "error",
      code: "AUTH_ERROR",
      message: "Authentication failed",
    });
  }
};

module.exports = { authenticateToken };
