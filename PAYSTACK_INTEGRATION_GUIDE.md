# Paystack Payment Integration - Implementation Guide

Complete integration of Paystack payments with your Next.js Femoj application, including wallet funding and phone number checkout.

---

## Overview

Your backend has implemented two payment endpoints:

1. **`POST /api/v1/payment/paystack-initiate-payment`** - Wallet Funding
   - User funds wallet with money
   - Wallet balance increases
   - Can use wallet balance for future purchases

2. **`POST /api/v1/payment/direct-checkout`** - Direct Purchase
   - User purchases specific items (VTU, airtime, bills, products, phone numbers)
   - Payment goes directly to purchase
   - Item is delivered/provisioned immediately

**Status:** ✅ All endpoints implemented  
**Date:** June 2, 2026

---

## Environment Configuration

### Step 1: Update `.env.local`

Add these variables to your `.env.local`:

```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://femojv1.test/api/v1

# Payment Endpoints (already at API base)
# Initialize Payment: POST /payment/paystack-initiate-payment
# Direct Checkout: POST /payment/direct-checkout
# Verify Payment: GET /payment/paystack-verify/{reference}

# Callback URLs (Frontend pages that Paystack redirects to)
NEXT_PUBLIC_PAYMENT_SUCCESS_URL=http://localhost:3000/payment/success
NEXT_PUBLIC_PAYMENT_FAILURE_URL=http://localhost:3000/payment/failure
NEXT_PUBLIC_PAYMENT_CANCELLED_URL=http://localhost:3000/payment/cancelled

# Debug Mode
NEXT_PUBLIC_DEBUG_MODE=false
```

### Step 2: Verify Files Are In Place

Check these files exist:
- ✅ `src/types/payment.ts` - Payment type definitions
- ✅ `src/services/paymentService.ts` - Payment service
- ✅ `src/hooks/usePayment.ts` - Payment React hook
- ✅ `src/components/payment/WalletFundingModal.tsx` - Wallet modal
- ✅ `app/wallet/page.tsx` - Wallet page
- ✅ `app/payment/success/page.tsx` - Success callback
- ✅ `app/payment/failure/page.tsx` - Failure callback
- ✅ `app/payment/cancelled/page.tsx` - Cancelled callback

---

## How Payment Flow Works

### Flow 1: Wallet Funding

```
1. User clicks "Fund Wallet" button
   ↓
2. Modal opens with amount options
   ↓
3. User enters amount (minimum ₦100)
   ↓
4. User clicks "Fund Wallet"
   ↓
5. Frontend calls: POST /payment/paystack-initiate-payment
   ├─ Request: { amount, purpose: "wallet_funding", channel: "card", metadata: {...} }
   └─ Response: { authorization_url, reference, transaction_id, ... }
   ↓
6. Frontend stores reference in sessionStorage
   ↓
7. Frontend redirects to Paystack: window.location.href = authorization_url
   ↓
8. User completes payment on Paystack
   ↓
9. Paystack redirects back to: /payment/success?reference=trx-ps-xxx
   ↓
10. Frontend verifies payment via GET /payment/paystack-verify/{reference}
    ├─ Backend verifies with Paystack
    └─ Backend auto-credits user wallet
    ↓
11. Success page shows confirmation
    ├─ Transaction details
    ├─ Amount
    └─ Auto-redirects to /wallet after 5 seconds
    ↓
12. ✅ Wallet balance increased!
```

### Flow 2: Direct Checkout (Phone Number Purchase)

```
1. User selects phone number on /dashboard/numbers/{code}
   ↓
2. User selects purchase type (temporary/permanent)
   ↓
3. User selects payment method:
   ├─ Option A: Use wallet balance (if has enough)
   └─ Option B: Pay with card (via Paystack)
   ↓
4. User clicks "Pay" button with card payment selected
   ↓
5. Frontend calls: POST /payment/direct-checkout
   ├─ Request: {
   │    amount: number,
   │    checkout_type: "phone_number",
   │    items: [{
   │      id: "phone_number_code",
   │      name: "Country Name - Phone Number",
   │      quantity: 1,
   │      price: amount
   │    }],
   │    description: "Phone number purchase",
   │    metadata: { phone_number, country, type, ... }
   │  }
   └─ Response: { authorization_url, reference, transaction_id, ... }
   ↓
6. Frontend stores reference in sessionStorage
   ↓
7. Frontend redirects to Paystack: window.location.href = authorization_url
   ↓
8. User completes payment on Paystack
   ↓
9. Paystack redirects to: /payment/success?reference=trx-ps-xxx
   ↓
10. Frontend verifies payment via GET /payment/paystack-verify/{reference}
    ├─ Backend verifies with Paystack
    ├─ Backend processes phone number purchase
    ├─ Backend provisions number to user account
    └─ Backend auto-credits wallet if using wallet payment
    ↓
11. Success page shows confirmation
    ↓
12. ✅ Phone number provisioned!
```

