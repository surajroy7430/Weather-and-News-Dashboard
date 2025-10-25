const { Router } = require("express");
const limitRateRequest = require("../middlewares/limiter.middleware");
const {
  sendOtpValidator,
  verifyOtpValidator,
} = require("../middlewares/validator/auth.validator");
const { runValidation } = require("../middlewares/validator/runValidation");
const {
  sendOtpToUser,
  verifyUserOtp,
  refreshTokenRoute,
  logout,
} = require("../controllers/auth.controller");

const router = Router();

router.post("/send-otp", sendOtpValidator, runValidation, sendOtpToUser);
router.post("/verify-otp", verifyOtpValidator, runValidation, verifyUserOtp);
router.post("/refresh", refreshTokenRoute);
router.post("/logout", logout);

module.exports = router;
