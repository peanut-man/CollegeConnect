const express = require("express");
const router = express.Router();
const {
  createCollege,
  getAllColleges,
} = require("../controllers/college.controller");
const {
  createCollegeValidation,
} = require("../validations/college.validations");
const validateMiddleware = require("../middlewares/validate.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/",
  createCollegeValidation,
  validateMiddleware,
  roleMiddleware.requireRole("Admin"),
  createCollege
);

router.get("/", getAllColleges);

module.exports = router;
