import { z } from "zod";

/**
 * Password validation helper
 * Backend requirements: min 8 chars with uppercase, lowercase, numbers, symbols
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$%^&*)");

/**
 * Nigerian phone number validation
 * Format: +234XXXXXXXXXX or 0XXXXXXXXXX
 */
const nigerianPhoneSchema = z
  .string()
  .refine(
    (phone) => {
      const pattern = /^(\+234|0)[789]\d{9}$/;
      return pattern.test(phone.replace(/[\s-]/g, ""));
    },
    "Invalid Nigerian phone number. Use +234XXXXXXXXXX or 0XXXXXXXXXX format"
  );

// ==============
// Auth Schemas
// ==============

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Register Step 1: Basic Information
 */
export const registerStep1Schema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(255, "First name must be less than 255 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(255, "Last name must be less than 255 characters"),
});

export type RegisterStep1Schema = z.infer<typeof registerStep1Schema>;

/**
 * Register Step 2: Contact Information
 */
export const registerStep2Schema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  phone_number: nigerianPhoneSchema,
});

export type RegisterStep2Schema = z.infer<typeof registerStep2Schema>;

/**
 * Register Step 3: Password & Referral
 */
export const registerStep3Schema = z
  .object({
    password: passwordSchema,
    password_confirmation: z.string(),
    ref: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type RegisterStep3Schema = z.infer<typeof registerStep3Schema>;

/**
 * Register Step 4: Email Verification OTP
 */
export const registerStep4Schema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type RegisterStep4Schema = z.infer<typeof registerStep4Schema>;

/**
 * Email verification
 */
export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

/**
 * Resend email OTP
 */
export const resendEmailOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ResendEmailOTPSchema = z.infer<typeof resendEmailOTPSchema>;

/**
 * Forgot Password
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

/**
 * Verify Password Reset OTP
 */
export const verifyPasswordResetOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type VerifyPasswordResetOTPSchema = z.infer<typeof verifyPasswordResetOTPSchema>;

/**
 * Reset Password
 */
export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    reset_token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

/**
 * Send Phone Verification OTP
 */
export const sendPhoneOTPSchema = z.object({
  phone_number: nigerianPhoneSchema.optional(),
  method: z.enum(["sms", "call"]).default("sms"),
});

export type SendPhoneOTPSchema = z.infer<typeof sendPhoneOTPSchema>;

/**
 * Verify Phone with OTP
 */
export const verifyPhoneSchema = z.object({
  verification_id: z.number(),
  otp: z.string().regex(/^\d{5,6}$/, "OTP must be 5-6 digits"),
});

export type VerifyPhoneSchema = z.infer<typeof verifyPhoneSchema>;

// Number Search Schema
export const numberSearchSchema = z.object({
  country: z.string().optional(),
  type: z.enum(["temporary", "permanent"]).optional(),
  priceMax: z.number().optional(),
  page: z.number().default(1),
});

// SMS Schema
export const sendSMSSchema = z.object({
  to: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  from: z.string(),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(160, "Message must be less than 160 characters"),
});

// Wallet Schema
export const fundWalletSchema = z.object({
  amount: z
    .number()
    .min(1, "Minimum amount is 1")
    .max(1000000, "Maximum amount is 1,000,000"),
  paymentMethod: z.enum(["card", "bank", "paypal", "crypto"]),
});

export const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(1, "Minimum withdrawal amount is 1")
    .max(5000000, "Maximum withdrawal amount is 5,000,000"),
  bankAccount: z.string().min(1, "Please select a bank account"),
});

// Profile Schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  country: z.string().min(1, "Country is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const enable2FASchema = z.object({
  method: z.enum(["authenticator", "sms"]),
});

export const verify2FASchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

// Admin Schemas
export const addNumberSchema = z.object({
  number: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  country: z.string().min(1, "Country is required"),
  type: z.enum(["temporary", "permanent"]),
  priceTemporary: z.number().min(0),
  pricePermanent: z.number().min(0),
  capabilities: z.object({
    sms: z.boolean(),
    voice: z.boolean(),
    mms: z.boolean(),
  }),
});

export const editNumberSchema = addNumberSchema;

export const suspendUserSchema = z.object({
  userId: z.string(),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// OTP Verification Schema
export const otpVerificationSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type OTPVerificationSchema = z.infer<typeof otpVerificationSchema>;
