"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { login: performLogin } = useLogin();
  const { isLoading, isAuthenticated, error: storeError, user } = useAuthStore();
  
  // Track if component mounted - only redirect if already authenticated on mount
  const isInitialMount = useRef(true);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  // Redirect if already authenticated on initial mount (user was already logged in)
  useEffect(() => {
    if (isAuthenticated && isInitialMount.current) {
      console.log("[LoginPage] Already authenticated on mount, redirecting to dashboard");
      router.replace("/dashboard");
    }
    isInitialMount.current = false;
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginSchema) => {
    console.log("[LoginPage] Form submitted, calling performLogin");
    const result = await performLogin(data);
    
    if (result.success) {
      console.log("[LoginPage] Login successful, determining redirect");
      toast.success("Welcome back!");
      
      // Get redirect parameter from URL (set by middleware)
      const redirectParam = searchParams?.get("redirect");
      console.log("[LoginPage] Redirect param from URL:", redirectParam);
      
      // Determine redirect destination
      let redirectTo = "/dashboard";
      
      if (redirectParam) {
        // Use the redirect parameter from middleware
        redirectTo = decodeURIComponent(redirectParam);
        console.log("[LoginPage] Using redirect param:", redirectTo);
      } else if (result.data?.user?.email_verified_at) {
        // User has verified email
        redirectTo = "/dashboard";
        console.log("[LoginPage] Email verified, redirecting to dashboard");
      } else {
        // User needs to verify email
        redirectTo = "/auth/verify-email";
        console.log("[LoginPage] Email not verified, redirecting to verify-email");
      }
      
      console.log("[LoginPage] Final redirect target:", redirectTo);
      console.log("[LoginPage] Calling router.push");
      router.push(redirectTo);
    } else if (result.errors) {
      const firstError = Object.values(result.errors)[0]?.[0];
      toast.error(firstError || "Login failed. Please try again.");
    }
  };

  const displayError = storeError || form.formState.errors.email?.message;

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
          <h1 className="text-[24px] font-bold text-[#1f2937] mb-2">
            Welcome Back
          </h1>
          <p className="text-[13.5px] text-[#6b7280]">
            Sign in to your Femoj account
          </p>
        </div>

        {/* Global Error Alert */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-red-700">{displayError}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
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
                {...form.register("email")}
                disabled={isLoading}
                autoComplete="email"
              />
            </FieldWrap>
            {form.formState.errors.email && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {form.formState.errors.email.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[12px] text-[#1a3fd4] hover:text-[#1631b6] transition-colors font-medium"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputClass}
                {...form.register("password")}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {form.formState.errors.password.message}
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="text-xs text-[#9ca3af]">or</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>

        {/* Footer */}
        <p className="text-center text-[13.5px] text-[#6b7280]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#1a3fd4] hover:text-[#1631b6] font-semibold transition-colors"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}