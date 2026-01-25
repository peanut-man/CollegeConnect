const collegeModel = require("../models/college.model");

module.exports.createCollege = async (collegeData) => {
  try {
    const { name, city, state, latitude, longitude } = collegeData;
    const college = await collegeModel.create({
      name,
      city,
      state,
      latitude,
      longitude,
    });
    return college;
  } catch (error) {
    throw new Error("Error creating college: " + error.message);
  }
};
