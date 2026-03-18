const authService = require("../services/auth.service");

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: TOKEN_EXPIRY_MS,
  };
}

module.exports.signUpUser = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);
    const token = user.generateAuthToken();
    res.cookie("token", token, getAuthCookieOptions());
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    const token = user.generateAuthToken();
    res.cookie("token", token, getAuthCookieOptions());
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  res.status(200).json({ user: req.user ?? null });
};

module.exports.logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
