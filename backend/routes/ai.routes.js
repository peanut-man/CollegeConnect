const { Router } = require("express");
const aiController = require("../controllers/ai.controller");
const { aiQueryValidation } = require("../validations/ai.validations");
const { validateMiddleware } = require("../middlewares/validate.middleware");
const { aiLimiter } = require("../middlewares/rateLimit.middleware");

const router = Router();

router.post(
  "/query",
  aiLimiter,
  aiQueryValidation,
  validateMiddleware,
  aiController.processQuery
);

module.exports = router;
