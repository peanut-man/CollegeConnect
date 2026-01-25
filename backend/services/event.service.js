const eventModel = require("../models/event.model");

module.exports.createEvent = async (eventData) => {
  try {
    const { title, description, category, eventDate, eventTime, externalLink } =
      eventData;
    const event = await eventModel.create({
      title,
      description,
      category,
      eventDate,
      eventTime,
      collegeId: eventData.collegeId,
      organizerId: eventData.id,
      externalLink,
    });
    return event;
  } catch (error) {
    throw new Error("Error creating event: " + error.message);
  }
};

module.exports.getAllEvents = async () => {
  try {
    const events = await eventModel.find({});
    return events;
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
};

module.exports.getEventById = async (eventId) => {
  try {
    const event = await eventModel.findById(eventId);
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
      event.organizerId.toString() !== user.id.toString() &&
      user.role !== "Admin"
    ) {
      throw new Error(
        "Unauthorized: Only the organizer or Admin can update this event"
      );
    }
    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true }
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
            event.organizerId.toString() !== user.id.toString() && user.role !== "Admin"
        ) {
            throw new Error(
                "Unauthorized: Only the organizer or Admin can delete this event"
            );
        }
        // Soft delete: set isActive to false
        const deletedEvent = await eventModel.findByIdAndUpdate(
            eventId,
            { isActive: false },
            { new: true }
        );
        return deletedEvent;
    } catch (error) {
        throw new Error("Error deleting event by ID: " + error.message);
    }
};