---

## Payment Service Usage

### Using Payment Service

The `PaymentService` class (at `src/services/paymentService.ts`) provides these methods:

#### 1. Initialize Wallet Funding

```typescript
import PaymentService from "@/services/paymentService";

const result = await PaymentService.initializeWalletFunding(
  5000, // amount in NGN
  {
    source: "wallet_funding", // custom metadata
  }
);

if (result.success) {
  // Store reference for later verification
  sessionStorage.setItem("payment_reference", result.data.reference);
  
  // Redirect to Paystack
  window.location.href = result.data.authorization_url;
} else {
  // Handle error
  console.error("Payment init failed:", result.message);
}
```

#### 2. Initialize Direct Checkout

```typescript
import PaymentService from "@/services/paymentService";

const result = await PaymentService.initializeDirectCheckout({
  amount: 15000,
  checkout_type: "phone_number",
  items: [{
    id: "phone_gb_001",
    name: "United Kingdom - +447700900123",
    quantity: 1,
    price: 15000,
  }],
  description: "Purchase UK virtual phone number",
  metadata: {
    phone_number: "+447700900123",
    country: "GB",
    type: "permanent",
  },
  channel: "card",
});

if (result.success) {
  sessionStorage.setItem("payment_reference", result.data.reference);
  window.location.href = result.data.authorization_url;
}
```

#### 3. Verify Payment (On Success Page)

```typescript
import PaymentService from "@/services/paymentService";

const params = new URLSearchParams(window.location.search);
const reference = params.get("reference");

const result = await PaymentService.verifyPayment(reference);

if (result.success) {
  console.log("Payment verified:", result.data);
  // Show success to user
} else {
  console.error("Verification failed:", result.message);
  // Show error to user
}
```

---

## React Hook Usage

### Using usePayment Hook

The `usePayment` hook (at `src/hooks/usePayment.ts`) simplifies payment handling:

