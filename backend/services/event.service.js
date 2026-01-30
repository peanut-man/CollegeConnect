const eventModel = require("../models/event.model");

module.exports.createEvent = async (eventData, user) => {
  try {
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
  } catch (error) {
    throw new Error("Error creating event: " + error.message);
  }
};

module.exports.getAllEvents = async () => {
  try {
    const events = await eventModel.find({ isActive: true });
    return events;
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
};

module.exports.getEventById = async (eventId) => {
  try {
    const event = await eventModel.findById({ _id: eventId, isActive: true });
    return event;
  } catch (error) {
    throw new Error("Error fetching event by ID: " + error.message);
  }
};

module.exports.updateEventById = async (eventId, updateData, user) => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    // Authorization: Organizer or Admin can update the event
    if (
      event.organizerId.toString() !== user._id.toString() &&
      user.role !== "Admin"
    ) {
      throw new Error(
        "Unauthorized: Only the organizer or Admin can update this event",
      );
    }
    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true },
    );
    return updatedEvent;
  } catch (error) {
    throw new Error("Error updating event by ID: " + error.message);
  }
};

module.exports.deleteEventById = async (eventId, user) => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    // Authorization: Organizer or Admin can delete the event
    if (
      event.organizerId.toString() !== user._id.toString() &&
      user.role !== "Admin"
    ) {
      throw new Error(
        "Unauthorized: Only the organizer or Admin can delete this event",
      );
    }
    // Soft delete: set isActive to false
    const deletedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      { isActive: false },
      { new: true },
    );
    return deletedEvent;
  } catch (error) {
    throw new Error("Error deleting event by ID: " + error.message);
  }
};

module.exports.getEventByCollegeId = async (collegeId) => {
  try {
    // Fetch events by collegeId where isActive is true and sort by recently created
    const events = await eventModel
      .find({
        collegeId: collegeId,
        isActive: true,
      })
      .select("-collegeId")
      .sort({ createdAt: -1 });
    return events;
  } catch (error) {
    throw new Error("Error fetching events by college ID: " + error.message);
  }
};

module.exports.getTrendingEvents = async () => {
  try {
    // Fetch events sorted by likesCount and createdAt in descending order, limit to top 10
    const events = await eventModel
      .find({ isActive: true })
      .select("-collegeId")
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(10);
    return events;
  } catch (error) {
    throw new Error("Error fetching trending events: " + error.message);
  }
};

module.exports.getNearbyEvents = async (collegeId) => {
  try {
    //fetch latitude/longitude of user's college
    const college = await collegeModel.findById(collegeId);
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
  } catch (error) {
    throw new Error("Error fetching nearby events: " + error.message);
  }
};

// Helper function to calculate distance between two lat/lon points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}