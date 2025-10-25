import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthForm from "../components/auth/AuthForm.jsx";
import VerifyOtpForm from "../components/auth/VerifyOtpForm.jsx";

export default function Auth() {
  const [step, setStep] = useState("send-otp");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleOtpSent = (email, name) => {
    setUserEmail(email);
    setUserName(name);
    setStep("verify-otp");
  };

  const handleGoBack = () => {
    setStep("send-otp");
    setUserEmail("");
    setUserName("");
  };

  const handleSuccess = (result) => {
    navigate("/dashboard", { replace: true });

    alert(
      `Welcome ${result.user.name || result.user.email}! Login successful.`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader className="text-center">
            {step === "verify-otp" && (
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoBack}
                  className="p-2 hover:bg-transparent text-white hover:text-gray-400"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
              </div>
            )}
            <CardTitle className="text-2xl font-bold text-white">
              {step === "send-otp"
                ? "Welcome to ClimeCast"
                : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {step === "send-otp" ? (
                "Enter your email to receive a verification code"
              ) : (
                <>
                  We've sent a 6-digit code to{" "}
                  <em className="font-medium">{userEmail}</em>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "send-otp" ? (
              <AuthForm onOtpSent={handleOtpSent} />
            ) : (
              <VerifyOtpForm
                email={userEmail}
                name={userName}
                onGoBack={handleGoBack}
                onSuccess={handleSuccess}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
