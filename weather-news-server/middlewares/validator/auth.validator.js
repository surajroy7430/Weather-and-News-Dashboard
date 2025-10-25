const { body } = require("express-validator");

const sendOtpValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^[A-Za-z0-9 ]+$/)
    .withMessage("No special character allowed in Username"),
  body("email").trim().isEmail().withMessage("Valid email required"),
];

const verifyOtpValidator = [
  body("name").trim().notEmpty().withMessage("Username is required"),
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("otp").isLength({ min: 6, max: 6 }),
];

module.exports = { sendOtpValidator, verifyOtpValidator };
