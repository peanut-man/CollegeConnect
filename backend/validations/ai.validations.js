const { body } = require("express-validator");

const aiQueryValidation = [
  body("query")
    .trim()
    .notEmpty()
    .withMessage("Query is required")
    .isLength({ max: 500 })
    .withMessage("Query must be at most 500 characters"),
];

module.exports = { aiQueryValidation };
