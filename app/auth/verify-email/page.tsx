"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const CODE_LENGTH = 6;

export default function VerifyEmailPage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* countdown timer for resend */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    /* allow only single digit */
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const next = [...code];
        next[index] = "";
        setCode(next);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setCode(next);
    /* focus last filled or next empty */
    const lastIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    focusInput(lastIdx);
  };

  const handleVerify = async () => {
    const entered = code.join("");
    if (entered.length < CODE_LENGTH) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("Email verified successfully!");
      window.location.href = "/dashboard";
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("A new code has been sent to your email.");
      setCode(Array(CODE_LENGTH).fill(""));
      focusInput(0);
      setResendCooldown(60);
    } catch {
      toast.error("Failed to resend code. Please try again.");
    }
  };

  const isFilled = code.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dde0ea] px-10 py-11"
      >
        {/* Logo & heading */}
        <div className="flex flex-col items-center mb-9">
          <Image src={logo1} alt="Femoj Logo" width={80} height={80} />
          <h1 className="text-xl font-medium text-[#111827] mb-1.5">Verify your email</h1>
          <p className="text-sm text-[#6b7280] text-center leading-relaxed">
            We sent a 6-digit code to your email address.
            <br />Enter it below to continue.
          </p>
          <div className="w-7 h-[2.5px] bg-[#1a3fd4] rounded-full mt-4" />
        </div>

        {/* OTP inputs */}
        <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="
                w-[46px] h-[52px]
                rounded-[10px] border-[1.5px] border-[#e5e7eb]
                bg-[#f8f9fb]
                text-center text-[20px] font-semibold text-[#111827]
                outline-none transition-all
                hover:border-[#c5cad6]
                focus:border-[#1a3fd4] focus:bg-[#f4f6fd]
                focus:ring-[3px] focus:ring-[#1a3fd4]/10
                caret-transparent
                select-none
              "
              style={{
                /* highlight filled digits */
                borderColor: digit ? "#1a3fd4" : undefined,
                background: digit ? "#f4f6fd" : undefined,
              }}
            />
          ))}
        </div>

        {/* Info hint */}
        <div className="rounded-[10px] bg-[#f4f6fd] border border-[#dde0ea] px-4 py-3 mb-6 flex items-start gap-2.5">
          <MailCheck className="w-4 h-4 text-[#1a3fd4] mt-0.5 shrink-0" />
          <p className="text-[12.5px] text-[#6b7280] leading-relaxed">
            The code expires in <span className="font-medium text-[#374151]">10 minutes</span>. Check your spam folder if you don't see it.
          </p>
        </div>

        {/* Verify button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || !isFilled}
          className="
            w-full h-[46px]
            rounded-[10px] bg-[#1a3fd4] hover:bg-[#1533b5]
            active:scale-[0.99] text-white text-[14.5px] font-medium
            tracking-[0.15px] transition-all
            flex items-center justify-center gap-2
            disabled:opacity-60 disabled:cursor-not-allowed
            mb-5
          "
        >
          {isVerifying ? (
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
              Verifying…
            </>
          ) : (
            "Verify email"
          )}
        </button>

        {/* Resend */}
        <p className="text-center text-sm text-[#6b7280]">
          Didn't receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="
              font-medium transition-colors
              disabled:text-[#9ca3af] disabled:cursor-not-allowed
              text-[#1a3fd4] hover:underline
            "
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-[#f3f4f6]" />
        </div>

        {/* Back to login */}
        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#1a3fd4] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}