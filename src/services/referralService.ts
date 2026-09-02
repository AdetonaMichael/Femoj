/**
 * Referral Service
 * Handles all referral-related API communication
 */

import { apiGet, apiPost } from "@/lib/api-client";
import type {
  ApiResponse,
  ReferralLink,
  ReferralEntry,
  ReferralStats,
  ReferralMilestone,
  ReferralProgram,
} from "@/types";

export const referralService = {
  /**
   * Get the authenticated user's referral links
   * GET /referrals/my-link
   */
  async getMyLink(): Promise<ApiResponse<ReferralLink[]>> {
    return apiGet<ReferralLink[]>("/referrals/my-link", {
      requiresAuth: true,
    });
  },

  /**
   * Get users referred by the authenticated user
   * GET /referrals/my-referrals
   */
  async getMyReferrals(): Promise<ApiResponse<ReferralEntry[]>> {
    return apiGet<ReferralEntry[]>("/referrals/my-referrals", {
      requiresAuth: true,
    });
  },

  /**
   * Get referral stats for the authenticated user
   * GET /referrals/stats
   */
  async getStats(): Promise<ApiResponse<ReferralStats>> {
    return apiGet<ReferralStats>("/referrals/stats", {
      requiresAuth: true,
    });
  },

  /**
   * Get milestone tracking for referred users
   * GET /referrals/milestones
   */
  async getMilestones(): Promise<ApiResponse<ReferralMilestone[]>> {
    return apiGet<ReferralMilestone[]>("/referrals/milestones", {
      requiresAuth: true,
    });
  },

  /**
   * Get all available referral programs
   * GET /referrals/programs
   */
  async getPrograms(): Promise<ApiResponse<ReferralProgram[]>> {
    return apiGet<ReferralProgram[]>("/referrals/programs");
  },

  /**
   * Create or get an existing referral link
   * POST /referrals/create
   */
  async createLink(payload: {
    programId: number;
    userId: number;
  }): Promise<ApiResponse<ReferralLink>> {
    return apiPost<ReferralLink>("/referrals/create", payload, {
      requiresAuth: true,
    });
  },

  /**
   * Track a referral conversion by code
   * POST /referrals/track
   */
  async trackConversion(payload: {
    referral_code: string;
  }): Promise<ApiResponse<null>> {
    return apiPost<null>("/referrals/track", payload, {
      requiresAuth: true,
    });
  },

  /**
   * Get payout status for the authenticated user
   * GET /referrals/payout-status
   */
  async getPayoutStatus(): Promise<ApiResponse<unknown>> {
    return apiGet<unknown>("/referrals/payout-status", {
      requiresAuth: true,
    });
  },

  /**
   * Withdraw referral earnings
   * POST /referrals/withdraw
   */
  async withdraw(payload: {
    amount: number;
  }): Promise<ApiResponse<unknown>> {
    return apiPost<unknown>("/referrals/withdraw", payload, {
      requiresAuth: true,
    });
  },

  /**
   * Convert reward points to cash
   * POST /referrals/convert-points
   */
  async convertPoints(payload: {
    points: number;
  }): Promise<ApiResponse<{ converted_amount: number }>> {
    return apiPost<{ converted_amount: number }>(
      "/referrals/convert-points",
      payload,
      { requiresAuth: true }
    );
  },
};
