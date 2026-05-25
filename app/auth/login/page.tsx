"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { authService } from "@/services/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { logo1 } from "../../../public";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        login(response.data);
        toast.success("Welcome back!");
        window.location.href = "/dashboard";
      } else {
        toast.error(response.error?.message || "Login failed");
      }
    } catch {
      toast.error("An error occurred during login");
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
        {/* Logo & heading */}
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[12.5px] font-medium text-[#374151] mb-1.5 tracking-[0.15px]"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9ca3af] pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="
                  w-full h-[46px]
                  pl-10 pr-10
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a3fd4] transition-colors bg-transparent border-none outline-none p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-[15px] h-[15px]" />
                ) : (
                  <Eye className="w-[15px] h-[15px]" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1.5">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-sm text-[#6b7280] cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 accent-[#1a3fd4] cursor-pointer"
              />
              Remember me
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-[#1a3fd4] hover:underline"
            >
              Forgot password?
            </Link>
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
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-[#f3f4f6]" />
          <span className="text-xs text-[#9ca3af] whitespace-nowrap">or continue with</span>
          <hr className="flex-1 border-[#f3f4f6]" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="
            w-full h-[46px]
            rounded-[10px] border-[1.5px] border-[#e5e7eb]
            bg-white hover:bg-[#f9fafb] hover:border-[#c5cad6]
            text-sm text-[#374151]
            flex items-center justify-center gap-2.5 transition-all
          "
        >
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.233 17.64 11.925 17.64 9.2z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Sign up */}
        <p className="text-center text-sm text-[#6b7280] mt-6">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-[#1a3fd4] font-medium hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}