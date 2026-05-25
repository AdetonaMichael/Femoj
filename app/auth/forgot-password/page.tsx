"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dde0ea] px-10 py-11"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* ── Request form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Logo & heading */}
              <div className="flex flex-col items-center mb-9">
                <Image src={logo1} alt="Femoj Logo" width={80} height={80} />
                <h1 className="text-xl font-medium text-[#111827] mb-1.5">
                  Reset your password
                </h1>
                <p className="text-sm text-[#6b7280] text-center leading-relaxed">
                  Enter your email and we'll send you a reset link
                </p>
                <div className="w-7 h-[2.5px] bg-[#1a3fd4] rounded-full mt-4" />
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[12.5px] font-medium text-[#374151] mb-1.5 tracking-[0.15px]"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="
                        w-full h-[46px]
                        pl-10 pr-4
                        rounded-[10px] border-[1.5px] border-[#e5e7eb]
                        bg-[#f8f9fb] text-sm text-[#6b7280]
                        placeholder:text-[#b0b8c8] placeholder:text-[13.5px]
                        outline-none transition-all
                        hover:border-[#c5cad6]
                        focus:border-[#1a3fd4] focus:bg-[#f4f6fd]
                        focus:ring-[3px] focus:ring-[#1a3fd4]/10
                        focus:text-[#374151]
                      "
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1.5">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full h-[46px] mt-1
                    rounded-[10px] bg-[#1a3fd4] hover:bg-[#1533b5]
                    active:scale-[0.99] text-white text-[14.5px] font-medium
                    tracking-[0.15px] transition-all
                    flex items-center justify-center gap-2
                    disabled:opacity-70 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="flex justify-center mt-6">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#1a3fd4] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                className="w-[72px] h-[72px] rounded-full bg-[#eef2ff] flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-8 h-8 text-[#1a3fd4]" />
              </motion.div>

              <h1 className="text-xl font-medium text-[#111827] mb-2">
                Check your inbox
              </h1>
              <p className="text-sm text-[#6b7280] leading-relaxed mb-1">
                We sent a password reset link to
              </p>
              <p className="text-sm font-medium text-[#374151] mb-7">
                {submittedEmail}
              </p>

              <div className="w-full rounded-[10px] bg-[#f4f6fd] border border-[#dde0ea] px-4 py-3 mb-7">
                <p className="text-[12.5px] text-[#6b7280] leading-relaxed">
                  Didn't receive the email? Check your spam folder or try with a different address.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                }}
                className="
                  w-full h-[46px]
                  rounded-[10px] border-[1.5px] border-[#e5e7eb]
                  bg-white hover:bg-[#f9fafb] hover:border-[#c5cad6]
                  text-sm text-[#374151] font-medium
                  transition-all mb-4
                "
              >
                Try another email
              </button>

              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#1a3fd4] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}