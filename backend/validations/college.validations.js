const {body} = require("express-validator");

exports.createCollegeValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('city')
        .notEmpty().withMessage('City is required')
        .isString().withMessage('City must be a string'),
    body('state')
        .notEmpty().withMessage('State is required')
        .isString().withMessage('State must be a string'),
    body('latitude')
        .notEmpty().withMessage('Latitude is required')
        .isFloat().withMessage('Latitude must be a number'),
    body('longitude')
        .notEmpty().withMessage('Longitude is required')
        .isFloat().withMessage('Longitude must be a number')
];