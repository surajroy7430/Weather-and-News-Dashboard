const axios = require("axios");
const logger = require("../utils/logger");
const User = require("../models/user.model");
const sendOtpMail = require("../utils/sendMail");
const { generateOtp, saveOtp, verifyOtp } = require("../utils/otp");
const { generateTokens, verifyRefreshToken } = require("../utils/jwt");

const sendOtpToUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOtp();
    saveOtp(email, otp); // save otp temporarily

    // Get client IP
    let clientIp = null;
    try {
      const ipRes = await axios.get("https://api64.ipify.org?format=json");
      clientIp = ipRes.data.ip;
    } catch (err) {
      logger.error("Failed to fetch ip", err);
      clientIp =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "Unknown";
    }

    await sendOtpMail(email, name, otp, clientIp);

    return res.json({
      status: "success",
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyUserOtp = async (req, res, next) => {
  try {
    const { name, email, otp } = req.body;

    const valid = verifyOtp(email, otp);
    if (!valid.success)
      return res.status(400).json({
        status: "error",
        code: "INVALID_OTP",
        message: valid.message,
      });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
      logger.info(`New user created: ${email}`);
    }

    user.cleanExpiredTokens();

    const { accessToken, refreshToken } = generateTokens(user._id);

    // save refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`User logged in: ${email}`);

    const userResponse = user.toJSON();

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: userResponse,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshTokenRoute = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        code: "NO_REFRESH_TOKEN",
        message: "Refresh token required",
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        status: "error",
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token expired or invalid",
      });
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.some((t) => t.token === refreshToken)) {
      return res.status(401).json({
        status: "error",
        code: "INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token",
      });
    }

    // Clean expired tokens before generating new ones
    user.cleanExpiredTokens();

    // Generate new access token
    const { accessToken } = generateTokens(user._id);

    res.json({
      status: "success",
      message: "Token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t.token !== refreshToken
        );
        await user.save();
      }
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendOtpToUser, verifyUserOtp, refreshTokenRoute, logout };
