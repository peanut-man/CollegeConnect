const eventModel = require("../models/event.model");
const likeModel = require("../models/like.model");
const AppError = require("../utils/appError");

//like event
module.exports.likeEvent = async (eventId, user) => {
  // Check if the event exists and is active
  const event = await eventModel.findOne({ _id: eventId, isActive: true });
  if (!event) {
    throw new AppError("Event not found or is inactive", 404);
  }
  // Check if the user has already liked the event
  const existingLike = await likeModel.findOne({
    userId: user._id,
    eventId: eventId,
  });
  if (existingLike) {
    throw new AppError("You have already liked this event", 409);
  }
  // Create a new like
  const like = await likeModel.create({
    userId: user._id,
    eventId: eventId,
  });

  // Increase likesCount in event document
  await eventModel.updateOne({ _id: eventId }, { $inc: { likesCount: 1 } });

  return like;
};

//unlike event

module.exports.unlikeEvent = async (eventId, user) => {
  // Check if the like exists
  const existingLike = await likeModel.findOne({
    userId: user._id,
    eventId: eventId,
  });
  if (!existingLike) {
    throw new AppError("You have not liked this event", 400);
  }
  // Remove the like
  await likeModel.deleteOne({ _id: existingLike._id });

  // Decrease likesCount in event document
  await eventModel.updateOne(
    { _id: eventId, likesCount: { $gt: 0 } },
    { $inc: { likesCount: -1 } },
  );

  return { message: "Event unliked successfully" };
};
