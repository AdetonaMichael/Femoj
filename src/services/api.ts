/**
 * Authentication & API Services
 * Handles all API communication with proper error handling and type safety
 */

import { apiPost, apiGet } from "@/lib/api-client";
import {
  setAccessToken,
  clearAllTokens,
  setVerificationToken,
  getVerificationToken,
} from "@/lib/token";
import type {
  ApiResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendEmailOTPRequest,
  ResendEmailOTPResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyPasswordResetOTPRequest,
  VerifyPasswordResetOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyTokenResponse,
  SendPhoneOTPRequest,
  SendPhoneOTPResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
  LogoutResponse,
  User,
  AuthUser,
} from "@/types";

/**
 * Auth Service - Public Endpoints
 */
export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(
    payload: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    return apiPost<RegisterResponse, RegisterRequest>("/auth/register", payload);
  },

  /**
   * Login user
   * POST /auth/login
   */
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiPost<LoginResponse, LoginRequest>(
      "/auth/login",
      payload
    );

    console.log("[authService.login] API Response received:", {
      success: response.success,
      hasToken: !!response.data?.token,
    });

    // Store token on successful login
    if (response.success && response.data?.token) {
      console.log("[authService.login] Storing token from API response");
      setAccessToken(response.data.token);
    } else if (response.success) {
      console.warn("[authService.login] Login succeeded but no token in response");
    }

    return response;
  },

  /**
   * Verify email with OTP
   * POST /auth/verify-email-with-otp
   */
  async verifyEmail(
    payload: VerifyEmailRequest
  ): Promise<ApiResponse<VerifyEmailResponse>> {
    return apiPost<VerifyEmailResponse, VerifyEmailRequest>(
      "/auth/verify-email-with-otp",
      payload
    );
  },

  /**
   * Resend email verification OTP
   * POST /auth/resend-email-verification-otp
   */
  async resendEmailOTP(
    payload: ResendEmailOTPRequest
  ): Promise<ApiResponse<ResendEmailOTPResponse>> {
    return apiPost<ResendEmailOTPResponse, ResendEmailOTPRequest>(
      "/auth/resend-email-verification-otp",
      payload
    );
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    return apiPost<ForgotPasswordResponse, ForgotPasswordRequest>(
      "/auth/forgot-password",
      payload
    );
  },

  /**
   * Verify password reset OTP
   * POST /auth/verify-password-reset-otp
   */
  async verifyPasswordResetOTP(
    payload: VerifyPasswordResetOTPRequest
  ): Promise<ApiResponse<VerifyPasswordResetOTPResponse>> {
    const response = await apiPost<
      VerifyPasswordResetOTPResponse,
      VerifyPasswordResetOTPRequest
    >("/auth/verify-password-reset-otp", payload);

    // Store reset token for password reset step
    if (response.success && response.data?.reset_token) {
      setVerificationToken(response.data.reset_token);
    }

    return response;
  },

  /**
   * Reset password with verified OTP
   * POST /auth/reset-password
   */
  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ApiResponse<ResetPasswordResponse>> {
    const response = await apiPost<
      ResetPasswordResponse,
      ResetPasswordRequest
    >("/auth/reset-password", payload);

    // Clear verification token after successful reset
    if (response.success) {
      clearAllTokens();
    }

    return response;
  },

  /**
   * Get current authenticated user
   * GET /auth/user
   * Requires: Authorization header with Bearer token
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiGet<User>("/auth/user", { requiresAuth: true });
  },

  /**
   * Verify token validity
   * GET /auth/verify
   * Requires: Authorization header with Bearer token
   */
  async verifyToken(): Promise<ApiResponse<VerifyTokenResponse>> {
    return apiGet<VerifyTokenResponse>("/auth/verify", { requiresAuth: true });
  },

  /**
   * Send phone verification OTP
   * POST /auth/send-phone-verification-otp
   * Requires: Authorization header with Bearer token
   */
  async sendPhoneOTP(
    payload: SendPhoneOTPRequest
  ): Promise<ApiResponse<SendPhoneOTPResponse>> {
    return apiPost<SendPhoneOTPResponse, SendPhoneOTPRequest>(
      "/auth/send-phone-verification-otp",
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Verify phone with OTP
   * POST /auth/verify-phone-with-otp
   * Requires: Authorization header with Bearer token
   */
  async verifyPhone(
    payload: VerifyPhoneRequest
  ): Promise<ApiResponse<VerifyPhoneResponse>> {
    return apiPost<VerifyPhoneResponse, VerifyPhoneRequest>(
      "/auth/verify-phone-with-otp",
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Logout user
   * POST /auth/logout
   * Requires: Authorization header with Bearer token
   */
  async logout(): Promise<ApiResponse<LogoutResponse>> {
    const response = await apiPost<LogoutResponse>("/auth/logout", {}, {
      requiresAuth: true,
    });

    // Clear tokens on successful logout
    if (response.success) {
      clearAllTokens();
    }

    return response;
  },
};

/**
 * Additional API Services - Placeholders for future implementation
 */
export const dashboardService = {
  // Dashboard API calls will be added here
};

export const numbersService = {
  // Numbers/Virtual Numbers API calls will be added here
};

export const smsService = {
  // SMS API calls will be added here
};

export const walletService = {
  // Wallet API calls will be added here
};
