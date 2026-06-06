module.exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    res.status(200).json({
      success: true,
      data: { url: req.file.path },
    });
  } catch (error) {
    next(error);
  }
};
