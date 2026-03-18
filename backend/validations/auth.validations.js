const { body } = require("express-validator");
const collegeModel = require("../models/college.model");
const mongoose = require("mongoose");

exports.signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required.")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters."),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("role is required")
    .bail()
    .isIn(["Student", "Organizer"])
    .withMessage("role not allowed"),
  body("collegeId")
    .trim()
    .notEmpty()
    .withMessage("collegeId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid collegeId format")
    .custom(async (value) => {
      const college = await collegeModel.findById(value);
      if (!college) {
        throw new Error("College does not exist");
      }
      return true;
    }),
];

exports.loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters."),
];
