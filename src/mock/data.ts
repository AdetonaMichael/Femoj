import type {
  User,
  VirtualNumber,
  SMSMessage,
  SMSConversation,
  Transaction,
  Wallet,
  Country,
  NotificationPayload,
  ReferralStats,
  DashboardStats,
} from "@/types";
import { COUNTRIES } from "@/constants";

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: "user_1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+14155552671",
    country: "US",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "user",
    status: "active",
    kycStatus: "verified",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-05-20"),
  },
];

// Mock Virtual Numbers
export const MOCK_NUMBERS: VirtualNumber[] = [
  {
    id: "num_1",
    number: "+1 (415) 555-0123",
    country: "United States",
    countryCode: "US",
    type: "permanent",
    capabilities: { sms: true, voice: true },
    price: 29.99,
    renewalPrice: 29.99,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true,
    owner: MOCK_USERS[0],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "num_2",
    number: "+44 (207) 123-4567",
    country: "United Kingdom",
    countryCode: "GB",
    type: "temporary",
    capabilities: { sms: true, voice: false },
    price: 9.99,
    renewalPrice: 9.99,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    owner: MOCK_USERS[0],
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-05-20"),
  },
];

// Mock SMS Messages
export const MOCK_SMS_MESSAGES: SMSMessage[] = [
  {
    id: "sms_1",
    from: "+1 (415) 555-0123",
    to: "+1 (555) 123-4567",
    content: "Hello! This is a test message.",
    status: "delivered",
    direction: "outbound",
    virtualNumberId: "num_1",
    conversationId: "conv_1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 120 * 60 * 1000),
  },
  {
    id: "sms_2",
    from: "+1 (555) 987-6543",
    to: "+1 (415) 555-0123",
    content: "Hi! Thanks for reaching out.",
    status: "delivered",
    direction: "inbound",
    virtualNumberId: "num_1",
    conversationId: "conv_1",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 55 * 60 * 1000),
  },
  {
    id: "sms_3",
    from: "+44 (555) 111-2222",
    to: "+44 (207) 123-4567",
    content: "Your verification code is 123456",
    status: "delivered",
    direction: "inbound",
    virtualNumberId: "num_2",
    conversationId: "conv_3",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 10 * 60 * 1000),
  },
];

// Mock SMS Conversations
export const MOCK_SMS_CONVERSATIONS: SMSConversation[] = [
  {
    id: "conv_1",
    phoneNumber: "+1 (555) 123-4567",
    senderName: "Sarah Johnson",
    lastMessage: MOCK_SMS_MESSAGES[1],
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    messageCount: 12,
    unreadCount: 0,
    createdAt: new Date("2024-05-01"),
  },
  {
    id: "conv_2",
    phoneNumber: "+1 (555) 987-6543",
    senderName: "Mike Chen",
    lastMessage: MOCK_SMS_MESSAGES[0],
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messageCount: 5,
    unreadCount: 2,
    createdAt: new Date("2024-05-15"),
  },
  {
    id: "conv_3",
    phoneNumber: "+44 (555) 111-2222",
    senderName: "Emma Wilson",
    lastMessage: MOCK_SMS_MESSAGES[2],
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    messageCount: 3,
    unreadCount: 1,
    createdAt: new Date("2024-05-18"),
  },
];

// Mock Wallet
export const MOCK_WALLET: Wallet = {
  id: "wallet_1",
  userId: "user_1",
  balance: 1250.5,
  availableCredit: 450.75,
  pendingBalance: 200.0,
  currency: "USD",
  virtualAccountNumber: "1234567890",
  bankCode: "057",
  lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-05-20"),
};

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_1",
    walletId: "wallet_1",
    type: "credit",
    amount: 500,
    currency: "USD",
    description: "Wallet funding via Paystack",
    status: "completed",
    reference: "PAY_123456789",
    paymentMethod: "paystack",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "txn_2",
    walletId: "wallet_1",
    type: "debit",
    amount: 29.99,
    currency: "USD",
    description: "Number renewal - US +1 (415) 555-0123",
    status: "completed",
    reference: "NUM_RENEW_123",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "txn_3",
    walletId: "wallet_1",
    type: "debit",
    amount: 9.99,
    currency: "USD",
    description: "Number purchase - UK +44 (207) 123-4567",
    status: "completed",
    reference: "NUM_PUR_456",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Mock Referral Stats
export const MOCK_REFERRAL_STATS: ReferralStats = {
  totalReferrals: 24,
  activeReferrals: 18,
  totalEarnings: 3600,
  monthlyEarnings: 450,
  commissionRate: 10,
  pendingPayout: 850.75,
};

// Mock Dashboard Stats
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalBalance: 1250.5,
  activeNumbers: 2,
  monthlySMS: 156,
  monthlySpending: 79.98,
};

// Mock Notifications
export const MOCK_NOTIFICATIONS: NotificationPayload[] = [
  {
    id: "notif_1",
    userId: "user_1",
    type: "transaction",
    title: "Wallet Funded",
    message: "Your wallet has been credited with $500.00",
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "notif_2",
    userId: "user_1",
    type: "security",
    title: "New Login",
    message: "New login from Chrome on Windows",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "notif_3",
    userId: "user_1",
    type: "offer",
    title: "Special Offer",
    message: "Get 20% off on all permanent numbers this week",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// Mock Countries - Extended
export const MOCK_COUNTRIES_EXTENDED: Country[] = COUNTRIES.map((c) => ({
  ...c,
  pricing: {
    temporary: Math.round(Math.random() * 15) + 5,
    permanent: Math.round(Math.random() * 50) + 15,
  },
}));
