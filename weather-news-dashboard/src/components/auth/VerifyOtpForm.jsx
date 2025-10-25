import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { createAuthApi } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export default function VerifyOtpForm({ email, name, onSuccess }) {
  const { checkAuth } = useAuth();
  const { verifyOtp, sendOtp } = createAuthApi();
  const [resendLoading, setResendLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const otpRef = useRef(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async () => {
    if (!email || otp.length !== 6) {
      setError("Email is missing or invalid OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await verifyOtp(email, otp, name);
    if (result.success) {
      await checkAuth();
      onSuccess(result);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const handleOtpChange = (value) => {
    setOtp(value.toUpperCase());
    setValue("otp", value);
    if (value.length === 6) {
      trigger("otp");
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    setOtp("");
    setValue("otp", "");

    try {
      await sendOtp(email, name);
      setTimeout(() => otpRef.current?.focus(), 50);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            autoFocus
            disabled={resendLoading}
            onChange={handleOtpChange}
            className="uppercase"
            ref={otpRef}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.otp && (
          <p className="text-sm text-red-500 text-center">
            {errors.otp.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full text-white hover:text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors duration-200"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="text-center text-sm text-gray-300">
        Didn't receive the code?
        <Button
          variant="link"
          onClick={handleResend}
          disabled={resendLoading}
          className="p-0 ml-1 text-sm text-blue-400 hover:text-blue-300 hover:underline-offset-2 h-0"
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
    </form>
  );
}
