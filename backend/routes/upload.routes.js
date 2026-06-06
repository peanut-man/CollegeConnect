const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

router.post(
  "/",
  authMiddleware.getUser,
  roleMiddleware.requireRole("Admin", "Organizer"),
  upload.single("image"),
  uploadImage
);

module.exports = router;
