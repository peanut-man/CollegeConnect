const userModel = require("../models/user.model");
const authService = require("../services/auth.service");

module.exports.signUpUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await authService.createUser(req.body);
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.status(200).json({ message: "Logged out successfully" });
};
