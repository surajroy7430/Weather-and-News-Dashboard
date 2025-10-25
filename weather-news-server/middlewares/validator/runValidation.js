const { validationResult } = require("express-validator");

const runValidation = (req, res, next) => {
  const errors = validationResult(req).formatWith(({ msg, path }) => {
    return `${path}: ${msg}`;
  });

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.mapped() });

  next();
};

module.exports = { runValidation };
