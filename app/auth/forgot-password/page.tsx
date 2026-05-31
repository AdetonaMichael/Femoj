"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/schemas";
import { useForgotPassword } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const inputClass =
  "w-full h-[44px] pl-10 pr-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[13.5px] text-[#6b7280] placeholder:text-[#b0b8c8] outline-none transition-all hover:border-[#c5cad6] focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10 focus:text-[#374151]";
const labelClass = "block text-[12.5px] font-medium text-[#374151] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1.5 flex items-center gap-1";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword: performForgotPassword } = useForgotPassword();
  const { isLoading, resetPasswordEmail } = useAuthStore();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    const result = await performForgotPassword(data);
    if (result.success) {
      setIsSubmitted(true);
    } else if (result.errors) {
      const firstError = Object.values(result.errors)[0]?.[0];
      toast.error(firstError || "Failed to send reset link");
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

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
                  Forgot Password
                </h1>
                <p className="text-[13.5px] text-[#6b7280]">
                  Enter your email to reset your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputClass}
                      {...form.register("email")}
                      disabled={isLoading}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <div className={errorClass}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {form.formState.errors.email.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full h-11 mt-8 bg-[#1a3fd4] hover:bg-[#1631b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1 text-[13px] text-[#1a3fd4] hover:text-[#1631b6] font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-[#059669]" />
              </div>

              {/* Success Message */}
              <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
                Check Your Email
              </h1>
              <p className="text-[13.5px] text-[#6b7280] mb-6">
                We sent a password reset link to{" "}
                <strong>{resetPasswordEmail || form.getValues("email")}</strong>
              </p>

              {/* Instructions */}
              <div className="bg-[#f0f9ff] border border-[#bfdbfe] rounded-lg p-4 mb-6 text-left">
                <h3 className="text-[13px] font-semibold text-[#0c4a6e] mb-2">
                  Next steps:
                </h3>
                <ol className="text-[12px] text-[#0c4a6e] space-y-1 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the reset link</li>
                  <li>Enter the OTP code</li>
                  <li>Create a new password</li>
                </ol>
              </div>

              {/* Button */}
              <Link
                href="/auth/login"
                className="inline-block w-full h-11 bg-[#1a3fd4] hover:bg-[#1631b6] text-white font-semibold text-[13.5px] rounded-[10px] transition-all duration-200 flex items-center justify-center"
              >
                Return to Login
              </Link>

              {/* Resend Option */}
              <p className="text-[13px] text-[#6b7280] mt-6">
                Didn&apos;t receive the email?{" "}
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-[#1a3fd4] hover:text-[#1631b6] font-semibold"
                >
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}