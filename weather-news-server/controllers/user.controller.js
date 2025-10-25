const logger = require("../utils/logger");
const User = require("../models/user.model");

const getUserProfile = async (req, res, next) => {
  try {
    res.json({ status: "success", data: req.user });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (preferences) {
      if (preferences.theme)
        updateData["preferences.theme"] = preferences.theme;
      if (preferences.defaultLocation) {
        updateData["preferences.defaultLocation"] = preferences.defaultLocation;
      }
      if (preferences.newsTopics) {
        updateData["preferences.newsTopics"] = preferences.newsTopics;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-refreshTokens");

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile };
