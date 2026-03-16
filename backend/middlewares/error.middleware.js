module.exports = (err, req, res, next) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    const shouldLogStack = !err?.isOperational && statusCode >= 500;
    if (shouldLogStack) {
      console.error(err);
    } else {
      console.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${message}`);
    }
  } else {
    // Log critical errors in production for debugging
    if (statusCode >= 500) {
      console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${statusCode}:`, err);
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
