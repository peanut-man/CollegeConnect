const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware.getUser,
  roleMiddleware.requireRole("Admin"),
  getAllUsers
);

module.exports = router;
