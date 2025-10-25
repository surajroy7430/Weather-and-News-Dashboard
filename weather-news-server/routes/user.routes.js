const { Router } = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  updateProfileValidator,
} = require("../middlewares/validator/updateProfile.validator");
const { runValidation } = require("../middlewares/validator/runValidation");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller");

const router = Router();
router.use(authenticateToken);

router.get("/me", getUserProfile);
router.put("/me", updateProfileValidator, runValidation, updateUserProfile);

module.exports = router;
