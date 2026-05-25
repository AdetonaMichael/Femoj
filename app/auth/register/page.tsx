"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupStep1Schema, signupStep2Schema, signupStep3Schema, signupStep4Schema,
  type SignupStep1Schema, type SignupStep2Schema, type SignupStep3Schema, type SignupStep4Schema,
} from "@/schemas";
import { COUNTRIES } from "@/constants";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, Tag } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

const inputClass = "w-full h-[44px] pl-10 pr-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[13.5px] text-[#6b7280] placeholder:text-[#b0b8c8] outline-none transition-all hover:border-[#c5cad6] focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10 focus:text-[#374151]";
const labelClass = "block text-[12.5px] font-medium text-[#374151] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1.5";

function FieldWrap({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
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

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const step1 = useForm<SignupStep1Schema>({ resolver: zodResolver(signupStep1Schema) });
  const step2 = useForm<SignupStep2Schema>({ resolver: zodResolver(signupStep2Schema) });
  const step3 = useForm<SignupStep3Schema>({ resolver: zodResolver(signupStep3Schema) });
  const step4 = useForm<SignupStep4Schema>({ resolver: zodResolver(signupStep4Schema) });

  const s1 = step1.watch();
  const s2 = step2.watch();
  const s3 = step3.watch();
  const pwStrength = calculateStrength(s3.password || "");

  const strengthColor = pwStrength <= 2 ? "#ef4444" : pwStrength <= 3 ? "#f59e0b" : "#22c55e";
  const strengthLabel = pwStrength <= 2 ? "Weak" : pwStrength <= 3 ? "Fair" : pwStrength <= 4 ? "Strong" : "Very strong";

  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dde0ea] px-9 py-10"
      >
         <div className="flex flex-col items-center mb-9">
                  {/* <div className="w-[54px] h-[54px] rounded-full bg-[#1a3fd4] flex items-center justify-center mb-4"> */}
                    <Image src={logo1} alt="Femoj Logo" width={80} height={80} />
                  {/* </div> */}
                  <h1 className="text-xl font-medium text-[#111827] mb-1.5">Sign in to Femoj</h1>
                  <p className="text-sm text-[#6b7280] text-center leading-relaxed">
                    Enter your credentials to access your account
                  </p>
                  <div className="w-7 h-[2.5px] bg-[#1a3fd4] rounded-full mt-4" />
                </div>
        {/* Step indicator */}
        <div className="mb-7">
          <div className="flex justify-between items-center relative mb-2.5">
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#e5e7eb] -translate-y-1/2 z-0" />
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-medium z-10 transition-all ${
                  s < step ? "bg-[#059669] text-white" :
                  s === step ? "bg-[#1a3fd4] text-white" :
                  "bg-white text-[#9ca3af] border-[1.5px] border-[#e5e7eb]"
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
          {/* Step 1 */}
          {step === 1 && (
            <motion.form
              key="s1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={step1.handleSubmit(() => setStep(2))}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-[19px] font-medium text-[#111827] mb-1">Create your account</h2>
                <p className="text-[13px] text-[#6b7280]">Step 1 of 4 — Enter your name</p>
              </div>
              <div>
                <label className={labelClass}>First name</label>
                <FieldWrap icon={User}>
                  <input {...step1.register("firstName")} placeholder="John" className={inputClass} />
                </FieldWrap>
                {step1.formState.errors.firstName && <p className={errorClass}>{step1.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <FieldWrap icon={User}>
                  <input {...step1.register("lastName")} placeholder="Doe" className={inputClass} />
                </FieldWrap>
                {step1.formState.errors.lastName && <p className={errorClass}>{step1.formState.errors.lastName.message}</p>}
              </div>
              <button
                type="submit"
                disabled={!s1.firstName || !s1.lastName}
                className="w-full h-[44px] mt-1 rounded-[10px] bg-[#1a3fd4] hover:bg-[#1533b5] text-white text-[14px] font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </motion.form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.form
              key="s2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={step2.handleSubmit(() => setStep(3))}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-[19px] font-medium text-[#111827] mb-1">Contact information</h2>
                <p className="text-[13px] text-[#6b7280]">Step 2 of 4 — Provide your contact details</p>
              </div>
              <div>
                <label className={labelClass}>Email address</label>
                <FieldWrap icon={Mail}>
                  <input type="email" {...step2.register("email")} placeholder="you@example.com" className={inputClass} />
                </FieldWrap>
                {step2.formState.errors.email && <p className={errorClass}>{step2.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Phone number</label>
                <FieldWrap icon={Phone}>
                  <input {...step2.register("phone")} placeholder="+1 (555) 123-4567" className={inputClass} />
                </FieldWrap>
                {step2.formState.errors.phone && <p className={errorClass}>{step2.formState.errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <FieldWrap icon={MapPin}>
                  <select
                    {...step2.register("country")}
                    className={inputClass + " appearance-none cursor-pointer"}
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </FieldWrap>
                {step2.formState.errors.country && <p className={errorClass}>{step2.formState.errors.country.message}</p>}
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setStep(1)} className="flex-1 h-[44px] rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[14px] text-[#374151] font-medium transition-all">Back</button>
                <button type="submit" disabled={!s2.email || !s2.phone || !s2.country} className="flex-1 h-[44px] rounded-[10px] bg-[#1a3fd4] hover:bg-[#1533b5] text-white text-[14px] font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed">Continue</button>
              </div>
            </motion.form>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.form
              key="s3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={step3.handleSubmit(() => setStep(4))}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-[19px] font-medium text-[#111827] mb-1">Set your password</h2>
                <p className="text-[13px] text-[#6b7280]">Step 3 of 4 — Create a secure password</p>
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    {...step3.register("password")}
                    placeholder="••••••••"
                    className={inputClass + " pr-10"}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors bg-transparent border-none outline-none p-1" aria-label="Toggle">
                    {showPw ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                  </button>
                </div>
                {s3.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex-1 h-[3px] rounded-full transition-all" style={{ background: i < pwStrength ? strengthColor : "#e5e7eb" }} />
                      ))}
                    </div>
                    <p className="text-[12px] mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
                  </div>
                )}
                {step3.formState.errors.password && <p className={errorClass}>{step3.formState.errors.password.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
                  <input
                    type={showCpw ? "text" : "password"}
                    {...step3.register("confirmPassword")}
                    placeholder="••••••••"
                    className={inputClass + " pr-10"}
                  />
                  <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors bg-transparent border-none outline-none p-1" aria-label="Toggle">
                    {showCpw ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                  </button>
                </div>
                {step3.formState.errors.confirmPassword && <p className={errorClass}>{step3.formState.errors.confirmPassword.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Referral code <span className="text-[#9ca3af] font-normal">(optional)</span></label>
                <FieldWrap icon={Tag}>
                  <input {...step3.register("referralCode")} placeholder="If you have one" className={inputClass} />
                </FieldWrap>
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setStep(2)} className="flex-1 h-[44px] rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[14px] text-[#374151] font-medium transition-all">Back</button>
                <button type="submit" disabled={!s3.password || !s3.confirmPassword} className="flex-1 h-[44px] rounded-[10px] bg-[#1a3fd4] hover:bg-[#1533b5] text-white text-[14px] font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed">Continue</button>
              </div>
            </motion.form>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <motion.form
              key="s4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={step4.handleSubmit(() => {
                toast.success("Account created successfully!");
                window.location.href = "/auth/login";
              })}
              className="space-y-5"
            >
              <div className="mb-5">
                <h2 className="text-[19px] font-medium text-[#111827] mb-1">Verify your email</h2>
                <p className="text-[13px] text-[#6b7280]">Step 4 of 4 — Enter the 6-digit code we sent you</p>
              </div>
              <div className="flex gap-2 justify-center">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="text"
                    maxLength={1}
                    className="w-11 h-12 text-center rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#f8f9fb] text-[18px] font-medium text-[#111827] outline-none transition-all focus:border-[#1a3fd4] focus:bg-[#f4f6fd] focus:ring-[3px] focus:ring-[#1a3fd4]/10"
                    onChange={(e) => {
                      if (e.target.value && i < 5) otpRefs[i + 1].current?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !e.currentTarget.value && i > 0) otpRefs[i - 1].current?.focus();
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={step4.formState.isSubmitting}
                className="w-full h-[44px] rounded-[10px] bg-[#1a3fd4] hover:bg-[#1533b5] text-white text-[14px] font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Complete registration
              </button>
              <p className="text-center text-[13px] text-[#6b7280]">
                Didn't receive a code?{" "}
                <button type="button" className="text-[#1a3fd4] font-medium hover:underline bg-transparent border-none cursor-pointer">
                  Resend
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-[13px] text-[#6b7280] mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#1a3fd4] font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}