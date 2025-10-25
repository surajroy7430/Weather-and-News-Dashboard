const { query } = require("express-validator");

const newsValidator = [
  query("query")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Query must be between 1 and 100 characters"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("category")
    .optional()
    .isIn([
      "business",
      "entertainment",
      "general",
      "health",
      "science",
      "sports",
      "technology",
    ])
    .withMessage("Invalid category"),
  query("language")
    .optional()
    .isIn(["en", "es", "fr", "de", "it", "pt", "ru", "zh"])
    .withMessage("Invalid language code"),
];

module.exports = { newsValidator };
