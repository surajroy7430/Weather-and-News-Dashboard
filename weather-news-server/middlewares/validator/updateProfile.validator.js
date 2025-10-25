const { body } = require("express-validator");

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("preferences.theme")
    .optional()
    .isIn(["light", "dark"])
    .withMessage("Theme must be either light or dark"),
  body("preferences.defaultLocation.name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Location name must be between 1 and 100 characters"),
  body("preferences.defaultLocation.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  body("preferences.defaultLocation.lon")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  body("preferences.newsTopics")
    .optional()
    .isArray()
    .withMessage("News topics must be an array"),
  body("preferences.newsTopics.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each news topic must be between 1 and 50 characters"),
];

module.exports = { updateProfileValidator };
