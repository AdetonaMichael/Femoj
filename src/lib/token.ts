/**
 * Token Management Utilities
 * Handles secure token storage and retrieval with cookie persistence for server-side access
 */

const TOKEN_KEY = "femoj_access_token";
const VERIFY_TOKEN_KEY = "femoj_verify_token";

/**
 * Store access token in localStorage and set as cookie for server-side access
 */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    // Store in localStorage for client-side access
    localStorage.setItem(TOKEN_KEY, token);
    
    // Set cookie with proper attributes for better reliability
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds
    
    const cookieString = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; expires=${expiresDate.toUTCString()}; SameSite=Lax`;
    document.cookie = cookieString;
    
    // Log for debugging - ALWAYS log this for verification
    console.log("[Token] Access token set", { 
      tokenLength: token.length,
      tokenPreview: token.slice(0, 20) + "...",
      expiresAt: expiresDate.toISOString(),
      cookieSet: !!document.cookie
    });
  }
}

/**
 * Retrieve access token from localStorage (client-side)
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove access token from localStorage and cookies
 */
export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    // Clear cookie by setting expires to past date
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
    
    if (process.env.NEXT_PUBLIC_VERBOSE_API_LOGGING === "true") {
      console.log("[Token] Access token cleared");
    }
  }
}

/**
 * Store verification token (for password reset, email verification, etc.)
 */
export function setVerificationToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(VERIFY_TOKEN_KEY, token);
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = `${VERIFY_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; expires=${expiresDate.toUTCString()}; SameSite=Lax`;
  }
}

/**
 * Retrieve verification token
 */
export function getVerificationToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(VERIFY_TOKEN_KEY);
  }
  return null;
}

/**
 * Clear verification token
 */
export function clearVerificationToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(VERIFY_TOKEN_KEY);
    document.cookie = `${VERIFY_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
  }
}

/**
 * Clear all auth tokens
 */
export function clearAllTokens(): void {
  clearAccessToken();
  clearVerificationToken();
}

/**
 * Check if token is expired based on expires_at timestamp
 */
export function isTokenExpired(expiresAt: string): boolean {
  try {
    const expiryTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    // Consider token expired if less than 1 minute remaining
    return now >= expiryTime - 60000;
  } catch {
    return true;
  }
}

/**
 * Get formatted authorization header
 */
export function getAuthorizationHeader(): { Authorization: string } | null {
  const token = getAccessToken();
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
  };
}
