"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyPhoneSchema,
  type VerifyPhoneSchema,
  sendPhoneOTPSchema,
  type SendPhoneOTPSchema,
} from "@/schemas";
import { useSendPhoneOTP, useVerifyPhone } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import {
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageSquare,
  PhoneCall,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const inputClass =
  "w-full h-[44px] pl-10 pr-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[13.5px] text-[#6b7280] placeholder:text-[#b0b8c8] outline-none transition-all hover:border-[#c5cad6] focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10 focus:text-[#374151]";
const labelClass = "block text-[12.5px] font-medium text-[#374151] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1.5 flex items-center gap-1";

type VerifyPhonePageStep = "send-otp" | "verify-otp";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [step, setStep] = useState<VerifyPhonePageStep>("send-otp");
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otpMethod, setOtpMethod] = useState<"sms" | "call">("sms");
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  const { send: performSendPhoneOTP } = useSendPhoneOTP();
  const { verify: performVerifyPhone } = useVerifyPhone();
  const { user, isLoading } = useAuthStore();

  // Redirect if user is not authenticated or already verified phone
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    } else if (user.phone_verified_at) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Handle OTP resend timer
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  const sendOtpForm = useForm<SendPhoneOTPSchema>({
    resolver: zodResolver(sendPhoneOTPSchema),
    defaultValues: {
      phone_number: user?.phone_number || "",
      method: "sms",
    },
    mode: "onChange",
  });

  const verifyOtpForm = useForm<VerifyPhoneSchema>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: { verification_id: 0, otp: "" },
    mode: "onChange",
  });

  const handleSendOTP = async (data: SendPhoneOTPSchema) => {
    const result = await performSendPhoneOTP({
      phone_number: data.phone_number || user?.phone_number,
      method: data.method,
    });

    if (result.success && result.data) {
      setVerificationId(result.data.verification_id);
      setPhoneNumber(result.data.phone_number);
      setOtpMethod(result.data.method);
      verifyOtpForm.setValue("verification_id", result.data.verification_id);
      setStep("verify-otp");
      setOtpResendTimer(60);
      toast.success(`OTP sent via ${result.data.method.toUpperCase()}!`);
    }
  };

  const handleResendOTP = async () => {
    const result = await performSendPhoneOTP({
      phone_number: phoneNumber || user?.phone_number,
      method: otpMethod,
    });
    if (result.success && result.data) {
      setVerificationId(result.data.verification_id);
      verifyOtpForm.setValue("verification_id", result.data.verification_id);
      setOtpResendTimer(60);
      toast.success(`OTP resent via ${result.data.method.toUpperCase()}!`);
    }
  };

  const handleVerifyOTP = async (data: VerifyPhoneSchema) => {
    const result = await performVerifyPhone(data);
    if (result.success) {
      toast.success("Phone verified successfully!");
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

        {/* Step 1: Send OTP */}
        {step === "send-otp" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Phone className="w-12 h-12 text-[#1a3fd4]" />
              </div>
              <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
                Verify Your Phone
              </h1>
              <p className="text-[13.5px] text-[#6b7280]">
                We&apos;ll send a verification code to your phone
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={sendOtpForm.handleSubmit(handleSendOTP)}
              className="space-y-5"
            >
              {/* Phone Number Display */}
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+234..."
                    className={inputClass}
                    {...sendOtpForm.register("phone_number")}
                    disabled={isLoading}
                    defaultValue={user?.phone_number || ""}
                  />
                </div>
                {sendOtpForm.formState.errors.phone_number && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {sendOtpForm.formState.errors.phone_number.message}
                  </div>
                )}
              </div>

              {/* OTP Method Selection */}
              <div>
                <label className={labelClass}>Receive code via</label>
                <div className="space-y-2.5">
                  {/* SMS Option */}
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border-[1.5px] border-[#e5e7eb] cursor-pointer hover:border-[#1a3fd4] hover:bg-[#f4f6fd] transition-all">
                    <input
                      type="radio"
                      value="sms"
                      {...sendOtpForm.register("method")}
                      className="w-4 h-4 cursor-pointer"
                      disabled={isLoading}
                    />
                    <MessageSquare className="w-4 h-4 text-[#6b7280]" />
                    <span className="text-[13px] text-[#374151] font-medium">
                      SMS
                    </span>
                    <span className="text-[12px] text-[#9ca3af] ml-auto">
                      Fastest
                    </span>
                  </label>

                  {/* Call Option */}
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border-[1.5px] border-[#e5e7eb] cursor-pointer hover:border-[#1a3fd4] hover:bg-[#f4f6fd] transition-all">
                    <input
                      type="radio"
                      value="call"
                      {...sendOtpForm.register("method")}
                      className="w-4 h-4 cursor-pointer"
                      disabled={isLoading}
                    />
                    <PhoneCall className="w-4 h-4 text-[#6b7280]" />
                    <span className="text-[13px] text-[#374151] font-medium">
                      Voice Call
                    </span>
                    <span className="text-[12px] text-[#9ca3af] ml-auto">
                      Alternative
                    </span>
                  </label>
                </div>
                {sendOtpForm.formState.errors.method && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {sendOtpForm.formState.errors.method.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !sendOtpForm.formState.isValid}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                className="w-full h-11 mt-8 bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </motion.button>
            </form>
          </>
        )}

        {/* Step 2: Verify OTP */}
        {step === "verify-otp" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-[#059669]" />
              </div>
              <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
                Verify Your Phone
              </h1>
              <p className="text-[13.5px] text-[#6b7280]">
                Enter the {otpMethod === "sms" ? "6-digit" : "5-digit"} code we sent to your{" "}
                {otpMethod === "sms" ? "phone via SMS" : "phone via voice call"}
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-[#f0f9ff] border border-[#bfdbfe] rounded-lg p-3.5 mb-6">
              <p className="text-[13px] text-[#0c4a6e]">
                <strong>{phoneNumber}</strong>
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={verifyOtpForm.handleSubmit(handleVerifyOTP)}
              className="space-y-5"
            >
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
                  {...verifyOtpForm.register("otp")}
                />
                {verifyOtpForm.formState.errors.otp && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {verifyOtpForm.formState.errors.otp.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={
                  verifyOtpForm.watch("otp").length < 5 || isLoading
                }
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                className="w-full h-11 mt-8 bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200"
              >
                {isLoading ? "Verifying..." : "Verify Phone"}
              </motion.button>
            </form>

            {/* Resend and Change Options */}
            <div className="mt-8 space-y-4 border-t border-[#e5e7eb] pt-6">
              {/* Resend Link */}
              <div className="text-center">
                <p className="text-[13.5px] text-[#6b7280] mb-3">
                  Didn&apos;t receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpResendTimer > 0 || isLoading}
                  className="text-[13.5px] text-[#1a3fd4] hover:text-[#1631b6] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {otpResendTimer > 0
                    ? `Resend in ${otpResendTimer}s`
                    : `Resend via ${otpMethod.toUpperCase()}`}
                </button>
              </div>

              {/* Change Method */}
              <div className="text-center">
                <p className="text-[13.5px] text-[#6b7280] mb-3">
                  Try a different method?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep("send-otp");
                    sendOtpForm.reset();
                    verifyOtpForm.reset();
                  }}
                  disabled={isLoading}
                  className="text-[13.5px] text-[#1a3fd4] hover:text-[#1631b6] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Change Method
                </button>
              </div>

              {/* Skip for now - optional phone verification */}
              <div className="pt-4 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  disabled={isLoading}
                  className="w-full text-[13.5px] text-[#6b7280] hover:text-[#374151] font-medium py-2.5 rounded-lg hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
