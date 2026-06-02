import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as fnsFormat, formatDistance } from "date-fns";

/**
 * Merge Tailwind CSS classes with deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency to locale mapping for proper formatting
 */
const CURRENCY_LOCALES: Record<string, string> = {
  "NGN": "en-NG", // Nigerian Naira
  "USD": "en-US", // US Dollar
  "EUR": "en-IE", // Euro
  "GBP": "en-GB", // British Pound
  "CAD": "en-CA", // Canadian Dollar
  "AUD": "en-AU", // Australian Dollar
  "JPY": "ja-JP", // Japanese Yen
  "INR": "en-IN", // Indian Rupee
  "ZAR": "en-ZA", // South African Rand
  "KES": "en-KE", // Kenyan Shilling
  "GHS": "en-GH", // Ghanaian Cedi
};

/**
 * Format currency with flexible currency selection
 * @param amount - The amount to format
 * @param currency - Currency code (USD, NGN, EUR, GBP, etc.) - defaults to NGN
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1000)           // ₦1,000.00 (Nigerian Naira)
 * formatCurrency(1000, "USD")    // $1,000.00 (US Dollar)
 * formatCurrency(1000, "EUR")    // €1,000.00 (Euro)
 * formatCurrency(1000, "GBP")    // £1,000.00 (British Pound)
 */
export function formatCurrency(
  amount: number,
  currency: string = "NGN"
): string {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format currency in Nigerian Naira (legacy function - use formatCurrency instead)
 */
export function formatNaira(amount: number): string {
  return formatCurrency(amount, "NGN");
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): Array<{ code: string; name: string }> {
  return [
    { code: "NGN", name: "Nigerian Naira" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "INR", name: "Indian Rupee" },
    { code: "ZAR", name: "South African Rand" },
    { code: "KES", name: "Kenyan Shilling" },
    { code: "GHS", name: "Ghanaian Cedi" },
  ];
}

/**
 * Check if a currency is supported
 */
export function isSupportedCurrency(currency: string): boolean {
  return currency in CURRENCY_LOCALES;
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency: string): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || "en-US", {
    style: "currency",
    currency,
  }).formatToParts(0)[0]?.value || currency;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

/**
 * Mask phone number for display
 */
export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `***-***-${cleaned.slice(-4)}`;
  }
  return `***-${cleaned.slice(-7)}`;
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  formatStr: string = "MMM dd, yyyy"
): string {
  return fnsFormat(new Date(date), formatStr);
}

/**
 * Format date relative to now
 */
export function formatDateRelative(date: Date | string): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | string,
  formatStr: string = "MMM dd, yyyy HH:mm"
): string {
  return fnsFormat(new Date(date), formatStr);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize every word
 */
export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate OTP
 */
export function generateOTP(length: number = 6): string {
  const otp = Math.floor(Math.random() * Math.pow(10, length));
  return otp.toString().padStart(length, "0");
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Parse JWT token
 */
export function parseJWT(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if JWT is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = parseJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Get query parameter from URL
 */
export function getQueryParam(param: string, url: string = ""): string | null {
  const urlObj = new URL(url || window.location.href);
  return urlObj.searchParams.get(param);
}

/**
 * Build query string
 */
export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  }
  return query.toString();
}

/**
 * Sort array by property
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Group array by property
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Remove duplicates from array
 */
export function removeDuplicates<T>(arr: T[], key?: keyof T): T[] {
  if (!key) return [...new Set(arr)];
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Flatten array
 */
export function flattenArray<T>(arr: any[]): T[] {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flattenArray(val) : val);
  }, []);
}

/**
 * Sleep/delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) await sleep(delay);
    }
  }
  throw lastError;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T = any>(
  json: string,
  fallback: T = {} as T
): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj: any, fallback: string = ""): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
}
