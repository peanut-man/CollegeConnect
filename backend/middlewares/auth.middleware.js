const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

module.exports.getUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader?.trim();

    const token = bearerToken || req.cookies.token;
    if (!token) {
      return next(new AppError("Authentication token missing", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.userId);
    
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
