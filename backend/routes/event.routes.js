const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
} = require("../controllers/event.controller");
const { createEventValidation } = require("../validations/event.validations");
const validateMiddleware = require("../middlewares/validate.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/",
  createEventValidation,
  validateMiddleware,
  roleMiddleware.requireRole("Admin", "Organizer"),
  createEvent
);

router.get("/", getAllEvents);

router.get("/:eventId", getEventById);

router.put(
  "/:eventId",
  roleMiddleware.requireRole("Admin", "Organizer"),
  updateEventById
);

router.delete(
  "/:eventId",
  roleMiddleware.requireRole("Admin", "Organizer"),
  deleteEventById
);

module.exports = router;
