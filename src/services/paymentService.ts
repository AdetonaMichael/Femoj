/**
 * Paystack Payment Service
 * Handles all payment initialization, verification, and checkout operations
 */

import { apiGet, apiPost } from "@/lib/api-client";
import type {
  WalletFundingRequest,
  DirectCheckoutRequest,
  PaymentInitResponse,
  PaymentVerifyResponse,
  DirectCheckoutResponse,
  CheckoutItem,
  InitializePaymentResult,
  VerifyPaymentResult,
  DirectCheckoutResult,
  PaystackPaymentData,
} from "@/types/payment";

const PAYMENT_ENDPOINTS = {
  INIT: "/payment/paystack-initiate-payment",
  VERIFY: "/payment/paystack-verify",
  DIRECT_CHECKOUT: "/payment/direct-checkout",
} as const;

class PaymentService {
  /**
   * Initialize a wallet funding payment
   * ✅ Backend now handles conversion (if needed)
   * @param amount - Amount in user's local currency (NGN for Nigeria)
   * @param metadata - Optional metadata for tracking
   * @returns Payment initialization result with authorization URL
   */
  static async initializeWalletFunding(
    amount: number,
    metadata?: Record<string, any>
  ): Promise<InitializePaymentResult> {
    try {
      if (amount < 100) {
        return {
          success: false,
          message: "Minimum amount is ₦100",
        };
      }

      console.log("[PaymentService] Initiating wallet funding:", { amount });

      const response = await apiPost<PaystackPaymentData>(
        PAYMENT_ENDPOINTS.INIT,
        {
          amount: Math.round(amount),
          purpose: "wallet_funding",
          channel: "card",
          metadata: {
            ...metadata,
            transaction_type: "wallet_funding",
            timestamp: new Date().toISOString(),
          },
        },
        { requiresAuth: true }
      );

      if (response.success && response.data) {
        console.log("[PaymentService] Wallet funding initialized successfully");
        return {
          success: true,
          data: response.data,
          message: response.message || "Payment initialized successfully",
        } as InitializePaymentResult;
      }

      return {
        success: false,
        message: response.message || "Failed to initialize payment",
        errors: response.errors,
      };
    } catch (error: any) {
      console.error("[PaymentService] Wallet funding error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Payment initialization failed",
        errors: error?.response?.data?.errors,
      };
    }
  }

  /**
   * Initialize a direct checkout payment (VTU, bills, products, etc)
   * ✅ Backend now handles USD → NGN conversion
   * @param checkoutData - Checkout details including items and amount (in USD)
   * @returns Checkout initialization result with authorization URL (amounts in NGN)
   */
  static async initializeDirectCheckout(
    checkoutData: DirectCheckoutRequest
  ): Promise<DirectCheckoutResult> {
    try {
      // Validate checkout data
      if (!checkoutData.amount || checkoutData.amount < 1) {
        return {
          success: false,
          message: "Amount must be greater than 0",
        };
      }

      if (!checkoutData.items || checkoutData.items.length === 0) {
        return {
          success: false,
          message: "At least one item is required",
        };
      }

      // Validate items
      const hasInvalidItem = checkoutData.items.some(
        (item) => !item.id || !item.name || item.quantity < 1 || item.price < 1
      );

      if (hasInvalidItem) {
        return {
          success: false,
          message: "Invalid item data: all items must have id, name, quantity, and price",
        };
      }

      console.log("[PaymentService] Sending USD amount to backend for conversion:", checkoutData.amount);

      const response = await apiPost<PaystackPaymentData>(
        PAYMENT_ENDPOINTS.DIRECT_CHECKOUT,
        {
          amount: Math.round(checkoutData.amount), // ✅ Backend will convert USD → NGN
          checkout_type: checkoutData.checkout_type,
          items: checkoutData.items,
          description:
            checkoutData.description ||
            `${checkoutData.checkout_type} purchase - ${checkoutData.items.length} item(s)`,
          metadata: {
            ...checkoutData.metadata,
            items_count: checkoutData.items.length,
            checkout_type: checkoutData.checkout_type,
            timestamp: new Date().toISOString(),
          },
          channel: checkoutData.channel || "card",
        },
        { requiresAuth: true }
      );

      if (response.success && response.data) {
        console.log("[PaymentService] Checkout response received (NGN amount):", response.data);
        return {
          success: true,
          data: response.data,
          checkout_type: checkoutData.checkout_type,
          items: checkoutData.items,
          message: response.message || "Checkout initialized successfully",
        } as DirectCheckoutResult;
      }

      return {
        success: false,
        message: response.message || "Failed to initialize checkout",
        errors: response.errors,
      };
    } catch (error: any) {
      console.error("[PaymentService] Direct checkout error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Checkout initialization failed",
        errors: error?.response?.data?.errors,
      };
    }
  }

