"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyPasswordResetOTPSchema,
  resetPasswordSchema,
  type VerifyPasswordResetOTPSchema,
  type ResetPasswordSchema,
} from "@/schemas";
import {
  useVerifyPasswordResetOTP,
  useResetPassword,
  useForgotPassword,
} from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const inputClass =
  "w-full h-[44px] pl-10 pr-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[13.5px] text-[#6b7280] placeholder:text-[#b0b8c8] outline-none transition-all hover:border-[#c5cad6] focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10 focus:text-[#374151]";
const labelClass = "block text-[12.5px] font-medium text-[#374151] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1.5 flex items-center gap-1";

function calculateStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { verify: performVerifyOTP } = useVerifyPasswordResetOTP();
  const { reset: performResetPassword } = useResetPassword();
  const { forgotPassword: performResendOTP } = useForgotPassword();
  const { isLoading, resetToken, resetPasswordEmail } = useAuthStore();

  // Redirect if no email
  useEffect(() => {
    if (!email && !resetPasswordEmail) {
      router.replace("/auth/forgot-password");
    }
  }, [email, resetPasswordEmail, router]);

  // Resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const otpForm = useForm<VerifyPasswordResetOTPSchema>({
    resolver: zodResolver(verifyPasswordResetOTPSchema),
    defaultValues: { email: email || resetPasswordEmail || "", otp: "" },
    mode: "onChange",
  });

  const passwordForm = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || resetPasswordEmail || "",
      reset_token: resetToken || "",
      password: "",
      password_confirmation: "",
    },
    mode: "onChange",
  });

  const passwordValue = passwordForm.watch("password");
  const pwStrength = calculateStrength(passwordValue);
  const strengthColor =
    pwStrength <= 2 ? "#ef4444" : pwStrength <= 3 ? "#f59e0b" : "#22c55e";
  const strengthLabel =
    pwStrength <= 2
      ? "Weak"
      : pwStrength <= 3
        ? "Fair"
        : pwStrength <= 4
          ? "Strong"
          : "Very strong";

  const handleOTPSubmit = otpForm.handleSubmit(async (data) => {
    const result = await performVerifyOTP(data);
    if (result.success && result.data) {
      // Move to password reset step
      passwordForm.setValue("reset_token", result.data.reset_token);
      setStep(2);
    }
  });

  const handleResendOTP = async () => {
    const emailToUse = email || resetPasswordEmail;
    if (!emailToUse) {
      toast.error("Email address not found");
      return;
    }
    const result = await performResendOTP({ email: emailToUse });
    if (result.success) {
      setResendTimer(60); // 60 second cooldown
      toast.success("OTP resent to your email");
    } else {
      toast.error("Failed to resend OTP");
    }
  };

  const handlePasswordSubmit = passwordForm.handleSubmit(async (data) => {
    await performResetPassword(data);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f8] to-[#e8ebf5] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dde0ea] px-10 py-11 shadow-lg"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src={logo1}
            alt="Femoj Logo"
            width={40}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </div>

        {/* Step Indicator */}
        {step === 2 && (
          <div className="mb-8">
            <div className="flex justify-between items-center relative mb-3">
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#e5e7eb] -translate-y-1/2 z-0" />
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-semibold z-10 transition-all ${
                    s < step
                      ? "bg-[#059669] text-white"
                      : s === step
                        ? "bg-[#1a3fd4] text-white"
                        : "bg-white text-[#9ca3af] border-[1.5px] border-[#e5e7eb]"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
              ))}
            </div>
            <div className="w-full h-[3px] bg-[#e5e7eb] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a3fd4] rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: OTP Verification */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
                  Verify OTP
                </h1>
                <p className="text-[13.5px] text-[#6b7280]">
                  Enter the code sent to your email
                </p>
              </div>

              {/* Info Card */}
              <div className="bg-[#f0f9ff] border border-[#bfdbfe] rounded-lg p-3.5 mb-6">
                <p className="text-[13px] text-[#0c4a6e]">
                  Email: <strong>{email || resetPasswordEmail}</strong>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleOTPSubmit} className="space-y-5">
                <div>
                  <label htmlFor="otp" className={labelClass}>
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    className={
                      inputClass + " text-center tracking-widest font-mono text-lg pl-4"
                    }
                    {...otpForm.register("otp")}
                  />
                  {otpForm.formState.errors.otp && (
                    <div className={errorClass}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {otpForm.formState.errors.otp.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    otpForm.watch("otp").length !== 6 || isLoading
                  }
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full h-11 mt-8 bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </motion.button>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                  <p className="text-[13px] text-[#6b7280]">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || isLoading}
                      className="text-[#1a3fd4] hover:text-[#1631b6] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: New Password */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-[#059669]" />
                </div>
                <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
                  Create New Password
                </h1>
                <p className="text-[13.5px] text-[#6b7280]">
                  Enter your new password below
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className={labelClass}>
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={inputClass}
                      {...passwordForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {passwordValue && (
                    <div className="mt-2.5">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-[3px] rounded-full transition-all"
                            style={{
                              background:
                                i < pwStrength ? strengthColor : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="text-[12px] mt-1.5 font-medium"
                        style={{ color: strengthColor }}
                      >
                        {strengthLabel}
                      </p>
                    </div>
                  )}

                  {passwordForm.formState.errors.password && (
                    <div className={errorClass}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordForm.formState.errors.password.message}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="password_confirmation" className={labelClass}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={inputClass}
                      {...passwordForm.register("password_confirmation")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.password_confirmation && (
                    <div className={errorClass}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordForm.formState.errors.password_confirmation.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    !passwordForm.formState.isValid || isLoading
                  }
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full h-11 mt-8 bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
