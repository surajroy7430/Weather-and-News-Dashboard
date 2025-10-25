const { rateLimit } = require("express-rate-limit");

const limitRateRequest = (timeInMinutes, maxRequests, customMessage) =>
  rateLimit({
    windowMs: timeInMinutes * 60 * 1000,
    limit: maxRequests,
    message: {
      msg: customMessage || "Too many request. Please try again later.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });

module.exports = limitRateRequest;