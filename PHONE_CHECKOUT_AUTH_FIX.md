# Phone Number Checkout Authentication Fix

## Issue Description

When clicking the "Pay" button on the phone number checkout details page, the user received an "unauthenticated" alert message and was redirected back to the login page, even after logging in successfully.

---

## Root Cause Analysis

The issue was caused by a **token synchronization problem** between the authentication system and the phone number API service:

### The Problem

1. **User logs in** → Auth token is stored in `localStorage` and `auth store`
2. **User navigates to checkout page** → Tries to purchase a phone number
3. **phoneNumberService.purchasePhoneNumber()** is called
4. **⚠️ ISSUE:** The token stored in `localStorage` was **NOT being passed to the axios client** in phoneNumberService
5. **Axios request sent WITHOUT token** → Backend returns 401 Unauthorized
6. **User redirected to login** despite being authenticated

### Why This Happened

The `phoneNumberService.ts` uses an axios instance with a local `authToken` variable:

```typescript
let authToken: string | null = null; // Initially null

const client: AxiosInstance = axios.create({...});

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function setAuthToken(token: string) {
  authToken = token; // Function exists but was NEVER CALLED
}
```

**The `setAuthToken()` function existed but was never being called** when the user logged in or when the app initialized.

---

## Solution Implemented

### Files Modified

1. **`src/hooks/useAuth.ts`**
   - Import: `setAuthToken as setPhoneServiceAuthToken` from phoneNumberService
   - Action: Call `setPhoneServiceAuthToken(token)` after login succeeds
   - Action: Call `setPhoneServiceAuthToken(token)` after registration succeeds

2. **`app/auth-initializer.tsx`**
   - Import: `setAuthToken as setPhoneServiceAuthToken` from phoneNumberService
   - Action: Call `setPhoneServiceAuthToken(token)` when hydrating token from localStorage on app load
   - Benefit: Ensures token is passed to phoneNumberService even on page refresh

3. **`src/store/auth.ts`**
   - Import: `setAuthToken as setPhoneServiceAuthToken` from phoneNumberService
   - Action: Call `setPhoneServiceAuthToken("")` in the `logout()` action
   - Benefit: Clears token from phoneNumberService when user logs out

4. **`src/lib/phoneNumberService.ts`**
   - Updated `setAuthToken()` to handle `null` tokens (for logout)
   - Added debug logging to track when tokens are set/cleared

5. **`app/dashboard/numbers/[code]/page.tsx`**
   - Enhanced error handling in `handlePayment()` function
   - Added detection for 401 Unauthorized errors
   - Shows appropriate error messages and redirects to login if session expired

---

## How The Fix Works

### Authentication Flow (After Fix)

```
1. User logs in with email/password
   ↓
2. useLogin hook gets token from backend
   ↓
3. setAccessToken(token) stores in localStorage & cookies
   ↓
4. ✅ NEW: setPhoneServiceAuthToken(token) passes to axios client
   ↓
5. User can now call phoneNumberService.purchasePhoneNumber()
   ↓
6. axios includes "Authorization: Bearer {token}" header
   ↓
7. Backend accepts request ✅ Purchase succeeds
```

### On Page Refresh (After Fix)

```
1. App loads, AuthInitializer runs
   ↓
2. getAccessToken() retrieves token from localStorage
   ↓
3. Auth store is hydrated with token
   ↓
4. ✅ NEW: setPhoneServiceAuthToken(token) passes to axios client
   ↓
5. phoneNumberService is ready to make authenticated requests ✅
```

### On Logout (After Fix)

```
1. User clicks logout
   ↓
2. clearAllTokens() removes from localStorage
   ↓
3. ✅ NEW: setPhoneServiceAuthToken("") clears axios token
   ↓
4. Auth store cleared
   ↓
5. All services clean and ready for next login ✅
```

---

## Testing The Fix

### Step 1: Clear All Data
```javascript
// In browser console:
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### Step 2: Login
1. Navigate to `http://localhost:3000/auth/login`
2. Enter your email and password
3. Check browser console for logs:
   - `[useLogin] Login API succeeded`
   - `[useLogin] Token and user stored in state and phone service` ← NEW
   - Should see token being set in phoneNumberService

