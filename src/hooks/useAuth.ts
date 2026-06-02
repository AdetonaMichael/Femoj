/**
 * Custom Authentication Hooks
 * Provides reusable authentication logic and state management
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { authService } from "@/services/api";
import { setAccessToken } from "@/lib/token";
import { setAuthToken as setPhoneServiceAuthToken } from "@/lib/phoneNumberService";
import type {
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendEmailOTPRequest,
  ForgotPasswordRequest,
  VerifyPasswordResetOTPRequest,
  ResetPasswordRequest,
  SendPhoneOTPRequest,
  VerifyPhoneRequest,
} from "@/types";

/**
 * Hook for user registration
 */
export function useRegister() {
  const router = useRouter();
  const {
    setIsLoading,
    setError,
    setSuccessMessage,
    setRegistrationEmail,
    setRegistrationToken,
  } = useAuthStore();

  const register = useCallback(
    async (payload: RegisterRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.register(payload);

        if (response.success && response.data) {
          const { user, token } = response.data;

          console.log("[useRegister] Registration successful", {
            userId: user.id,
            email: user.email,
            hasToken: !!token,
            tokenPreview: token ? token.slice(0, 20) + "..." : "NO TOKEN"
          });

          // Store token and redirect to verification
          if (token) {
            setAccessToken(token);
            setPhoneServiceAuthToken(token);
          }
          setRegistrationEmail(user.email);
          setSuccessMessage(
            "Registration successful! Please verify your email."
          );

          return { success: true, data: response.data };
        } else {
          const errorMessage = response.message || "Registration failed";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage, setRegistrationEmail, setRegistrationToken]
  );

  return { register };
}

/**
 * Hook for user login
 */
export function useLogin() {
  const { setUser, setAccessToken, setIsLoading, setError, setSuccessMessage } =
    useAuthStore();

  const login = useCallback(
    async (payload: LoginRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login(payload);

        if (response.success && response.data) {
          const { user, token } = response.data;

          console.log("[useLogin] Login API succeeded", { 
            userId: user.id, 
            email: user.email,
            hasToken: !!token,
            tokenPreview: token ? token.slice(0, 20) + "..." : "NO TOKEN",
            emailVerified: !!user.email_verified_at
          });

          if (!token) {
            const errorMessage = "No token received from API";
            setError(errorMessage);
            console.error("[useLogin] Token missing from response:", response.data);
            return { success: false, error: errorMessage };
          }

          // Store user and token (this also sets isAuthenticated = true)
          setAccessToken(token);
          setPhoneServiceAuthToken(token);
          setUser(user);
          setSuccessMessage("Login successful!");

          console.log("[useLogin] Token and user stored in state and phone service");

          // Wait a moment to ensure state propagates
          await new Promise(resolve => setTimeout(resolve, 50));

          console.log("[useLogin] Ready to redirect");
          return { success: true, data: response.data };
        } else {
          const errorMessage = response.message || "Login failed";
          setError(errorMessage);
          console.error("[useLogin] Login API failed:", { message: errorMessage, errors: response.errors });
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        console.error("[useLogin] Exception during login:", errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setAccessToken, setIsLoading, setError, setSuccessMessage]
  );

  return { login };
}

/**
 * Hook for email verification
 */
export function useVerifyEmail() {
  const { setIsLoading, setError, setSuccessMessage } = useAuthStore();

  const verifyEmail = useCallback(
    async (payload: VerifyEmailRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.verifyEmail(payload);

        if (response.success) {
          setSuccessMessage("Email verified successfully!");
          return { success: true };
        } else {
          const errorMessage = response.message || "Verification failed";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage]
  );

  return { verifyEmail };
}

/**
 * Hook for resending email OTP
 */
export function useResendEmailOTP() {
  const { setIsLoading, setError, setSuccessMessage } = useAuthStore();

  const resend = useCallback(
    async (payload: ResendEmailOTPRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.resendEmailOTP(payload);

        if (response.success && response.data) {
          setSuccessMessage(`OTP sent! Expires in ${response.data.expires_in}s`);
          return { success: true, data: response.data };
        } else {
          const errorMessage = response.message || "Failed to resend OTP";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage]
  );

  return { resend };
}

/**
 * Hook for password reset request
 */
export function useForgotPassword() {
  const { setIsLoading, setError, setSuccessMessage, setResetPasswordEmail } =
    useAuthStore();

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.forgotPassword(payload);

        if (response.success) {
          setResetPasswordEmail(payload.email);
          setSuccessMessage("Password reset link sent to your email!");
          return { success: true };
        } else {
          const errorMessage =
            response.message || "Failed to send reset link";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage, setResetPasswordEmail]
  );

  return { forgotPassword };
}

/**
 * Hook for verifying password reset OTP
 */
export function useVerifyPasswordResetOTP() {
  const { setIsLoading, setError, setSuccessMessage, setResetToken } =
    useAuthStore();

  const verify = useCallback(
    async (payload: VerifyPasswordResetOTPRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.verifyPasswordResetOTP(payload);

        if (response.success && response.data) {
          setResetToken(response.data.reset_token);
          setSuccessMessage("OTP verified! Proceed to reset password.");
          return { success: true, data: response.data };
        } else {
          const errorMessage = response.message || "Verification failed";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage, setResetToken]
  );

  return { verify };
}

/**
 * Hook for resetting password
 */
export function useResetPassword() {
  const router = useRouter();
  const { setIsLoading, setError, setSuccessMessage, logout } = useAuthStore();

  const reset = useCallback(
    async (payload: ResetPasswordRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.resetPassword(payload);

        if (response.success) {
          setSuccessMessage("Password reset successful! Please login again.");
          logout();

          // Redirect to login after a short delay
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);

          return { success: true };
        } else {
          const errorMessage = response.message || "Password reset failed";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage, logout, router]
  );

  return { reset };
}

/**
 * Hook for phone verification
 */
export function useSendPhoneOTP() {
  const { setIsLoading, setError, setSuccessMessage } = useAuthStore();

  const send = useCallback(
    async (payload: SendPhoneOTPRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.sendPhoneOTP(payload);

        if (response.success && response.data) {
          setSuccessMessage(
            `OTP sent via ${response.data.method.toUpperCase()}!`
          );
          return { success: true, data: response.data };
        } else {
          const errorMessage = response.message || "Failed to send OTP";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, setSuccessMessage]
  );

  return { send };
}

/**
 * Hook for verifying phone
 */
export function useVerifyPhone() {
  const router = useRouter();
  const { setUser, setIsLoading, setError, setSuccessMessage, updateUser } =
    useAuthStore();

  const verify = useCallback(
    async (payload: VerifyPhoneRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.verifyPhone(payload);

        if (response.success && response.data) {
          setSuccessMessage("Phone verified successfully!");
          // Update user with verified phone
          updateUser({
            phone_verified_at: response.data.verified_at,
          });

          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);

          return { success: true };
        } else {
          const errorMessage = response.message || "Verification failed";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setIsLoading, setError, setSuccessMessage, updateUser, router]
  );

  return { verify };
}

/**
 * Hook for logout
 */
export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Handle logout errors silently
    } finally {
      logout();
      router.push("/auth/login");
    }
  }, [logout, router]);

  return { logout: handleLogout };
}
