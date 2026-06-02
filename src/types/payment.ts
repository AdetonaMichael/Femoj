/**
 * Payment Types - Complete TypeScript definitions for Paystack payment system
 */

/* ─── API Response Types ───────────────────────────────────────────────────── */

export interface PaystackPaymentData {
  authorization_url: string;
  reference: string;
  transaction_id: number;
  amount: number;
  access_code: string;
  public_key: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface PaymentInitResponse extends ApiResponse<PaystackPaymentData> {
  message?: string;
}

export interface PaymentVerifyResponse
  extends ApiResponse<{
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
  }> {}

export interface DirectCheckoutResponse extends ApiResponse<PaystackPaymentData> {
  checkout_type?: string;
  items?: CheckoutItem[];
}

/* ─── Payment Request Types ───────────────────────────────────────────────── */

export interface WalletFundingRequest {
  amount: number;
  purpose?: string;
  channel?: string;
  metadata?: Record<string, any>;
}

export interface DirectCheckoutRequest {
  amount: number;
  checkout_type: CheckoutType;
  items: CheckoutItem[];
  description?: string;
  metadata?: Record<string, any>;
  channel?: string;
}

export interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

/* ─── Payment Status Types ───────────────────────────────────────────────── */

export type PaymentStatus = "verifying" | "success" | "failed" | "cancelled";

export type CheckoutType =
  | "vtu"
  | "airtime"
  | "data"
  | "bills"
  | "products"
  | "services"
  | "wallet";

/* ─── Payment Hook State ───────────────────────────────────────────────────── */

export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  paymentData: PaystackPaymentData | null;
}

export interface UsePaymentReturn extends PaymentState {
  initializePayment: (
    amount: number,
    metadata?: Record<string, any>
  ) => Promise<PaymentInitResponse>;
  initializeDirectCheckout: (
    checkout: DirectCheckoutRequest
  ) => Promise<DirectCheckoutResponse>;
  verifyPayment: (reference: string) => Promise<PaymentVerifyResponse>;
  clearError: () => void;
  clearSuccess: () => void;
}

/* ─── Wallet Types ───────────────────────────────────────────────────────── */

export interface WalletTransaction {
  id: number;
  user_id: number;
  reference: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  user_id: number;
  balance: number;
  currency: string;
  last_updated: string;
}

/* ─── Paystack Transaction Types ───────────────────────────────────────────── */

export interface PaystackTransaction {
  id: number;
  user_id: number;
  reference: string;
  transaction_id: number;
  amount: number;
  status: "pending" | "success" | "failed" | "cancelled";
  channel: string;
  metadata?: Record<string, any>;
  authorization_url: string;
  access_code: string;
  public_key: string;
  created_at: string;
  updated_at: string;
}

/* ─── Callback Types ───────────────────────────────────────────────────────── */

export interface PaymentCallbackParams {
  reference?: string | null;
  status?: string | null;
  reason?: string | null;
}

/* ─── Service Response Types ───────────────────────────────────────────────── */

export interface PaymentServiceResult<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface InitializePaymentResult
  extends PaymentServiceResult<PaystackPaymentData> {}

export interface VerifyPaymentResult
  extends PaymentServiceResult<{
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
  }> {}

export interface DirectCheckoutResult
  extends PaymentServiceResult<PaystackPaymentData> {
  checkout_type?: string;
  items?: CheckoutItem[];
}

/* ─── Component Props Types ───────────────────────────────────────────────── */

export interface WalletFundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface FundingPresetsProps {
  onSelect: (amount: number) => void;
  disabled?: boolean;
  presets?: number[];
}

export interface PaymentCallbackProps {
  reference: string | null;
  status?: string | null;
  reason?: string | null;
}

/* ─── Environment Variables ───────────────────────────────────────────────── */

export interface PaymentConfig {
  API_BASE_URL: string;
  PAYMENT_INIT_URL: string;
  PAYMENT_VERIFY_URL: string;
  PAYMENT_SUCCESS_URL: string;
  PAYMENT_FAILURE_URL: string;
  PAYMENT_CANCELLED_URL: string;
  DEBUG_MODE: boolean;
}
