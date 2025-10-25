const logger = require("../utils/logger");
const User = require("../models/user.model");

const getSavedLocation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("savedLocations");

    res.json({ status: "success", data: user.savedLocations || [] });
  } catch (error) {
    next(error);
  }
};

const addNewLocation = async (req, res, next) => {
  try {
    const { name, lat, lon, country, temp, icon, condition } = req.body;
    const user = await User.findById(req.user._id);

    // Check if location already exists
    const existingLocation = user.savedLocations.find(
      (location) => location.name.toLowerCase() === name.toLowerCase()
    );

    if (existingLocation) {
      return res.status(400).json({
        status: "error",
        code: "LOCATION_EXISTS",
        message: "Location already saved",
      });
    }

    if (user.savedLocations.length >= 10) {
      return res.status(400).json({
        status: "error",
        code: "LOCATION_LIMIT",
        message: "Maximum number of saved locations reached (10)",
      });
    }

    const newLocation = {
      name,
      country,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      temp: parseInt(temp),
      icon,
      condition,
      createdAt: new Date(),
    };

    user.savedLocations.push(newLocation);
    await user.save();

    const savedLocation = user.savedLocations[user.savedLocations.length - 1];

    logger.info(`Location added: ${name} for user ${user.email}`);

    res.status(201).json({
      status: "success",
      message: "Location saved successfully",
      data: savedLocation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSavedLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    // Find and remove location
    const locationIndex = user.savedLocations.findIndex(
      (location) => location._id.toString() === id
    );

    if (locationIndex === -1) {
      return res.status(404).json({
        status: "error",
        code: "LOCATION_NOT_FOUND",
        message: "Location not found",
      });
    }

    const removedLocation = user.savedLocations[locationIndex];
    user.savedLocations.splice(locationIndex, 1);
    await user.save();

    logger.info(
      `Location removed: ${removedLocation.name} for user ${user.email}`
    );

    res.json({
      status: "success",
      message: "Location removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSavedLocation, addNewLocation, deleteSavedLocation };
