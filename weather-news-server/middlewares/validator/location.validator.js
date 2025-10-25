const { body, param } = require("express-validator");

const addLocationValidator = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Location name must be between 1 and 100 characters"),
  body("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  body("lon")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

const deleteLocationValidator = param("id")
  .isMongoId()
  .withMessage("Invalid location ID");

module.exports = { addLocationValidator, deleteLocationValidator };
