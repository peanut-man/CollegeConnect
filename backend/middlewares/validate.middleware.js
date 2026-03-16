const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

module.exports.validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [firstError] = errors.array();
    return next(new AppError(firstError?.msg || "Validation failed", 400));
  }

  next();
};
