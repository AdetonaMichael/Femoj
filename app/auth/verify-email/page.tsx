"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema, type VerifyEmailSchema } from "@/schemas";
import { useVerifyEmail, useResendEmailOTP } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const inputClass =
  "w-full h-[44px] pl-10 pr-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[13.5px] text-[#6b7280] placeholder:text-[#b0b8c8] outline-none transition-all hover:border-[#c5cad6] focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10 focus:text-[#374151]";
const labelClass = "block text-[12.5px] font-medium text-[#374151] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1.5 flex items-center gap-1";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const { verifyEmail: performVerifyEmail } = useVerifyEmail();
  const { resend: performResendOTP } = useResendEmailOTP();
  const { registrationEmail, user, isLoading } = useAuthStore();

  // Get email from either registration flow or logged-in user
  const emailToVerify = registrationEmail || user?.email;

  // Redirect if no email is available
  useEffect(() => {
    if (!emailToVerify) {
      router.replace("/auth/login");
    }
  }, [emailToVerify, router]);

  // Handle OTP resend timer
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  const form = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: emailToVerify || "", otp: "" },
    mode: "onChange",
  });

  const handleResendOTP = async () => {
    const result = await performResendOTP({
      email: emailToVerify || "",
    });
    if (result.success && result.data) {
      setOtpResendTimer(60);
      toast.success("OTP resent successfully!");
    }
  };

  const onSubmit = async (data: VerifyEmailSchema) => {
    const result = await performVerifyEmail(data);
    if (result.success) {
      toast.success("Email verified!");
      
      // If user came from login flow (has user but registrationEmail not set), go to dashboard
      // If user came from registration flow, go to login to login again
      setTimeout(() => {
        if (user && !registrationEmail) {
          // User was already logged in
          router.push("/dashboard");
        } else {
          // User was registering
          router.push("/auth/login");
        }
      }, 1500);
    }
  };

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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-[#059669]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
            Verify Your Email
          </h1>
          <p className="text-[13.5px] text-[#6b7280]">
            We sent a 6-digit code to your email address
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-[#f0f9ff] border border-[#bfdbfe] rounded-lg p-3.5 mb-6">
          <p className="text-[13px] text-[#0c4a6e]">
            <strong>{emailToVerify}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* OTP Field */}
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
              {...form.register("otp")}
            />
            {form.formState.errors.otp && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {form.formState.errors.otp.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={
              form.watch("otp").length !== 6 || isLoading
            }
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            className="w-full h-11 mt-8 bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>

        {/* Resend Link */}
        <div className="mt-8 text-center border-t border-[#e5e7eb] pt-6">
          <p className="text-[13.5px] text-[#6b7280] mb-3">
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={otpResendTimer > 0 || isLoading}
            className="text-[13.5px] text-[#1a3fd4] hover:text-[#1631b6] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {otpResendTimer > 0 ? `Resend in ${otpResendTimer}s` : "Resend OTP"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}