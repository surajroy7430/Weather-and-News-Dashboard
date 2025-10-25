const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");
    return true;
  } catch (error) {
    logger.error("Error connecting to DB:", error);
    return false;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("disconnected from MongoDB");
  } catch (error) {
    logger.error("Error disconnecting from DB:", error);
  }
};

module.exports = { connectToDB, disconnectDB };
