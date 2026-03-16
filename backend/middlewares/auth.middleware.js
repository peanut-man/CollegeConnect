const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

async function loadUserFromCookie(req) {
  const token = req.cookies?.token;
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return userModel.findById(decoded.userId);
}

module.exports.getUser = async (req, res, next) => {
  try {
    if (!req.cookies?.token) {
      return next(new AppError("Authentication token missing", 401));
    }

    const user = await loadUserFromCookie(req);
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

module.exports.getOptionalUser = async (req, res, next) => {
  try {
    req.user = await loadUserFromCookie(req);
    next();
  } catch {
    req.user = null;
    next();
  }
};
