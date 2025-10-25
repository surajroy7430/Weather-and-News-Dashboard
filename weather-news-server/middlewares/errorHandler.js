const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const errorLog = {
    error: err.message,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  };

  logger.error("Error occurred:", errorLog);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "Something went wrong" : message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