```typescript
import { usePayment } from "@/hooks/usePayment";

export default function CheckoutPage() {
  const { 
    isLoading, 
    error, 
    initializePayment, 
    verifyPayment 
  } = usePayment();

  const handleFundWallet = async (amount: number) => {
    const result = await initializePayment(amount, {
      source: "wallet_funding",
    });

    if (result.success && result.data?.authorization_url) {
      window.location.href = result.data.authorization_url;
    }
  };

  return (
    <div>
      <button 
        onClick={() => handleFundWallet(5000)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Fund Wallet"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

## Phone Number Checkout Integration

### Current Flow (Updated)

The phone number checkout page at `/dashboard/numbers/[code]` now integrates with Paystack:

#### User Selects Payment Method

```
┌─────────────────────────────┐
│  Payment Method Selection   │
├─────────────────────────────┤
│                             │
│  ☐ Wallet Balance           │  ← Pay from wallet (quick)
│    (Instant, no redirect)   │
│                             │
│  ☐ Credit/Debit Card        │  ← Pay via Paystack
│    (Secure, redirects)      │
│                             │
└─────────────────────────────┘
```

#### Wallet Payment Flow (No Redirect)

```javascript
// Option 1: Pay from Wallet (no Paystack needed)
if (paymentMethod === "wallet") {
  const response = await phoneNumberService.purchasePhoneNumber({
    phone_number: selectedNumber,
    friendly_name: "...",
  });
  
  if (response.success) {
    // ✅ Number purchased, deducted from wallet
    router.push("/dashboard/numbers");
  }
}
```

#### Card Payment Flow (With Paystack)

```javascript
// Option 2: Pay with Card (via Paystack)
if (paymentMethod === "checkout") {
  const result = await PaymentService.initializeDirectCheckout({
    amount: purchaseDetails.price,
    checkout_type: "phone_number",
    items: [{
      id: `phone_${country.code}`,
      name: `${country.countryName} - ${selectedNumber}`,
      quantity: 1,
      price: purchaseDetails.price,
    }],
    metadata: {
      phone_number: selectedNumber,
      country_code: country.code,
      purchase_type: selectedType,
    },
  });

  if (result.success) {
    // ✅ Redirect to Paystack payment
    window.location.href = result.data.authorization_url;
  }
}
```

---

## Callback Pages (Payment Success/Failure)

### Success Page - `/payment/success`

Already implemented at `app/payment/success/page.tsx`

**What it does:**
1. Extracts `reference` from URL query params
2. Verifies payment with backend
3. Shows transaction details
4. Auto-redirects to dashboard after 5 seconds
5. Copy-to-clipboard for reference ID

**How to use:**
After Paystack payment completes, user is redirected here automatically.

### Failure Page - `/payment/failure`

Already implemented at `app/payment/failure/page.tsx`

**What it does:**
1. Shows failure reason (if provided)
2. Confirms account was NOT charged
3. Provides troubleshooting steps
4. Link to contact support

**How to use:**
If payment fails or is declined, user redirected here automatically.

### Cancelled Page - `/payment/cancelled`

Already implemented at `app/payment/cancelled/page.tsx`

**What it does:**
1. Reassures user they weren't charged
2. Explains payment was cancelled
3. Offers to retry

**How to use:**
If user clicks "Cancel" during Paystack checkout, redirected here.

---

## Wallet Page - `/wallet`

Already implemented at `app/wallet/page.tsx`

**Features:**
- ✅ Display current balance
- ✅ Hide/show balance toggle
- ✅ "Fund Wallet" button (opens modal)
- ✅ Quick stats (total credits, debits, transaction count)
- ✅ Recent transactions list
- ✅ Motion animations

**Integration:**
Opens `WalletFundingModal` component to initialize payment.

---

## Complete Usage Examples

### Example 1: Fund Wallet From Dashboard

```typescript
"use client";

import { useState } from "react";
import { WalletFundingModal } from "@/components/payment/WalletFundingModal";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowPaymentModal(true)}>
        💳 Fund Wallet
      </Button>

      <WalletFundingModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => setShowPaymentModal(false)}
      />
    </>
  );
}
```

### Example 2: Phone Number Purchase (Current Implementation)

At `/dashboard/numbers/[code]` - Already updated to handle both payment methods:

```typescript
const handlePayment = async (method: PaymentMethod) => {
  if (method === "wallet") {
    // Direct purchase from wallet (no payment service needed)
    const response = await phoneNumberService.purchasePhoneNumber({...});
  } else if (method === "checkout") {
    // Purchase via Paystack card payment
    const result = await PaymentService.initializeDirectCheckout({...});
    if (result.success) {
      window.location.href = result.data.authorization_url;
    }
  }
};
```

### Example 3: Direct Payment in Custom Component

```typescript
import { usePayment } from "@/hooks/usePayment";

