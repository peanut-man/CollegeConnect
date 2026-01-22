const { body } = require("express-validator");
const collegeModel = require("../models/college.model");
const mongoose = require("mongoose");

exports.signupValidation = [
  body("name").notEmpty().withMessage("name is required."),
  body("email").isEmail().withMessage("Invalid email."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters."),
  body("role")
    .isIn(["Student", "Organizer", "Admin"])
    .withMessage("Role must be Student, Organizer, or Admin."),
  body("collegeId")
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
  body("email").isEmail().withMessage("Invalid email."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters."),
];
