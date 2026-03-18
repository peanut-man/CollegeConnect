const collegeModel = require("../models/college.model");
const AppError = require("../utils/appError");

module.exports.createCollege = async (collegeData) => {
  try {
    const { name, city, state, latitude, longitude } = collegeData;
    const college = await collegeModel.create({
      name,
      city,
      state,
      latitude,
      longitude,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON: [lng, lat]
      },
    });
    return college;
  } catch (error) {
    throw new AppError("Error creating college: " + error.message, 500);
  }
};
