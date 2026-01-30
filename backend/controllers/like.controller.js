const likeService = require("../services/like.service");

//like event
module.exports.likeEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    const event = await likeService.likeEvent(eventId, user);
    res.status(200).json({
    success: true,
    data: event
});
  } catch (error) {
    next(error);
  }
};

//unlike event
module.exports.unlikeEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const user = req.user;
    const event = await likeService.unlikeEvent(eventId, user);
    res.status(200).json({
    success: true,
    data: event
});
  } catch (error) {
    next(error);
  }
};
