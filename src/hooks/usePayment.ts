/**
 * usePayment Hook
 * Custom React hook for managing Paystack payment operations
 */

"use client";

import { useState, useCallback } from "react";
import PaymentService from "@/services/paymentService";
import type {
  DirectCheckoutRequest,
  DirectCheckoutResult,
  InitializePaymentResult,
  PaymentState,
  VerifyPaymentResult,
  UsePaymentReturn,
} from "@/types/payment";

/**
 * usePayment - Custom hook for payment operations
 * @returns Object with payment state and methods
 */
export const usePayment = (): UsePaymentReturn => {
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    successMessage: null,
    paymentData: null,
  });

  /**
   * Initialize wallet funding payment
   */
  const initializePayment = useCallback(
    async (
      amount: number,
      metadata?: Record<string, any>
    ): Promise<InitializePaymentResult> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await PaymentService.initializeWalletFunding(
          amount,
          metadata
        );

        if (result.success && result.data) {
          setState((prev): PaymentState => ({
            isLoading: prev.isLoading,
            error: null,
            successMessage: "Payment initialized. Redirecting to checkout...",
            paymentData: result.data!,
          }));
          PaymentService.storePaymentReference(result.data.reference);
        } else {
          setState((prev): PaymentState => ({
            isLoading: prev.isLoading,
            error: result.message || "Failed to initialize payment",
            successMessage: null,
            paymentData: null,
          }));
        }

        return result;
      } catch (error: any) {
        const errorMsg =
          error?.message || "Payment initialization failed. Please try again.";
        setState((prev): PaymentState => ({
          isLoading: prev.isLoading,
          error: errorMsg,
          successMessage: null,
          paymentData: null,
        }));
        return {
          success: false,
          message: errorMsg,
        };
      } finally {
        setState((prev): PaymentState => ({
          isLoading: false,
          error: prev.error,
          successMessage: prev.successMessage,
          paymentData: prev.paymentData,
        }));
      }
    },
    []
  );

  /**
   * Initialize direct checkout payment
   */
  const initializeDirectCheckout = useCallback(
    async (checkout: DirectCheckoutRequest): Promise<DirectCheckoutResult> => {
      setState((prev): PaymentState => ({
        isLoading: true,
        error: null,
        successMessage: prev.successMessage,
        paymentData: null,
      }));

      try {
        const result = await PaymentService.initializeDirectCheckout(checkout);

        if (result.success && result.data) {
          setState((prev): PaymentState => ({
            isLoading: prev.isLoading,
            error: null,
            successMessage: "Checkout initialized. Redirecting to payment...",
            paymentData: result.data!,
          }));
          PaymentService.storePaymentReference(result.data.reference);
        } else {
          setState((prev): PaymentState => ({
            isLoading: prev.isLoading,
            error: result.message || "Failed to initialize checkout",
            successMessage: null,
            paymentData: null,
          }));
        }

        return result;
      } catch (error: any) {
        const errorMsg =
          error?.message || "Checkout initialization failed. Please try again.";
        setState((prev): PaymentState => ({
          isLoading: prev.isLoading,
          error: errorMsg,
          successMessage: null,
          paymentData: null,
        }));
        return {
          success: false,
          message: errorMsg,
        };
      } finally {
        setState((prev): PaymentState => ({
          isLoading: false,
          error: prev.error,
          successMessage: prev.successMessage,
          paymentData: prev.paymentData,
        }));
      }
    },
    []
  );

  /**
   * Verify payment transaction
   */
  const verifyPayment = useCallback(
    async (reference: string): Promise<VerifyPaymentResult> => {
      console.log("[usePayment] 🔍 verifyPayment() called with reference:", reference);

      setState((prev): PaymentState => ({
        isLoading: true,
        error: null,
        successMessage: prev.successMessage,
        paymentData: prev.paymentData,
      }));

      try {
        console.log("[usePayment] Calling PaymentService.verifyPayment()...");
        const result = await PaymentService.verifyPayment(reference);

        console.log("[usePayment] Received result from PaymentService:", {
          success: result.success,
          message: result.message,
          dataAvailable: !!result.data,
        });

        if (result.success) {
          console.log("[usePayment] ✅ Verification successful, updating state");
          setState((prev): PaymentState => ({
            isLoading: prev.isLoading,
            error: null,
            successMessage: "Payment verified successfully",
            paymentData: prev.paymentData,
          }));
        } else {
          console.error("[usePayment] ❌ Verification failed:", result.message);
          setState((prev): PaymentState => ({
            isLoading: prev.isLoading,
            error: result.message || "Payment verification failed",
            successMessage: null,
            paymentData: prev.paymentData,
          }));
        }

        return result;
      } catch (error: any) {
        const errorMsg =
          error?.message || "Payment verification failed. Please try again.";
        console.error("[usePayment] ❌ verifyPayment() exception:", {
          message: error?.message,
          error: error,
        });
        setState((prev): PaymentState => ({
          isLoading: prev.isLoading,
          error: errorMsg,
          successMessage: null,
          paymentData: prev.paymentData,
        }));
        return {
          success: false,
          message: errorMsg,
        };
      } finally {
        setState((prev): PaymentState => ({
          isLoading: false,
          error: prev.error,
          successMessage: prev.successMessage,
          paymentData: prev.paymentData,
        }));
      }
    },
    []
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Clear success message
   */
  const clearSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, successMessage: null }));
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    successMessage: state.successMessage,
    paymentData: state.paymentData,
    initializePayment,
    initializeDirectCheckout,
    verifyPayment,
    clearError,
    clearSuccess,
  };
};
