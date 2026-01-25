const {createEvent, getAllEvents, getEventById, updateEventById, deleteEventById} = require('../services/event.service');
const eventModel = require('../models/event.model');

// createEvent
module.exports.createEvent = async (req, res, next) => {
    try {
        const event = await createEvent(req.body);
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// getAllEvents
module.exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await getAllEvents();
        res.status(200).json({
            success: true,
            data: events
        });
    }
    catch (error) {
        next(error);
    }
};

//getEventsByEventId
module.exports.getEventById = async (req, res, next) => {
    try {
        const eventId = req.params.eventId; 
        const event = await getEventById(eventId);
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }   
};

//updateEventById
module.exports.updateEventById = async (req, res, next) => {
    try {   
        const eventId = req.params.eventId;
        const updateData = req.body;
        const user = req.user;
        const event = await updateEventById(eventId, updateData, user);
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

//deleteEventById (soft delete)
module.exports.deleteEventById = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const user = req.user;
        const event = await deleteEventById(eventId, user);
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }       
};
