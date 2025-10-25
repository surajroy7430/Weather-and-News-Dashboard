const otpStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of otpStore.entries()) {
    if (now > record.expires) {
      otpStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

const generateOtp = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return otp;
};

const saveOtp = (email, otp) => {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
    createdAt: Date.now(),
    attempts: 0,
  });
};

const verifyOtp = (email, otp) => {
  const record = otpStore.get(email);
  if (!record) return { success: false, message: "OTP not found or expired" };

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return { success: false, message: "OTP has expired" };
  }

  if (record.otp === otp) {
    otpStore.delete(email);
    return { success: true, message: "OTP verified successfully" };
  }

  record.attempts += 1;
  if (record.attempts >= 3) {
    otpStore.delete(email);
    return { success: false, message: "Too many failed attempts" };
  }

  return {
    success: false,
    message: `Invalid OTP. ${3 - record.attempts} attempts remaining`,
  };
};

const getOtpInfo = (email) => {
  const record = otpStore.get(email);

  if (!record) return null;

  return {
    exists: true,
    expiresIn: Math.max(0, Math.floor((record.expires - Date.now()) / 1000)),
    attempts: record.attempts,
    ...(process.env.NODE_ENV !== "production" && { otp: record.otp }),
  };
};

module.exports = { generateOtp, saveOtp, verifyOtp, getOtpInfo };
