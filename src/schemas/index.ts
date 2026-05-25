import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupStep1Schema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
});

export const signupStep2Schema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  country: z.string().min(1, "Please select a country"),
});

export const signupStep3Schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signupStep4Schema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

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

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupStep1Schema = z.infer<typeof signupStep1Schema>;
export type SignupStep2Schema = z.infer<typeof signupStep2Schema>;
export type SignupStep3Schema = z.infer<typeof signupStep3Schema>;
export type SignupStep4Schema = z.infer<typeof signupStep4Schema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type NumberSearchSchema = z.infer<typeof numberSearchSchema>;
export type SendSMSSchema = z.infer<typeof sendSMSSchema>;
export type FundWalletSchema = z.infer<typeof fundWalletSchema>;
export type WithdrawalSchema = z.infer<typeof withdrawalSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type Enable2FASchema = z.infer<typeof enable2FASchema>;
export type Verify2FASchema = z.infer<typeof verify2FASchema>;
export type AddNumberSchema = z.infer<typeof addNumberSchema>;
export type ContactFormSchema = z.infer<typeof contactFormSchema>;
export type NewsletterSchema = z.infer<typeof newsletterSchema>;
export type OTPVerificationSchema = z.infer<typeof otpVerificationSchema>;
