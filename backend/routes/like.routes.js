const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  likeEvent,
  unlikeEvent
} = require("../controllers/like.controller");

router.post(
    '/:eventId/like', 
    authMiddleware.getUser,
    likeEvent
);

router.delete(
    '/:eventId/like',
    authMiddleware.getUser,
    unlikeEvent
)

module.exports = router;