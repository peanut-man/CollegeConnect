const express = require("express");
const router = express.Router();
const { createCollege, getAllColleges, searchColleges } = require("../controllers/college.controller");
const { createCollegeValidation } = require("../validations/college.validations");
const {validateMiddleware} = require("../middlewares/validate.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/",
  authMiddleware.getUser,
  createCollegeValidation,
  validateMiddleware,
  roleMiddleware.requireRole("Admin"),
  createCollege
);

router.get("/search", searchColleges);

router.get("/", getAllColleges);

module.exports = router;