export default function CustomPaymentComponent() {
  const { initializePayment, isLoading, error } = usePayment();

  const handlePay = async () => {
    const result = await initializePayment(
      2500,
      { custom_field: "custom_value" }
    );

    if (result.success) {
      window.location.href = result.data?.authorization_url;
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

---

## Testing Payment Integration

### Test Scenario 1: Wallet Funding

**Steps:**
1. Navigate to `/wallet`
2. Click "Fund Wallet"
3. Enter amount: `₦5,000`
4. Click "Fund Wallet" button
5. Should redirect to Paystack checkout

**On Paystack:**
- Use test card: `4084084084084081`
- CVC: `123`
- Expiry: Any future date (e.g., `05/25`)
- Click "Pay"

**Expected result:**
- ✅ Redirect to `/payment/success?reference=trx-ps-xxx`
- ✅ Show success message with transaction details
- ✅ Auto-redirect to wallet after 5 seconds
- ✅ Check wallet page - balance should increase by ₦5,000

**In Database:**
```sql
-- Check PaystackTransaction table
SELECT * FROM paystack_transactions 
WHERE reference = 'trx-ps-xxx';

-- Check Wallet balance
SELECT * FROM wallets 
WHERE user_id = YOUR_USER_ID;

-- Check WalletTransaction
SELECT * FROM wallet_transactions 
WHERE wallet_id = wallet.id 
ORDER BY created_at DESC;
```

### Test Scenario 2: Phone Number Purchase with Card

**Steps:**
1. Navigate to `/dashboard/numbers`
2. Click "Rent" on any country (e.g., UK)
3. Select a phone number
4. Choose "Credit/Debit Card"
5. Click "Pay" button
6. Should redirect to Paystack checkout

**On Paystack:**
- Use test card: `4084084084084081`
- CVC: `123`
- Expiry: Any future date
- Click "Pay"

**Expected result:**
- ✅ Redirect to `/payment/success?reference=trx-ps-xxx`
- ✅ Show success message
- ✅ Backend provisions phone number to user account
- ✅ Redirect to `/dashboard/numbers` after 5 seconds

### Test Scenario 3: Failed Payment

**Steps:**
1. Follow Test Scenario 1 or 2
2. Use test card: `4000000000000002` (declined card)
3. Click "Pay"

**Expected result:**
- ✅ Redirect to `/payment/failure?reason=Card%20declined`
- ✅ Show failure message with reason
- ✅ Confirm user was NOT charged
- ✅ Offer to retry

### Test Scenario 4: Cancel Payment

**Steps:**
1. Follow Test Scenario 1 or 2
2. On Paystack checkout, click "Cancel" button

**Expected result:**
- ✅ Redirect to `/payment/cancelled?reference=trx-ps-xxx`
- ✅ Reassure user they weren't charged
- ✅ Option to go back or retry

---

## Session Storage & Reference Tracking

The payment service uses `sessionStorage` to track payment references:

```typescript
// Storing reference after payment initialization
sessionStorage.setItem("payment_reference", response.data.reference);

// Later, on success page, can retrieve:
const reference = sessionStorage.getItem("payment_reference");

// Clear after verification
sessionStorage.removeItem("payment_reference");
```

**Why use sessionStorage?**
- Survives page refresh (unlike regular variables)
- Clears when tab/browser closes (security)
- Accessible across pages during payment flow
- No server storage needed

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Minimum amount is ₦100" | User entered less than ₦100 | Show validation message, require minimum ₦100 |
| "Payment initialization failed" | API error or network issue | Check internet connection, try again |
| "Unauthorized" / "Unauthenticated" | User not logged in or token expired | Redirect to login, ask user to log in again |
| "Invalid phone number" | Phone number doesn't exist or not available | Show error, let user select different number |
| Wallet not credited after payment | Webhook failed to process | Contact backend team, check webhook logs |
| Redirect to login after paying | Token expired during Paystack checkout | User should log back in, payment already processed |

### Handling Errors in Code

```typescript
try {
  const result = await PaymentService.initializeWalletFunding(amount);

  if (!result.success) {
    if (result.message?.includes("Minimum")) {
      setAmountError("Minimum amount is ₦100");
    } else if (result.message?.includes("Unauthorized")) {
      router.push("/auth/login");
    } else {
      setGeneralError(result.message);
    }
    return;
  }

  // Success - redirect
  window.location.href = result.data.authorization_url;
} catch (error) {
  console.error("Payment error:", error);
  setGeneralError("Payment processing failed. Please try again.");
}
```

---

## Production Deployment

### Before Going Live

**Checklist:**
- [ ] Backend endpoints tested with production database
- [ ] Paystack production keys configured
- [ ] Callback URLs updated to production domain
- [ ] SSL certificate installed on domain
- [ ] CORS configured for production domain
- [ ] Email notifications set up for failed payments
- [ ] Error tracking (Sentry) configured
- [ ] Webhook logs monitored in production
- [ ] Test full payment flow end-to-end
- [ ] Document payment troubleshooting guide for users

**Environment Variables (Production):**
```env
# Production API
NEXT_PUBLIC_API_BASE_URL=https://api.femoj.com/api/v1

# Production callback URLs
NEXT_PUBLIC_PAYMENT_SUCCESS_URL=https://femoj.com/payment/success
NEXT_PUBLIC_PAYMENT_FAILURE_URL=https://femoj.com/payment/failure
NEXT_PUBLIC_PAYMENT_CANCELLED_URL=https://femoj.com/payment/cancelled

# Debug disabled
NEXT_PUBLIC_DEBUG_MODE=false
```

### Monitoring in Production

**Key metrics to track:**
1. Payment success rate (target: >95%)
2. Failed payments (investigate reasons)
3. Average transaction time
4. Webhook delivery success rate
5. User retention after failed payment

**Logs to monitor:**
```bash
# Check payment errors
grep -i "payment" logs/laravel.log | grep error

# Check webhook processing
grep -i "webhook" logs/laravel.log

# Check wallet credits
grep -i "wallet" logs/laravel.log | grep credit
```

---

## Quick Reference

### API Endpoints

```bash
# Initialize Wallet Funding
POST /payment/paystack-initiate-payment
Body: { amount, purpose?, channel?, metadata? }
Auth: Bearer token (required)

# Initialize Direct Checkout
POST /payment/direct-checkout
Body: { amount, checkout_type, items[], description?, metadata?, channel? }
Auth: Bearer token (required)

# Verify Payment
GET /payment/paystack-verify/{reference}
Auth: Bearer token (required)

# Webhook (Backend only)
POST /payment/webhook/paystack
Body: Paystack payload
Auth: Signature verification
```

### Frontend Files

```
src/
├── services/
│   └── paymentService.ts ..................... Payment API calls
├── hooks/
│   └── usePayment.ts ......................... React payment hook
├── components/payment/
│   └── WalletFundingModal.tsx ............... Wallet funding modal
└── types/
    └── payment.ts ........................... TypeScript types

app/
├── wallet/
│   └── page.tsx ............................. Wallet dashboard
└── payment/
    ├── success/page.tsx ..................... Success callback
    ├── failure/page.tsx ..................... Failure callback
    └── cancelled/page.tsx ................... Cancelled callback
```

### Payment Methods

**Wallet Funding:**
- Endpoint: `/payment/paystack-initiate-payment`
- Hook: `usePayment().initializePayment(amount)`
- Component: `<WalletFundingModal />`

**Direct Checkout:**
- Endpoint: `/payment/direct-checkout`
- Hook: Use custom implementation with `directCheckout` method
- Component: Create similar to WalletFundingModal

**Phone Number Purchase:**
- Wallet method: `phoneNumberService.purchasePhoneNumber()`
- Card method: `PaymentService.initializeDirectCheckout()` → Paystack → verify

---

## Support & Debugging

### Enable Debug Logging

Add to `.env.local`:
```env
NEXT_PUBLIC_VERBOSE_API_LOGGING=true
NEXT_PUBLIC_DEBUG_MODE=true
```

Then check browser console for detailed logs:
```
[PaymentService] Initializing wallet funding...
[PaymentService] Response received: {...}
[usePayment] Payment successful, storing reference...
```

### Check Payment Status

In browser console:
```javascript
// Get stored reference
sessionStorage.getItem("payment_reference");

// Check localStorage for token (for auth check)
localStorage.getItem("femoj_access_token");

// Manually verify payment
const reference = "trx-ps-xxx";
fetch(`/api/v1/payment/paystack-verify/${reference}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("femoj_access_token")}`
  }
}).then(r => r.json()).then(console.log);
```

---

## Summary

✅ **All components created and ready**
✅ **Backend endpoints implemented**
✅ **Frontend services integrated**
✅ **Callback pages ready**
✅ **Phone checkout updated**

### Next Steps

1. **Test** - Run through test scenarios above
2. **Verify** - Check database records after payments
3. **Deploy** - Update environment variables for production
4. **Monitor** - Track payment metrics and logs

### Key Files to Remember

- Payment service: `src/services/paymentService.ts`
- Payment hook: `src/hooks/usePayment.ts`
- Wallet modal: `src/components/payment/WalletFundingModal.tsx`
- Success page: `app/payment/success/page.tsx`
- Wallet page: `app/wallet/page.tsx`
- Phone checkout: `app/dashboard/numbers/[code]/page.tsx` (updated to use PaymentService)

---

**Integration Complete!** 🎉

Your payment system is now fully integrated and ready to process:
- ✅ Wallet funding payments
- ✅ Phone number purchases
- ✅ Success/failure handling
- ✅ Payment verification

Start testing with the scenarios above!
