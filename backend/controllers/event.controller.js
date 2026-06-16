const eventService = require("../services/event.service");
const AppError = require("../utils/appError");

// CREATE EVENT
module.exports.createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EVENTS
module.exports.getAllEvents = async (req, res, next) => {
  try {
    const { page, limit, category, search } = req.query;
    const result = await eventService.getAllEvents({
      page,
      limit,
      category,
      search,
    });

    res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET EVENT BY ID
module.exports.getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await eventService.getEventById(eventId);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE EVENT BY ID
module.exports.updateEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;
    const user = req.user;

    const updatedEvent = await eventService.updateEventById(
      eventId,
      updateData,
      user,
    );

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE EVENT BY ID (SOFT DELETE)
module.exports.deleteEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    const deletedEvent = await eventService.deleteEventById(eventId, user);

    res.status(200).json({
      success: true,
      data: deletedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// GET EVENTS BY USER'S COLLEGE
module.exports.getEventByCollegeId = async (req, res, next) => {
  try {
    const { collegeId } = req.user;

    if (!collegeId) {
      return next(new AppError("User is not associated with a college", 400));
    }

    const events = await eventService.getEventByCollegeId(collegeId);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// GET TRENDING EVENTS
module.exports.getTrendingEvents = async (req, res, next) => {
  try {
    const events = await eventService.getTrendingEvents();
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// GET NEARBY EVENTS
module.exports.getNearbyEvents = async (req, res, next) => {
  try {
    const { collegeId } = req.user;
    if (!collegeId) {
      return next(new AppError("User is not associated with a college", 400));
    }
    const events = await eventService.getNearbyEvents(collegeId);
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