  /**
   * Verify a payment transaction
   * @param reference - Payment reference from Paystack
   * @returns Verification result with payment details
   */
  static async verifyPayment(
    reference: string
  ): Promise<VerifyPaymentResult> {
    try {
      if (!reference) {
        console.error("[PaymentService] Verification error: No reference provided");
        return {
          success: false,
          message: "Payment reference is required",
        };
      }

      console.log("[PaymentService] Starting verification for reference:", reference);

      const endpoint = `${PAYMENT_ENDPOINTS.VERIFY}/${reference}`;
      console.log("[PaymentService] Verification endpoint:", {
        endpoint,
        fullUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
      });

      const response = await apiGet<{
        reference: string;
        amount: number;
        status: string;
        paid_at: string;
      }>(
        endpoint,
        { requiresAuth: true }
      );

      console.log("[PaymentService] Full API Response:", {
        success: response.success,
        message: response.message,
        data: response.data,
        error: response.error,
        errors: response.errors,
        rawResponse: response
      });

      if (response.success && response.data) {
        console.log("[PaymentService] ✅ Verification SUCCESS:", {
          reference: response.data.reference,
          amount: response.data.amount,
          status: response.data.status,
          paid_at: response.data.paid_at,
        });
        return {
          success: true,
          data: response.data,
          message: "Payment verified successfully",
        };
      }

      console.error("[PaymentService] ❌ Verification FAILED:", {
        success: response.success,
        message: response.message,
        error: response.error,
        errors: response.errors,
      });

      return {
        success: false,
        message: response.message || "Payment verification failed",
      };
    } catch (error: any) {
      console.error("[PaymentService] ❌ Payment verification error - Exception:", {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        response: error?.response?.data,
        fullError: error,
      });
      return {
        success: false,
        message:
          error?.response?.data?.message || "Payment verification failed",
      };
    }
  }

  /**
   * Calculate total from items array
   * @param items - Array of checkout items
   * @returns Total amount
   */
  static calculateTotal(items: CheckoutItem[]): number {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  /**
   * Get payment callback parameters from URL
   * @returns Callback parameters object
   */
  static getCallbackParams() {
    if (typeof window === "undefined") {
      return {
        reference: null,
        status: null,
        reason: null,
      };
    }

    const params = new URLSearchParams(window.location.search);
    return {
      reference: params.get("reference"),
      status: params.get("status"),
      reason: params.get("reason"),
    };
  }

  /**
   * Store payment reference in session storage
   * @param reference - Payment reference to store
   */
  static storePaymentReference(reference: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("payment_reference", reference);
      sessionStorage.setItem("payment_start_time", Date.now().toString());
    }
  }

  /**
   * Get stored payment reference
   * @returns Stored payment reference or null
   */
  static getStoredReference(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("payment_reference");
    }
    return null;
  }

  /**
   * Clear payment reference from session storage
   */
  static clearStoredReference(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("payment_reference");
      sessionStorage.removeItem("payment_start_time");
    }
  }

  /**
   * Check if payment has expired (> 1 hour)
   * @returns true if expired, false otherwise
   */
  static isPaymentExpired(): boolean {
    if (typeof window === "undefined") return true;

    const startTime = sessionStorage.getItem("payment_start_time");
    if (!startTime) return true;

    const elapsed = Date.now() - parseInt(startTime);
    return elapsed > 3600000; // 1 hour in milliseconds
  }

  /**
   * Redirect to Paystack payment page
   * @param authorizationUrl - Paystack authorization URL
   */
  static redirectToPaystack(authorizationUrl: string): void {
    if (typeof window !== "undefined") {
      window.location.href = authorizationUrl;
    }
  }

  /**
   * Format currency for display
   * @param amount - Amount to format
   * @returns Formatted currency string
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

export default PaymentService;
