// Brand Colors
export const BRAND_COLORS = {
  primary: "#0057FF", // Primary Blue
  secondary: "#0B1F4D", // Secondary Blue
  accent: "#3B82F6", // Accent Blue
  white: "#FFFFFF",
  black: "#000000",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
} as const;

// Site Config
export const SITE_CONFIG = {
  name: "Femoj",
  description: "Global virtual number marketplace and communication platform",
  domain: "femoj.com",
  tagline: "Buy, rent, and manage virtual numbers worldwide",
} as const;

// Countries with phone codes (sample - would be expanded)
export const COUNTRIES = [
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    numbersAvailable: 1250,
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    numbersAvailable: 890,
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    numbersAvailable: 450,
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    numbersAvailable: 320,
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    numbersAvailable: 780,
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    flag: "🇫🇷",
    numbersAvailable: 620,
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "🇳🇬",
    numbersAvailable: 2100,
  },
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "+27",
    flag: "🇿🇦",
    numbersAvailable: 580,
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    numbersAvailable: 3200,
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "+81",
    flag: "🇯🇵",
    numbersAvailable: 420,
  },
  {
    code: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    numbersAvailable: 250,
  },
  {
    code: "HK",
    name: "Hong Kong",
    dialCode: "+852",
    flag: "🇭🇰",
    numbersAvailable: 180,
  },
] as const;

// Pricing Tiers
export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    description: "For trying out",
    features: [
      "Up to 5 numbers",
      "SMS receive only",
      "30-day numbers",
      "Email support",
    ],
    featured: false,
    billedAs: "Billed monthly",
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    description: "Most popular",
    features: [
      "Unlimited numbers",
      "SMS send & receive",
      "Permanent numbers",
      "Priority support",
      "API access",
    ],
    featured: true,
    billedAs: "Billed monthly",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For businesses",
    features: [
      "Custom limits",
      "Dedicated account",
      "Phone support",
      "SLA guarantee",
      "Custom integrations",
    ],
    featured: false,
    billedAs: "Contact sales",
  },
] as const;

// Features Grid
export const FEATURES = [
  {
    icon: "Globe",
    title: "Global Coverage",
    description: "Access virtual numbers from 150+ countries worldwide",
  },
  {
    icon: "MessageSquare",
    title: "SMS Management",
    description: "Send and receive SMS messages with ease",
  },
  {
    icon: "Lock",
    title: "Secure & Private",
    description: "Enterprise-grade security for your communications",
  },
  {
    icon: "Zap",
    title: "Instant Setup",
    description: "Get started in minutes, no paperwork required",
  },
  {
    icon: "BarChart3",
    title: "Analytics",
    description: "Track usage and monitor your spending",
  },
  {
    icon: "Smartphone",
    title: "Mobile Ready",
    description: "Manage everything from our mobile app",
  },
] as const;

// Navigation
export const NAVIGATION = {
  main: [
    { label: "Home", href: "/" },
    { label: "Numbers", href: "/numbers" },
    { label: "Pricing", href: "/pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "Refund Policy", href: "/legal/refund" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Status", href: "/status" },
    { label: "Affiliate", href: "/affiliate" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "/faq" },
    { label: "API Docs", href: "/api-docs" },
    { label: "Contact Support", href: "/support" },
  ],
} as const;

// Dashboard Navigation
export const DASHBOARD_NAVIGATION = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Numbers", href: "/dashboard/numbers", icon: "Smartphone" },
  { label: "SMS", href: "/dashboard/sms", icon: "MessageSquare" },
  { label: "Wallet", href: "/dashboard/wallet", icon: "CreditCard" },
  { label: "Referrals", href: "/dashboard/referrals", icon: "Share2" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

// Admin Navigation
export const ADMIN_NAVIGATION = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Numbers", href: "/admin/numbers", icon: "Smartphone" },
  { label: "SMS", href: "/admin/sms", icon: "MessageSquare" },
  { label: "Transactions", href: "/admin/transactions", icon: "CreditCard" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
] as const;

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 30000,
} as const;

// Pagination
export const PAGINATION = {
  pageSize: 20,
  maxPages: 100,
} as const;

// Auth
export const AUTH = {
  tokenKey: "femoj_token",
  refreshTokenKey: "femoj_refresh_token",
  userKey: "femoj_user",
  expiryTime: 3600, // 1 hour
} as const;

// Validation
export const VALIDATION = {
  passwordMinLength: 8,
  phoneRegex: /^\+?[1-9]\d{1,14}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Animation Durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to continue.",
  FORBIDDEN: "You don't have permission to access this.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Our team has been notified.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Welcome back!",
  SIGNUP: "Account created successfully!",
  PASSWORD_CHANGED: "Password changed successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  NUMBER_PURCHASED: "Number purchased successfully!",
  SMS_SENT: "SMS sent successfully!",
  WALLET_FUNDED: "Wallet funded successfully!",
} as const;

// Notification Types
export const NOTIFICATION_TYPES = [
  "transaction",
  "security",
  "system",
  "offer",
] as const;

// Number Types
export const NUMBER_TYPES = [
  { value: "temporary", label: "Temporary (30 days)" },
  { value: "permanent", label: "Permanent" },
] as const;

// SMS Status
export const SMS_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  FAILED: "failed",
  PENDING: "pending",
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: "paystack", label: "Paystack" },
  { value: "bank_transfer", label: "Bank Transfer" },
] as const;

// Social Links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/femoj",
  linkedin: "https://linkedin.com/company/femoj",
  github: "https://github.com/femoj",
  facebook: "https://facebook.com/femoj",
  instagram: "https://instagram.com/femoj",
} as const;
