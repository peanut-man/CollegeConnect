const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for login endpoint
 * Max 5 requests per minute per IP
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again after 1 minute.",
    });
  },
});

/**
 * Rate limiter for signup endpoint
 * Max 3 requests per minute per IP
 */
const signupLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many signup attempts. Please try again after 1 minute.",
    });
  },
});

/**
 * General rate limiter for API routes
 * Max 100 requests per minute per IP
 */
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

/**
 * Rate limiter for AI query endpoint
 * Max 10 requests per minute per IP
 */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many AI queries. Please try again after 1 minute.",
    });
  },
});

module.exports = {
  loginLimiter,
  signupLimiter,
  generalLimiter,
  aiLimiter,
};
