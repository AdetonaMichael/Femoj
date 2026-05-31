"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  registerStep4Schema,
  type RegisterStep1Schema,
  type RegisterStep2Schema,
  type RegisterStep3Schema,
  type RegisterStep4Schema,
} from "@/schemas";
import { useRegister, useVerifyEmail, useResendEmailOTP } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Tag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const inputClass =
  "w-full h-[44px] pl-10 pr-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[13.5px] text-[#6b7280] placeholder:text-[#b0b8c8] outline-none transition-all hover:border-[#c5cad6] focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10 focus:text-[#374151]";
const labelClass = "block text-[12.5px] font-medium text-[#374151] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1.5 flex items-center gap-1";

function FieldWrap({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
      {children}
    </div>
  );
}

function calculateStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [formData, setFormData] = useState<RegisterStep1Schema & RegisterStep2Schema & Partial<RegisterStep3Schema>>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const { register: performRegister } = useRegister();
  const { verifyEmail: performVerifyEmail } = useVerifyEmail();
  const { resend: performResendOTP } = useResendEmailOTP();
  const { isLoading, isAuthenticated, registrationEmail } = useAuthStore();
  
  // Track if component mounted - only redirect if already authenticated on mount
  const isInitialMount = useRef(true);

  // Redirect if already authenticated (only on initial mount, not after registration)
  useEffect(() => {
    if (isAuthenticated && isInitialMount.current) {
      console.log("[RegisterPage] Already authenticated, redirecting to dashboard");
      router.replace("/dashboard");
    }
    isInitialMount.current = false;
  }, [isAuthenticated, router]);

  // Handle OTP resend timer
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  const step1Form = useForm<RegisterStep1Schema>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: { first_name: formData.first_name, last_name: formData.last_name },
    mode: "onChange",
  });

  const step2Form = useForm<RegisterStep2Schema>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { email: formData.email, phone_number: formData.phone_number },
    mode: "onChange",
  });

  const step3Form = useForm<RegisterStep3Schema>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: { password: "", password_confirmation: "", ref: "" },
    mode: "onChange",
  });

  const step4Form = useForm<RegisterStep4Schema>({
    resolver: zodResolver(registerStep4Schema),
    defaultValues: { otp: "" },
    mode: "onChange",
  });

  const s1 = step1Form.watch();
  const s2 = step2Form.watch();
  const s3 = step3Form.watch();
  const s4 = step4Form.watch();
  const pwStrength = calculateStrength(s3.password || "");

  const strengthColor =
    pwStrength <= 2
      ? "#ef4444"
      : pwStrength <= 3
        ? "#f59e0b"
        : "#22c55e";
  const strengthLabel =
    pwStrength <= 2
      ? "Weak"
      : pwStrength <= 3
        ? "Fair"
        : pwStrength <= 4
          ? "Strong"
          : "Very strong";

  // Step 1 handler
  const handleStep1Submit = step1Form.handleSubmit(async (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  });

  // Step 2 handler
  const handleStep2Submit = step2Form.handleSubmit(async (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  });

  // Step 3 handler (actually submit registration)
  const handleStep3Submit = step3Form.handleSubmit(async (data) => {
    setIsSubmittingForm(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: data.password,
        password_confirmation: data.password_confirmation,
        ...(data.ref && { ref: data.ref }),
      };
      const result = await performRegister(payload);

      if (result.success) {
        toast.success("Account created! Check your email for verification code.");
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(4);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmittingForm(false);
    }
  });

  // Step 4 handler (email verification)
  const handleStep4Submit = step4Form.handleSubmit(async (data) => {
    setIsSubmittingForm(true);
    try {
      const result = await performVerifyEmail({
        email: registrationEmail || formData.email,
        otp: data.otp,
      });

      if (result.success) {
        toast.success("Email verified! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } finally {
      setIsSubmittingForm(false);
    }
  });

  const handleResendOTP = async () => {
    const result = await performResendOTP({
      email: registrationEmail || formData.email,
    });
    if (result.success && result.data) {
      setOtpResendTimer(60);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f8] to-[#e8ebf5] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dde0ea] px-9 py-10 shadow-lg"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <Image src={logo1} alt="Femoj Logo" width={40} height={40} priority className="h-10 w-auto mb-4" />
          <h1 className="text-[22px] font-bold text-[#111827] mb-1">Create Account</h1>
          <p className="text-[13px] text-[#6b7280] text-center">
            Join Femoj and manage virtual numbers
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative mb-3">
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#e5e7eb] -translate-y-1/2 z-0" />
            {[1, 2, 3, 4].map((s) => (
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
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleStep1Submit}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Personal Information
                </h2>
                <p className="text-[13px] text-[#6b7280] mt-1">
                  Step 1 of 4 — Tell us your name
                </p>
              </div>

              <div>
                <label htmlFor="first_name" className={labelClass}>
                  First Name
                </label>
                <FieldWrap icon={User}>
                  <input
                    id="first_name"
                    placeholder="John"
                    className={inputClass}
                    {...step1Form.register("first_name")}
                  />
                </FieldWrap>
                {step1Form.formState.errors.first_name && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step1Form.formState.errors.first_name.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className={labelClass}>
                  Last Name
                </label>
                <FieldWrap icon={User}>
                  <input
                    id="last_name"
                    placeholder="Doe"
                    className={inputClass}
                    {...step1Form.register("last_name")}
                  />
                </FieldWrap>
                {step1Form.formState.errors.last_name && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step1Form.formState.errors.last_name.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!s1.first_name || !s1.last_name || isLoading}
                className="w-full h-[44px] mt-6 rounded-[10px] bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-all"
              >
                Continue
              </button>
            </motion.form>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleStep2Submit}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Contact Details
                </h2>
                <p className="text-[13px] text-[#6b7280] mt-1">
                  Step 2 of 4 — Email and phone number
                </p>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <FieldWrap icon={Mail}>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    {...step2Form.register("email")}
                  />
                </FieldWrap>
                {step2Form.formState.errors.email && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step2Form.formState.errors.email.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className={labelClass}>
                  Phone Number (Nigeria)
                </label>
                <FieldWrap icon={Phone}>
                  <input
                    id="phone_number"
                    placeholder="+234 801 234 5678"
                    className={inputClass}
                    {...step2Form.register("phone_number")}
                  />
                </FieldWrap>
                {step2Form.formState.errors.phone_number && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step2Form.formState.errors.phone_number.message}
                  </div>
                )}
                <p className="text-[11px] text-[#6b7280] mt-1.5">
                  Format: +234801234567 or 08012345678
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-[44px] rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[14px] text-[#374151] font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!s2.email || !s2.phone_number || isLoading}
                  className="flex-1 h-[44px] rounded-[10px] bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-all"
                >
                  Continue
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleStep3Submit}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Create Password
                </h2>
                <p className="text-[13px] text-[#6b7280] mt-1">
                  Step 3 of 4 — Secure your account
                </p>
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputClass}
                    {...step3Form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {s3.password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-[3px] rounded-full transition-all"
                          style={{
                            background: i < pwStrength ? strengthColor : "#e5e7eb",
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

                {step3Form.formState.errors.password && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step3Form.formState.errors.password.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className={labelClass}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                  <input
                    id="password_confirmation"
                    type={showCpw ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputClass}
                    {...step3Form.register("password_confirmation")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCpw(!showCpw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors"
                  >
                    {showCpw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {step3Form.formState.errors.password_confirmation && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step3Form.formState.errors.password_confirmation.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="ref" className={labelClass}>
                  Referral Code <span className="text-[#9ca3af] font-normal">(optional)</span>
                </label>
                <FieldWrap icon={Tag}>
                  <input
                    id="ref"
                    placeholder="If you have one"
                    className={inputClass}
                    {...step3Form.register("ref")}
                  />
                </FieldWrap>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 h-[44px] rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[14px] text-[#374151] font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    !s3.password ||
                    !s3.password_confirmation ||
                    isLoading ||
                    isSubmittingForm
                  }
                  className="flex-1 h-[44px] rounded-[10px] bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-all"
                >
                  {isSubmittingForm ? "Creating..." : "Create Account"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 4: Email Verification */}
          {step === 4 && (
            <motion.form
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleStep4Submit}
              className="space-y-4"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    Verify Email
                  </h2>
                </div>
                <p className="text-[13px] text-[#6b7280]">
                  Step 4 of 4 — Enter the OTP sent to your email
                </p>
              </div>

              <div className="bg-[#f0f9ff] border border-[#bfdbfe] rounded-lg p-3.5 mb-4">
                <p className="text-[13px] text-[#0c4a6e]">
                  We sent a 6-digit code to <strong>{registrationEmail || formData.email}</strong>
                </p>
              </div>

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
                  className={inputClass + " text-center tracking-widest font-mono text-lg"}
                  {...step4Form.register("otp")}
                />
                {step4Form.formState.errors.otp && (
                  <div className={errorClass}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {step4Form.formState.errors.otp.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={s4.otp.length !== 6 || isLoading || isSubmittingForm}
                className="w-full h-[44px] mt-6 rounded-[10px] bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-all"
              >
                {isSubmittingForm ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center">
                <p className="text-[13px] text-[#6b7280]">
                  Didn&apos;t receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpResendTimer > 0 || isLoading}
                  className="text-[13px] text-[#1a3fd4] hover:text-[#1631b6] font-semibold mt-1 disabled:opacity-50"
                >
                  {otpResendTimer > 0
                    ? `Resend in ${otpResendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-[13px] text-[#6b7280] mt-8">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#1a3fd4] font-semibold hover:text-[#1631b6] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}