const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getEventByCollegeId,
  getTrendingEvents,
  getNearbyEvents
} = require("../controllers/event.controller");
const { createEventValidation } = require("../validations/event.validations");
const {validateMiddleware} = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/",
  authMiddleware.getUser, 
  roleMiddleware.requireRole("Admin", "Organizer"),
  createEventValidation,
  validateMiddleware,
  createEvent
);

router.get(
  "/", 
  getAllEvents
);

router.get(
  "/my-college", 
  authMiddleware.getUser, 
  getEventByCollegeId
);

router.get(
  '/trending',
  getTrendingEvents
)

router.get(
  '/nearby',
  authMiddleware.getUser,
  getNearbyEvents
)

router.get(
  "/:eventId", 
  getEventById
);

router.put(
  "/:eventId",
  authMiddleware.getUser,
  roleMiddleware.requireRole("Admin", "Organizer"),
  updateEventById
);

router.delete(
  "/:eventId",
  authMiddleware.getUser,
  roleMiddleware.requireRole("Admin", "Organizer"),
  deleteEventById
);




module.exports = router;
