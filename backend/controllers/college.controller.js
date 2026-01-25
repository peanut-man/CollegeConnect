const collegeModel = require('../models/college.model');
const collegeService = require('../services/college.service');

module.exports.createCollege = async (req, res, next) => {
    try {
        const college = await collegeService.createCollege(req.body);
        res.status(201).json({
            success: true,
            data: college
        });

    } catch (error) {
        next(error);
    }
    
}

module.exports.getAllColleges = async (req, res, next) => {
    try {
        const colleges = await collegeModel.find({});
        res.status(200).json({
            success: true,
            data: colleges
        });
    } catch (error) {
        next(error);
    }
}