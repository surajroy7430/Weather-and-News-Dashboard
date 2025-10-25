const { Router } = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { runValidation } = require("../middlewares/validator/runValidation");
const {
  addLocationValidator,
  deleteLocationValidator,
} = require("../middlewares/validator/location.validator");
const {
  getSavedLocation,
  addNewLocation,
  deleteSavedLocation,
} = require("../controllers/location.controller");

const router = Router();
router.use(authenticateToken);

router.get("/", getSavedLocation);
router.post("/", addLocationValidator, runValidation, addNewLocation);
router.delete("/:id", deleteLocationValidator, runValidation, deleteSavedLocation);

module.exports = router;
