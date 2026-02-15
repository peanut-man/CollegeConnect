const {body} = require('express-validator');

exports.createEventValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(["Hackathon", "Seminar", "Fest", "Workshop", "Other"]).withMessage('Invalid category'),
    body('eventDate')
        .notEmpty().withMessage('Event date is required')
        .isISO8601().withMessage('Event date must be a valid date'),
    body('eventTime')
        .notEmpty().withMessage('Event time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Event time must be in HH:MM format'),
    body('collegeId')
        .notEmpty().withMessage('College ID is required')
        .isMongoId().withMessage('College ID must be a valid Mongo ID'),
    body('externalLink')
        .optional()
        .isURL().withMessage('External link must be a valid URL')
        
];