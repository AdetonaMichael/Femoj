import { sleep } from "@/utils";
import type {
  User,
  AuthUser,
  LoginPayload,
  SignupPayload,
  VirtualNumber,
  SMSMessage,
  Transaction,
  Wallet,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  ReferralStats,
} from "@/types";
import {
  MOCK_USERS,
  MOCK_NUMBERS,
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  MOCK_DASHBOARD_STATS,
  MOCK_REFERRAL_STATS,
  MOCK_SMS_CONVERSATIONS,
  MOCK_SMS_MESSAGES,
} from "@/mock/data";

// Simulate API delay
const API_DELAY = 500; // ms

/**
 * Auth Service
 */
export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthUser>> {
    await sleep(API_DELAY);
    // Mock validation
    if (payload.email === "demo@femoj.com" && payload.password === "Demo@1234") {
      const user = MOCK_USERS[0];
      return {
        success: true,
        data: {
          ...user,
          accessToken: "mock_access_token_" + Date.now(),
          refreshToken: "mock_refresh_token_" + Date.now(),
        } as AuthUser,
      };
    }
    return {
      success: false,
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
    };
  },

  async signup(payload: SignupPayload): Promise<ApiResponse<{ message: string }>> {
    await sleep(API_DELAY);
    // Mock validation
    if (payload.email.includes("@")) {
      return {
        success: true,
        data: { message: "Account created successfully" },
      };
    }
    return {
      success: false,
      error: { code: "INVALID_EMAIL", message: "Invalid email format" },
    };
  },

  async verifyEmail(
    email: string,
    otp: string
  ): Promise<ApiResponse<{ message: string }>> {
    await sleep(API_DELAY);
    if (otp === "123456") {
      return {
        success: true,
        data: { message: "Email verified successfully" },
      };
    }
    return {
      success: false,
      error: { code: "INVALID_OTP", message: "Invalid OTP" },
    };
  },

  async resendOTP(email: string): Promise<ApiResponse<{ message: string }>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: { message: "OTP sent to your email" },
    };
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: { message: "Reset link sent to your email" },
    };
  },
};

/**
 * Numbers Service
 */
export const numbersService = {
  async searchNumbers(
    filters?: any
  ): Promise<ApiResponse<PaginatedResponse<VirtualNumber>>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: {
        items: MOCK_NUMBERS,
        total: MOCK_NUMBERS.length,
        page: 1,
        limit: 20,
        hasMore: false,
      },
    };
  },

  async getMyNumbers(): Promise<ApiResponse<VirtualNumber[]>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: MOCK_NUMBERS,
    };
  },

  async purchaseNumber(numberId: string): Promise<ApiResponse<VirtualNumber>> {
    await sleep(API_DELAY);
    const number = MOCK_NUMBERS.find((n) => n.id === numberId);
    if (number) {
      return { success: true, data: number };
    }
    return {
      success: false,
      error: { code: "NOT_FOUND", message: "Number not found" },
    };
  },

  async renewNumber(numberId: string): Promise<ApiResponse<VirtualNumber>> {
    await sleep(API_DELAY);
    const number = MOCK_NUMBERS.find((n) => n.id === numberId);
    if (number) {
      return { success: true, data: { ...number, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } };
    }
    return {
      success: false,
      error: { code: "NOT_FOUND", message: "Number not found" },
    };
  },
};

/**
 * SMS Service
 */
export const smsService = {
  async getConversations(): Promise<ApiResponse<PaginatedResponse<any>>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: {
        items: MOCK_SMS_CONVERSATIONS,
        total: MOCK_SMS_CONVERSATIONS.length,
        page: 1,
        limit: 50,
        hasMore: false,
      },
    };
  },

  async getMessages(conversationId: string): Promise<ApiResponse<SMSMessage[]>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: MOCK_SMS_MESSAGES,
    };
  },

  async sendSMS(payload: {
    to: string;
    from: string;
    content: string;
  }): Promise<ApiResponse<SMSMessage>> {
    await sleep(API_DELAY);
    const newMessage: SMSMessage = {
      id: "sms_" + Date.now(),
      from: payload.from,
      to: payload.to,
      content: payload.content,
      status: "pending",
      direction: "outbound",
      virtualNumberId: "num_1",
      conversationId: "conv_" + Date.now(),
      createdAt: new Date(),
    };
    return {
      success: true,
      data: newMessage,
    };
  },
};

/**
 * Wallet Service
 */
export const walletService = {
  async getWallet(): Promise<ApiResponse<Wallet>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: MOCK_WALLET,
    };
  },

  async getTransactions(): Promise<
    ApiResponse<PaginatedResponse<Transaction>>
  > {
    await sleep(API_DELAY);
    return {
      success: true,
      data: {
        items: MOCK_TRANSACTIONS,
        total: MOCK_TRANSACTIONS.length,
        page: 1,
        limit: 50,
        hasMore: false,
      },
    };
  },

  async fundWallet(payload: {
    amount: number;
    paymentMethod: string;
  }): Promise<ApiResponse<{ message: string; reference: string }>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: {
        message: "Wallet funding initiated",
        reference: "PAY_" + Date.now(),
      },
    };
  },

  async withdraw(payload: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }): Promise<ApiResponse<{ message: string }>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: { message: "Withdrawal request submitted" },
    };
  },
};

/**
 * Dashboard Service
 */
export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: MOCK_DASHBOARD_STATS,
    };
  },
};

/**
 * Referral Service
 */
export const referralService = {
  async getStats(): Promise<ApiResponse<ReferralStats>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: MOCK_REFERRAL_STATS,
    };
  },

  async getReferralLink(): Promise<ApiResponse<{ link: string }>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: { link: "https://femoj.com/ref/abc123xyz" },
    };
  },
};

/**
 * User Service
 */
export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: MOCK_USERS[0],
    };
  },

  async updateProfile(
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: { ...MOCK_USERS[0], ...userData },
    };
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    await sleep(API_DELAY);
    return {
      success: true,
      data: { message: "Password changed successfully" },
    };
  },
};
