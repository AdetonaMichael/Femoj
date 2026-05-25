// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  avatar?: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "banned";
  kycStatus: "pending" | "verified" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

// Authentication Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
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
