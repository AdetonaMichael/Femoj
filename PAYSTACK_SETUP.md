# Paystack Payment Integration Setup Guide

Complete setup guide for the Paystack payment system integrated into your Next.js Femoj application.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [File Structure](#file-structure)
3. [Implementation Guide](#implementation-guide)
4. [API Integration](#api-integration)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Environment Setup

### Step 1: Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

### Step 2: Update `.env.local`

```env
# Development
NEXT_PUBLIC_API_BASE_URL=https://femojv1.test/api/v1
NEXT_PUBLIC_PAYMENT_SUCCESS_URL=http://localhost:3000/payment/success
NEXT_PUBLIC_PAYMENT_FAILURE_URL=http://localhost:3000/payment/failure
NEXT_PUBLIC_PAYMENT_CANCELLED_URL=http://localhost:3000/payment/cancelled

# Get your Paystack Public Key from: https://dashboard.paystack.com/settings/developer
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key

# Debug mode (disable in production)
NEXT_PUBLIC_DEBUG_MODE=true
```

### Step 3: Verify Environment Variables

All payment variables use `NEXT_PUBLIC_` prefix to be accessible from the frontend.

---

## File Structure

```
Project Root
├── src/
│   ├── types/
│   │   ├── index.ts (updated with payment type exports)
│   │   └── payment.ts (NEW - All payment TypeScript types)
│   │
│   ├── services/
│   │   └── paymentService.ts (NEW - Payment API service)
│   │
│   ├── hooks/
│   │   └── usePayment.ts (NEW - Payment React hook)
│   │
│   └── components/
│       └── payment/
│           └── WalletFundingModal.tsx (NEW - Wallet funding modal)
│
├── app/
│   ├── wallet/
│   │   └── page.tsx (NEW - Wallet dashboard page)
│   │
│   └── payment/
│       ├── success/
│       │   └── page.tsx (NEW - Payment success callback)
│       ├── failure/
│       │   └── page.tsx (NEW - Payment failure callback)
│       └── cancelled/
│           └── page.tsx (NEW - Payment cancelled callback)
│
├── .env.example (NEW - Environment variables template)
└── .env.local (YOUR LOCAL CONFIG - DO NOT COMMIT)
```

---

## Implementation Guide

### Step 1: Import Payment Types

```typescript
import type {
  PaymentInitResponse,
  PaymentVerifyResponse,
  CheckoutItem,
  DirectCheckoutRequest,
} from "@/types/payment";
```

### Step 2: Use Payment Service

```typescript
import PaymentService from "@/services/paymentService";

// Initialize wallet funding
const result = await PaymentService.initializeWalletFunding(5000, {
  source: "wallet_funding",
});

if (result.success) {
  window.location.href = result.data?.authorization_url;
}
```

### Step 3: Use Payment Hook

```typescript
import { usePayment } from "@/hooks/usePayment";

export default function MyComponent() {
  const { isLoading, error, initializePayment, verifyPayment } = usePayment();

  const handlePayment = async () => {
    const result = await initializePayment(1000);
    if (result.success) {
      window.location.href = result.data?.authorization_url;
    }
  };

  return (
    <button onClick={handlePayment} disabled={isLoading}>
      Fund Wallet
    </button>
  );
}
```

### Step 4: Use Wallet Funding Modal

```typescript
"use client";

import { useState } from "react";
import { WalletFundingModal } from "@/components/payment/WalletFundingModal";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Fund Wallet
      </Button>

      <WalletFundingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
}
```

---

## API Integration

### Backend Endpoints Required

#### 1. Wallet Funding Initialization

**Endpoint:** `POST /api/v1/payment/paystack-initiate-payment`

**Request:**
```json
{
  "amount": 5000,
  "purpose": "wallet_funding",
  "channel": "card",
  "metadata": {
    "transaction_type": "wallet_funding",
    "timestamp": "2026-06-02T10:30:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "reference": "trx-ps-1234567890",
    "transaction_id": 42,
    "amount": 5000,
    "access_code": "access_code_here",
    "public_key": "pk_live_*****"
  },
  "message": "Transaction initialized successfully"
}
```

#### 2. Payment Verification

**Endpoint:** `GET /api/v1/payment/paystack-verify/{reference}`

**Response:**
```json
{
  "success": true,
  "data": {
    "reference": "trx-ps-1234567890",
    "amount": 5000,
    "status": "success",
    "paid_at": "2026-06-02T12:30:45.000000Z"
  }
}
```

#### 3. Direct Checkout (Optional for later)

**Endpoint:** `POST /api/v1/payment/direct-checkout`

**Request:**
```json
{
  "amount": 1500,
  "checkout_type": "airtime",
  "items": [
    {
      "id": "mtn_airtime_001",
      "name": "MTN Airtime",
      "quantity": 1,
      "price": 1500
    }
  ]
}
```

---

## Usage Examples

### Example 1: Wallet Funding Modal

```typescript
"use client";

import { useState } from "react";
import { WalletFundingModal } from "@/components/payment/WalletFundingModal";
import { Button } from "@/components/ui/button";

export default function WalletSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} size="lg">
        💳 Fund Wallet
      </Button>

      <WalletFundingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
```

### Example 2: Direct Payment with Hook

```typescript
"use client";

import { usePayment } from "@/hooks/usePayment";
import { Button } from "@/components/ui/button";

export default function PhoneNumberCheckout() {
  const { isLoading, error, initializePayment } = usePayment();

  const handleBuyNumber = async () => {
    const result = await initializePayment(15000, {
      phone_number: "+2348012345678",
      country: "UK",
    });

    if (result.success && result.data?.authorization_url) {
      // Redirect to Paystack
      window.location.href = result.data.authorization_url;
    }
  };

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}
      <Button
        onClick={handleBuyNumber}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Buy for ₦15,000"}
      </Button>
    </div>
  );
}
```

### Example 3: Wallet Page Integration

Already implemented in `app/wallet/page.tsx` - Shows:
- Current wallet balance
- Fund wallet button
- Recent transactions
- Transaction statistics

---

## Testing

### Local Testing Steps

1. **Open Wallet Page**
   ```
   http://localhost:3000/wallet
   ```

2. **Click "Fund Wallet"**
   - Modal opens with preset amounts
   - Select amount (minimum ₦100)

3. **Complete Test Payment**
   - Enter amount and click "Fund Wallet"
   - Redirected to Paystack checkout
   - Use test card: `4084084084084081`
   - CVC: `123` (any future expiry date)

4. **Verify Success**
   - Redirected to `/payment/success`
   - Shows "Payment Successful" message
   - Auto-redirects to dashboard after 5 seconds

5. **Test Failure**
   - Use declined card: `4000000000000002`
   - Redirected to `/payment/failure`
   - Shows error details

### Test Cards

| Card Number | Status | Use For |
|---|---|---|
| 4084084084084081 | SUCCESS | Successful payments |
| 4000000000000002 | DECLINED | Failed payments |
| 4000000000000010 | INSUFFICIENT FUNDS | Testing balance checks |

---

## Production Deployment

### Pre-Production Checklist

- [ ] Update Paystack keys to production in `.env.local`
- [ ] Test with production Paystack account
- [ ] Configure callback URLs in Paystack Dashboard:
  - Success: `https://femoj.com/payment/success`
  - Failure: `https://femoj.com/payment/failure`
  - Cancelled: `https://femoj.com/payment/cancelled`
- [ ] Enable SSL/HTTPS on production domain
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Test webhook endpoint accessibility
- [ ] Configure CORS for your domain
- [ ] Set up monitoring for payment failures

### Production Environment Variables

```env
# Production (femoj.com)
NEXT_PUBLIC_API_BASE_URL=https://api.femoj.com/api/v1
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_production_key
NEXT_PUBLIC_PAYMENT_SUCCESS_URL=https://femoj.com/payment/success
NEXT_PUBLIC_PAYMENT_FAILURE_URL=https://femoj.com/payment/failure
NEXT_PUBLIC_PAYMENT_CANCELLED_URL=https://femoj.com/payment/cancelled
NEXT_PUBLIC_DEBUG_MODE=false
```

---

## Troubleshooting

### Issue: "Payment initialization failed"

**Cause:** API not responding or authentication failed

**Solution:**
1. Check API base URL in `.env.local`
2. Verify authentication token is valid
3. Check network tab for API request details
4. Verify backend is running

### Issue: "Callback URLs not configured"

**Cause:** Paystack doesn't know where to redirect after payment

**Solution:**
1. Log in to Paystack Dashboard
2. Go to Settings → Webhook
3. Configure callback URLs:
   - Success: `https://femoj.com/payment/success`
   - Failure: `https://femoj.com/payment/failure`

### Issue: "Wallet not credited after payment"

**Cause:** Webhook not received or verification failed

**Solution:**
1. Check Paystack Webhook logs: Dashboard → Webhooks
2. Verify backend webhook endpoint is publicly accessible
3. Check firewall/CORS settings
4. Verify webhook secret key in backend

### Issue: TypeScript errors with payment types

**Cause:** Payment types not properly imported

**Solution:**
```typescript
// Correct import
import type { PaymentInitResponse } from "@/types/payment";
// or from main types
import type { PaymentInitResponse } from "@/types";
```

### Issue: ".env.local not being read"

**Cause:** Environment variables not prefixed with `NEXT_PUBLIC_`

**Solution:**
- All payment variables MUST use `NEXT_PUBLIC_` prefix to be accessible in the browser
- Restart dev server after changing `.env.local`
- Clear browser cache

---

## Callback URL Setup in Paystack

### Step 1: Go to Paystack Settings

1. Login to [Paystack Dashboard](https://dashboard.paystack.com)
2. Click "Settings" (gear icon)
3. Select "Webhook"

### Step 2: Add Callback URLs

- **Success URL**: `https://femoj.com/payment/success`
- **Failure URL**: `https://femoj.com/payment/failure`

### Step 3: Save

The backend will automatically:
1. Receive webhook from Paystack
2. Verify payment
3. Credit user's wallet
4. Create transaction record

---

## Support & Documentation

- **Paystack Docs:** https://paystack.com/docs
- **Paystack Dashboard:** https://dashboard.paystack.com
- **API Client Reference:** `src/lib/api-client.ts`
- **Payment Service:** `src/services/paymentService.ts`
- **Payment Hook:** `src/hooks/usePayment.ts`

---

## Key Features

✅ **Complete TypeScript Support** - Fully typed payment operations  
✅ **Error Handling** - Comprehensive error management  
✅ **Validation** - Input validation before API calls  
✅ **Session Storage** - Payment reference persistence  
✅ **Auto-Redirect** - Success/failure automatic redirects  
✅ **Responsive UI** - Mobile-friendly payment flow  
✅ **Security** - HTTPS-only, Bearer token auth  
✅ **Fallbacks** - Default values for missing data  

---

Last Updated: June 2, 2026
