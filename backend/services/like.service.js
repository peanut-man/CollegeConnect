const eventModel = require("../models/event.model");
const likeModel = require("../models/like.model");

//like event
module.exports.likeEvent = async (eventId, user) => {
  try {
    // Check if the event exists and is active
    const event = await eventModel.findOne({ _id: eventId, isActive: true });
    if (!event) {
      throw new Error("Event not found or is inactive");
    }
    // Check if the user has already liked the event
    const existingLike = await likeModel.findOne({
      userId: user._id,
      eventId: eventId,
    });
    if (existingLike) {
      throw new Error("You have already liked this event");
    }
    // Create a new like
    const like = await likeModel.create({
      userId: user._id,
      eventId: eventId,
    });

    // Increase likeCount in event document
    await eventModel.updateOne({ _id: eventId }, { $inc: { likeCount: 1 } });

    return like;
  } catch (error) {
    throw new Error("Error liking event: " + error.message);
  }
};

//unlike event

module.exports.unlikeEvent = async (eventId, user) => {
  try {
    // Check if the like exists
    const existingLike = await likeModel.findOne({
      userId: user._id,
      eventId: eventId,
    });
    if (!existingLike) {
      throw new Error("You have not liked this event");
    }
    // Remove the like
    await likeModel.deleteOne({ _id: existingLike._id });

    // Decrease likeCount in event document
    await eventModel.updateOne(
      { _id: eventId, likeCount: { $gt: 0 } },
      { $inc: { likeCount: -1 } },
    );

    return { message: "Event unliked successfully" };
  } catch (error) {
    throw new Error("Error unliking event: " + error.message);
  }
};