### Step 3: Purchase a Phone Number
1. Go to `http://localhost:3000/dashboard/numbers`
2. Click "Rent" on any country
3. Select a phone number
4. Choose payment method
5. Click "Pay" button
6. **✅ Should now proceed without authentication error**

### Step 4: Verify On Page Refresh
1. While on checkout page, press F5 to refresh
2. Check console for:
   - `[AuthInitializer] Token restored and passed to phoneNumberService` ← NEW
3. Try clicking "Pay" again
4. **✅ Should work because token was restored**

### Step 5: Verify Logout
1. Log out from dashboard
2. Check console for:
   - `[PhoneNumberService] Auth token cleared` ← NEW
3. Try accessing checkout page (should redirect to login)
4. **✅ Session properly cleared**

---

## Console Log Output (After Fix)

### During Login
```
[useLogin] Login API succeeded {
  userId: "user-123",
  email: "user@example.com",
  hasToken: true,
  tokenPreview: "eyJhbGciOiJIUzI1..."
}
[useLogin] Token and user stored in state and phone service ✅ NEW
[PhoneNumberService] Auth token set {
  tokenLength: 342,
  tokenPreview: "eyJhbGciOiJIUzI1..."
}
```

### During Page Refresh
```
[AuthInitializer] Token restored and passed to phoneNumberService ✅ NEW
[PhoneNumberService] Auth token set {
  tokenLength: 342,
  tokenPreview: "eyJhbGciOiJIUzI1..."
}
```

### During Logout
```
[PhoneNumberService] Auth token cleared ✅ NEW
```

---

## FAQ

**Q: Why did this only happen for phone number purchases?**
A: The `phoneNumberService.ts` uses its own axios instance with a separate token variable. Other services might use the fetch API client which gets the token directly from `getAuthorizationHeader()` each request, so they don't have this issue.

**Q: Will this work for all authenticated endpoints?**
A: Yes, any endpoint using `phoneNumberService` will now work because the axios client will include the token in the Authorization header.

**Q: What if I want to use this pattern for other services?**
A: Apply the same pattern:
1. Create a `setServiceToken()` export in the service
2. Call it from `useLogin`, `AuthInitializer`, and during logout
3. Ensure the service's HTTP client includes the token in requests

**Q: Does this affect performance?**
A: No - it's just storing a token reference, no additional API calls or overhead.

---

## What Was Changed - Summary

| File | Change | Impact |
|------|--------|--------|
| `useAuth.ts` | Call `setPhoneServiceAuthToken(token)` during login | Passes token to axios client |
| `auth-initializer.tsx` | Call `setPhoneServiceAuthToken(token)` on hydrate | Token persists across page refresh |
| `auth.ts` | Call `setPhoneServiceAuthToken("")` on logout | Properly clears token from all services |
| `phoneNumberService.ts` | Handle `null` tokens in `setAuthToken()` | Allows token clearing |
| `[code]/page.tsx` | Improved error handling for auth failures | Better user experience on auth errors |

---

## Next Steps

✅ **Fix is complete and ready to test**

**To verify everything works:**
1. Log out completely
2. Clear browser storage (localStorage & cookies)
3. Log back in
4. Try purchasing a phone number
5. Refresh the page
6. Try purchasing again
7. Log out

All scenarios should now work without authentication errors.

---

## Technical Details for Backend Team

### What The Frontend Now Expects

1. **Phone number purchase endpoint** should require authentication (Bearer token)
2. **401 Unauthorized** response triggers redirect to login
3. **Token must be included in Authorization header** for all protected endpoints

### Verification Request

```bash
# Should work with valid token
curl -X POST https://api.example.com/api/v1/phone-numbers/purchase \
  -H "Authorization: Bearer {valid_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "friendly_name": "My Number"
  }'

# Response should be:
{
  "success": true,
  "data": { /* purchase data */ },
  "message": "Phone number purchased successfully"
}
```

---

**Status:** ✅ Fixed and Ready for Testing  
**Date:** June 2, 2026  
**Version:** 1.0  

For any questions or issues, check the console logs and browser DevTools Network tab.
