const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  preferences: {
    theme: { type: String, enum: ["light", "dark"], default: "dark" },
    defaultLocation: { name: String, lat: Number, lon: Number },
    newsTopics: [{ type: String, trim: true }],
  },
  savedLocations: [
    {
      name: { type: String, required: true },
      country: {type: String, required: true},
      lat: { type: String, required: true, min: -90, max: 90 },
      lon: { type: String, required: true, min: -180, max: 180 },
      temp: { type: Number, required: true },
      icon: { type: String, required: true },
      condition: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  refreshTokens: [
    {
      token: String,
      createdAt: { type: Date, default: Date.now },
      expires: { type: Number, default: 7 * 24 * 60 * 60 * 1000 },
    },
  ],
});

// Remove refreshTokens from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.refreshTokens;
  return obj;
};

// Clean up expired refresh tokens (7 days)
userSchema.methods.cleanExpiredTokens = function () {
  const expiry = 7 * 24 * 60 * 60 * 1000;

  this.refreshTokens = this.refreshTokens.filter(
    (tokenObj) => tokenObj.createdAt.getTime() + expiry > Date.now()
  );
};

module.exports = mongoose.model("User", userSchema);
