/**
 * User & Auth Types
 */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  balance?: number;
  account_type?: "individual" | "business";
  referral_code?: string;
  referral_count?: number;
  total_referral_earnings?: number;
  pin_status?: {
    is_set: boolean;
    created_at: string | null;
    updated_at: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  access_token: string;
  token_type: "Bearer";
  email_verification_sent?: boolean;
}

export interface PinStatus {
  is_set: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// Authentication Request/Response Types
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
  ref?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;  // API actually returns 'token', not 'access_token'
  access_token?: string;  // Optional for backward compatibility
  token_type?: "Bearer";
  email_verification_sent?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
}

export interface LoginResponse {
  user: User;
  token: string;  // API actually returns 'token', not 'access_token'
  access_token?: string;  // Optional for backward compatibility
  token_type?: "Bearer";
  pin_status: PinStatus;
  location_tracked?: boolean;
  tracked_at?: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  email_verified: boolean;
  verified_at: string;
}

export interface ResendEmailOTPRequest {
  email: string;
}

export interface ResendEmailOTPResponse {
  otp_sent: boolean;
  expires_in: number;
  expires_at: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  reset_sent: boolean;
  expires_in: number;
  expires_at: string;
}

export interface VerifyPasswordResetOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyPasswordResetOTPResponse {
  reset_token: string;
  verified: boolean;
  valid_until: string;
}

export interface ResetPasswordRequest {
  email: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  password_reset: boolean;
  reset_at: string;
  sessions_revoked: boolean;
}

export interface VerifyTokenRequest {
  // No request body, uses Authorization header
}

export interface VerifyTokenResponse {
  valid: boolean;
  user_id: number;
  email: string;
  expires_at: string;
}

export interface SendPhoneOTPRequest {
  phone_number?: string;
  method?: "sms" | "call";
}

export interface SendPhoneOTPResponse {
  verification_id: number;
  phone_number: string;
  method: "sms" | "call";
  sent_at: string;
  expires_in: number;
  expires_at: string;
}

export interface VerifyPhoneRequest {
  verification_id: number;
  otp: string;
}

export interface VerifyPhoneResponse {
  phone_verified: boolean;
  verified_at: string;
  phone_number: string;
}

export interface LogoutResponse {
  logged_out: boolean;
  logged_out_at: string;
}

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

// Virtual Number Types
export interface VirtualNumber {
  id: string;
  number: string;
  country: string;
  countryCode: string;
  areaCode?: string;
  type: "temporary" | "permanent";
  capabilities: {
    sms: boolean;
    voice: boolean;
    mms?: boolean;
  };
  price: number;
  renewalPrice: number;
  expiryDate: Date;
  isActive: boolean;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface NumberSearchParams {
  country?: string;
  type?: "temporary" | "permanent";
  capabilities?: ("sms" | "voice" | "mms")[];
  priceRange?: {
    min: number;
    max: number;
  };
  page?: number;
  limit?: number;
}

export interface NumberPurchasePayload {
  numberId: string;
  rentalDays?: number;
}

// SMS Types
export interface SMSMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  status: "sent" | "delivered" | "failed" | "pending";
  direction: "inbound" | "outbound";
  virtualNumberId: string;
  conversationId: string;
  createdAt: Date;
  deliveredAt?: Date;
  failureReason?: string;
}

export interface SMSConversation {
  id: string;
  phoneNumber: string;
  senderName: string;
  lastMessage: SMSMessage;
  lastMessageTime: Date;
  messageCount: number;
  unreadCount: number;
  createdAt: Date;
}

/**
 * Notification Types
 */
export type NotificationType = "transaction" | "system" | "promotion" | "update" | "alert";
export type NotificationPriority = "low" | "normal" | "high";

export interface NotificationData {
  [key: string]: string | number | boolean | object | null;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  type: NotificationType;
  priority: NotificationPriority;
  data: NotificationData | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
  by_priority: Record<NotificationPriority, number>;
}

export interface NotificationPreferences {
  enabled: boolean;
  transaction_notifications: boolean;
  system_notifications: boolean;
  promotion_notifications: boolean;
  update_notifications: boolean;
  alert_notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface NotificationsListResponse {
  data: Notification[];
  pagination: Pagination;
}

export interface NotificationFilterParams {
  page?: number;
  per_page?: number;
  type?: NotificationType;
  unread_only?: boolean;
  priority?: NotificationPriority;
}

export interface SendNotificationRequest {
  user_id: number;
  title: string;
  body: string;
  type: NotificationType;
  priority?: NotificationPriority;
  data?: NotificationData;
}

export interface SendMultipleNotificationsRequest {
  user_ids: number[];
  title: string;
  body: string;
  type: NotificationType;
  priority?: NotificationPriority;
  data?: NotificationData;
}

export interface DeleteMultipleNotificationsRequest {
  ids: number[];
}

export interface PushTokenRequest {
  expo_push_token: string;
  device_info?: {
    model?: string;
    os?: string;
    os_version?: string;
    app_version?: string;
  };
}

export interface NotificationBellResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
  details?: Record<string, string[]>;
}

export interface SendSMSPayload {
  to: string;
  content: string;
  from: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  availableCredit: number;
  pendingBalance: number;
  currency: string;
  virtualAccountNumber?: string;
  bankCode?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  currency: string;
  description: string;
  status: "pending" | "completed" | "failed";
  reference: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface FundWalletPayload {
  amount: number;
  paymentMethod: "paystack" | "bank_transfer";
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

/* ─── Payment Types (Paystack) ────────────────────────────────────────────── */

// Re-export payment types from payment.ts
export type {
  PaystackPaymentData,
  PaymentInitResponse,
  PaymentVerifyResponse,
  DirectCheckoutResponse,
  WalletFundingRequest,
  DirectCheckoutRequest,
  CheckoutItem,
  PaymentStatus,
  CheckoutType,
  PaymentState,
  UsePaymentReturn,
  WalletTransaction,
  WalletBalance,
  PaystackTransaction,
  PaymentCallbackParams,
  PaymentServiceResult,
  InitializePaymentResult,
  VerifyPaymentResult,
  DirectCheckoutResult,
  WalletFundingModalProps,
  FundingPresetsProps,
  PaymentCallbackProps,
  PaymentConfig,
} from "./payment";

// Referral Types
export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  commissionRate: number;
  earnedAmount: number;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
  commissionRate: number;
  pendingPayout: number;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalBalance: number;
  activeNumbers: number;
  monthlySMS: number;
  monthlySpending: number;
  pendingVerifications?: number;
  totalUsers?: number;
  totalRevenue?: number;
}

export interface AnalyticsData {
  date: string;
  value: number;
}

export interface SMSAnalytics {
  totalSent: number;
  totalReceived: number;
  deliveryRate: number;
  failureRate: number;
  byCountry: Record<string, number>;
  byDate: AnalyticsData[];
}

// Admin Types
export interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}

export interface UserWithStats extends User {
  totalSpent: number;
  numbersOwned: number;
  lastActive: Date;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  numbersAvailable: number;
  pricing: {
    temporary: number;
    permanent: number;
  };
}

export interface NotificationPayload {
  id: string;
  userId: string;
  type: "transaction" | "security" | "system" | "offer";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// UI State Types
export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export interface ToastPayload {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}
