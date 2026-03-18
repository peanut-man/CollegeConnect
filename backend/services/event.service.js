const eventModel = require("../models/event.model");
const collegeModel = require("../models/college.model");
const AppError = require("../utils/appError");

module.exports.createEvent = async (eventData, user) => {
  const { title, description, category, eventDate, eventTime, externalLink } =
    eventData;
  const event = await eventModel.create({
    title,
    description,
    category,
    eventDate,
    eventTime,
    collegeId: user.collegeId,
    organizerId: user._id,
    externalLink,
  });
  return event;
};

module.exports.getAllEvents = async (options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(options.limit) || 10));
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    eventModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    eventModel.countDocuments({ isActive: true }),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports.getEventById = async (eventId) => {
  const event = await eventModel.findOne({ _id: eventId, isActive: true });
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  return event;
};

module.exports.updateEventById = async (eventId, updateData, user) => {
  const event = await eventModel.findOne({ _id: eventId, isActive: true });
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  // Authorization: Organizer or Admin can update the event
  if (
    event.organizerId.toString() !== user._id.toString() &&
    user.role !== "Admin"
  ) {
    throw new AppError(
      "Unauthorized: Only the organizer or Admin can update this event",
      403,
    );
  }
  const updatedEvent = await eventModel.findByIdAndUpdate(
    eventId,
    updateData,
    { new: true },
  );
  return updatedEvent;
};

module.exports.deleteEventById = async (eventId, user) => {
  const event = await eventModel.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  // Authorization: Organizer or Admin can delete the event
  if (
    event.organizerId.toString() !== user._id.toString() &&
    user.role !== "Admin"
  ) {
    throw new AppError(
      "Unauthorized: Only the organizer or Admin can delete this event",
      403,
    );
  }
  // Soft delete: set isActive to false
  const deletedEvent = await eventModel.findByIdAndUpdate(
    eventId,
    { isActive: false },
    { new: true },
  );
  return deletedEvent;
};

module.exports.getEventByCollegeId = async (collegeId) => {
  // Fetch events by collegeId where isActive is true and sort by recently created
  const events = await eventModel
    .find({
      collegeId: collegeId,
      isActive: true,
    })
    .select("-collegeId")
    .sort({ createdAt: -1 });
  return events;
};

module.exports.getTrendingEvents = async () => {
  // Fetch events sorted by likesCount and createdAt in descending order, limit to top 10
  const events = await eventModel
    .find({ isActive: true })
    .select("-collegeId")
    .sort({ likesCount: -1, createdAt: -1 })
    .limit(10);
  return events;
};

module.exports.getNearbyEvents = async (collegeId) => {
  // Fetch user's college to get coordinates
  const college = await collegeModel.findById(collegeId);
  if (!college) {
    throw new AppError("College not found", 404);
  }

  // Use $geoNear aggregation to find colleges within 50km
  const nearbyColleges = await collegeModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [college.longitude, college.latitude],
        },
        distanceField: "distance",
        maxDistance: 50000, // 50 km in meters
        spherical: true,
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  const nearbyCollegeIds = nearbyColleges.map((c) => c._id);

  // Fetch events from nearby colleges
  const events = await eventModel
    .find({
      collegeId: { $in: nearbyCollegeIds },
      isActive: true,
    })
    .select("-collegeId")
    .sort({ createdAt: -1 });

  return events;
};