import { useFetch } from "@/hooks/use-fetch";

export const createAuthApi = () => {
  const { request } = useFetch();

  const sendOtp = async (email, name) => {
    try {
      const response = await request({
        url: "/auth/send-otp",
        method: "POST",
        data: { email, name },
      });

      if (response.success) {
        return { success: true };
      }

      const errorMessage =
        response.error || response.message || "Failed to send OTP";
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      return { success: false, error: errorMessage };
    }
  };

  const verifyOtp = async (email, otp, name) => {
    try {
      const response = await request({
        url: "/auth/verify-otp",
        method: "POST",
        data: { email, otp, name },
      });

      if (response.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        return {
          success: true,
          user: response.data.data.user,
          accessToken: response.data.data.accessToken,
        };
      }

      const errorMessage =
        response.error || response.message || "Failed to verify OTP";
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to verify OTP";
      return { success: false, error: errorMessage };
    }
  };

  return { sendOtp, verifyOtp };
};
