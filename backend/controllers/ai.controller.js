const aiService = require("../services/ai.service");
const AppError = require("../utils/appError");

module.exports.processQuery = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) {
      throw new AppError("Query is required", 400);
    }

    const result = await aiService.processQuery(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
