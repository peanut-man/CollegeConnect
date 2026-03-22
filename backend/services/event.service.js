const eventModel = require("../models/event.model");
const collegeModel = require("../models/college.model");
const AppError = require("../utils/appError");
const redisClient = require("../config/redis");
const notificationQueue = require("../queues/notification.queue");

const TRENDING_CACHE_KEY = "trending_events";
const TRENDING_CACHE_TTL = 60; // seconds

module.exports.invalidateTrendingCache = async () => {
  try {
    if (redisClient) {
      await redisClient.del(TRENDING_CACHE_KEY);
    }
  } catch (err) {
    console.error("Redis cache invalidation error:", err.message);
  }
};

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

  // Queue email notification (non-blocking)
  if (notificationQueue) {
    try {
      await notificationQueue.add("send-event-email", {
        eventId: event._id.toString(),
        collegeId: user.collegeId.toString(),
      });
    } catch (err) {
      console.error("Failed to queue notification:", err.message);
    }
  }

  return event;
};

module.exports.getAllEvents = async (options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(options.limit) || 10));
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    eventModel
      .find({ isActive: true })
      .populate("collegeId", "name city state")
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
  const event = await eventModel
    .findOne({ _id: eventId, isActive: true })
    .populate("collegeId", "name city state")
    .populate("organizerId", "name");
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
    .populate("collegeId", "name city state")
    .sort({ createdAt: -1 });
  return events;
};

module.exports.getTrendingEvents = async () => {
  // Try to get from Redis cache first
  try {
    if (redisClient) {
      const cached = await redisClient.get(TRENDING_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    }
  } catch (err) {
    console.error("Redis get error:", err.message);
  }

  // Fetch from MongoDB if cache miss or Redis unavailable
  const events = await eventModel
    .find({ isActive: true })
    .populate("collegeId", "name city state")
    .sort({ likesCount: -1, createdAt: -1 })
    .limit(10);

  // Store in Redis cache
  try {
    if (redisClient) {
      await redisClient.set(TRENDING_CACHE_KEY, JSON.stringify(events), {
        EX: TRENDING_CACHE_TTL,
      });
    }
  } catch (err) {
    console.error("Redis set error:", err.message);
  }

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
    .populate("collegeId", "name city state")
    .sort({ createdAt: -1 });

  return events;
};