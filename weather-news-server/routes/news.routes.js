const { Router } = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { runValidation } = require("../middlewares/validator/runValidation");
const { newsValidator } = require("../middlewares/validator/news.validator");
const {
  getNewsArticles,
  getNewsSources,
} = require("../controllers/news.controller");

const router = Router();
router.use(authenticateToken);

router.get("/", newsValidator, runValidation, getNewsArticles);
router.get("/sources", getNewsSources);

module.exports = router;
