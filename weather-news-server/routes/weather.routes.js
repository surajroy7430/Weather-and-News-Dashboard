const { Router } = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { runValidation } = require("../middlewares/validator/runValidation");
const {
  weatherValidator,
} = require("../middlewares/validator/weather.validator");
const {
  getCurrentWeather,
  getWeatherForecast,
} = require("../controllers/weather.controller");

const router = Router();
router.use(authenticateToken, weatherValidator, runValidation);

router.get("/current", getCurrentWeather);
router.get("/forecast", getWeatherForecast);

module.exports = router;
