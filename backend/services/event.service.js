const eventModel = require("../models/event.model");
const collegeModel = require("../models/college.model");
const { getDistanceFromLatLonInKm } = require("../utils/geo");
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

module.exports.getAllEvents = async () => {
  const events = await eventModel.find({ isActive: true });
  return events;
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
  //fetch latitude/longitude of user's college
  const college = await collegeModel.findById(collegeId);
  if (!college) {
    throw new AppError("College not found", 404);
  }
  const { latitude, longitude } = college; 

  //fetch all colleges
  const allColleges = await collegeModel.find({});

  //filter colleges within certain radius
  const nearbyColleges = allColleges.filter(college => {
    const distance = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      college.latitude,
      college.longitude
    );
    return distance <= 50; // e.g., within 50 km radius
  });

  const nearbyCollegeIds = nearbyColleges.map(college => college._id);
  const events = await eventModel.find({ 
    collegeId: { $in: nearbyCollegeIds },
    isActive: true 
  }).select("-collegeId").sort({ createdAt: -1 });
  return events;
};