# Backend Implementation Guide - Phone Numbers Endpoints

Complete guide for implementing the phone numbers API endpoints for the Femoj platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Supported Countries](#supported-countries)
3. [API Endpoints](#api-endpoints)
4. [Response Format](#response-format)
5. [Implementation Examples](#implementation-examples)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Database Setup](#database-setup)

---

## Overview

The phone numbers feature provides:
- ✅ List of 62 Telnyx-supported countries
- ✅ Paginated country data (limit 1-100)
- ✅ Support for phone number operations (future)
- ✅ Public endpoints (no auth required for countries list)

---

## Supported Countries

Total: **62 countries** across all major regions

### By Region

**North America (3)**
- United States (US)
- Canada (CA)
- Mexico (MX)

**Central America (7)**
- Belize (BZ)
- Costa Rica (CR)
- El Salvador (SV)
- Guatemala (GT)
- Honduras (HN)
- Nicaragua (NI)
- Panama (PA)

**Caribbean (7)**
- Bahamas (BS)
- Barbados (BB)
- Cuba (CU)
- Dominican Republic (DO)
- Jamaica (JM)
- Puerto Rico (PR)
- Trinidad and Tobago (TT)

**South America (5)**
- Argentina (AR)
- Brazil (BR)
- Chile (CL)
- Colombia (CO)
- Ecuador (EC)
- Peru (PE)
- Uruguay (UY)

**Western Europe (10)**
- Austria (AT)
- Belgium (BE)
- France (FR)
- Germany (DE)
- Ireland (IE)
- Italy (IT)
- Netherlands (NL)
- United Kingdom (GB)
- Spain (ES)
- Switzerland (CH)

**Northern Europe (5)**
- Denmark (DK)
- Finland (FI)
- Iceland (IS)
- Norway (NO)
- Sweden (SE)

**Eastern Europe (4)**
- Czech Republic (CZ)
- Hungary (HU)
- Poland (PL)
- Romania (RO)

**Africa (4)**
- South Africa (ZA)
- Nigeria (NG)
- Ghana (GH)
- Kenya (KE)

**East Asia (3)**
- Japan (JP)
- South Korea (KR)
- Taiwan (TW)

**South Asia (3)**
- India (IN)
- Pakistan (PK)
- Bangladesh (BD)

**Southeast Asia (5)**
- Thailand (TH)
- Philippines (PH)
- Indonesia (ID)
- Malaysia (MY)
- Vietnam (VN)

**Oceania (2)**
- Australia (AU)
- New Zealand (NZ)

**Asia-Pacific (2)**
- Singapore (SG)
- Hong Kong (HK)

---

## API Endpoints

### Get Supported Countries

**Endpoint:** `GET /api/v1/phone-numbers/info/countries`

**Authentication:** Not required (public endpoint)

**Purpose:** Get paginated list of supported countries for phone number provisioning

#### Request

**URL:** `/api/v1/phone-numbers/info/countries`

**Method:** `GET`

**Query Parameters:**

| Parameter | Type | Required | Default | Max | Description | Example |
|-----------|------|----------|---------|-----|-------------|---------|
| limit | integer | No | 20 | 100 | Results per page | 20 |
| offset | integer | No | 0 | N/A | Number to skip (pagination) | 0 |

**Examples:**

```bash
# Get first 20 countries
GET /api/v1/phone-numbers/info/countries?limit=20&offset=0

# Get next batch (page 2)
GET /api/v1/phone-numbers/info/countries?limit=20&offset=20

# Get all 62 at once
GET /api/v1/phone-numbers/info/countries?limit=100&offset=0

# Without parameters (uses defaults)
GET /api/v1/phone-numbers/info/countries
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "code": "AT",
        "name": "Austria"
      },
      {
        "code": "AU",
        "name": "Australia"
      },
      {
        "code": "BD",
        "name": "Bangladesh"
      },
      {
        "code": "AR",
        "name": "Argentina"
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 62,
      "has_more": true
    }
  },
  "message": "Supported countries retrieved"
}
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | Always `true` for success |
| data.data | array | Yes | Array of country objects |
| data.data[].code | string | Yes | 2-letter ISO country code (e.g., "US", "NG") |
| data.data[].name | string | Yes | Country display name (e.g., "United States") |
| data.pagination | object | Yes | Pagination metadata |
| data.pagination.limit | integer | Yes | Requested page size (same as query param) |
| data.pagination.offset | integer | Yes | Requested offset (same as query param) |
| data.pagination.total | integer | Yes | Total countries available (always 62) |
| data.pagination.has_more | boolean | Yes | Whether more results are available |
| message | string | Yes | Success message |

### Error Response (422 Unprocessable Entity)

```json
{
  "success": false,
  "error": "Validation error",
  "message": "The limit may not be greater than 100.",
  "errors": {
    "limit": ["The limit may not be greater than 100."]
  }
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to retrieve countries"
}
```

---

## Implementation Examples

### Laravel/PHP

```php
// routes/api.php
Route::get('/phone-numbers/info/countries', [PhoneNumberController::class, 'getCountries']);

// app/Http/Controllers/PhoneNumberController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SupportedCountry;

class PhoneNumberController extends Controller
{
    public function getCountries(Request $request)
    {
        // Validate query parameters
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1|max:100',
            'offset' => 'nullable|integer|min:0',
        ]);

        $limit = $validated['limit'] ?? 20;
        $offset = $validated['offset'] ?? 0;

        // Get total count
        $total = SupportedCountry::count(); // Should be 62

        // Get paginated results
        $countries = SupportedCountry::orderBy('name')
            ->skip($offset)
            ->take($limit)
            ->get(['code', 'name']);

        // Calculate has_more
        $has_more = ($offset + $limit) < $total;

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $countries,
                'pagination' => [
                    'limit' => $limit,
                    'offset' => $offset,
                    'total' => $total,
                    'has_more' => $has_more,
                ]
            ],
            'message' => 'Supported countries retrieved'
        ]);
    }
}
```

### Node.js / Express

```javascript
// routes/phoneNumbers.js
const express = require('express');
const router = express.Router();
const { getCountries } = require('../controllers/phoneNumberController');

router.get('/info/countries', getCountries);

module.exports = router;

// controllers/phoneNumberController.js
const SupportedCountry = require('../models/SupportedCountry');

const SUPPORTED_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'AU', name: 'Australia' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'AR', name: 'Argentina' },
  // ... 58 more countries
];

exports.getCountries = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;

    // Validate
    if (limit < 1 || limit > 100) {
      return res.status(422).json({
        success: false,
        error: 'Validation error',
        message: 'The limit may not be greater than 100.',
        errors: {
          limit: ['The limit may not be greater than 100.']
        }
      });
    }

    if (offset < 0) {
      return res.status(422).json({
        success: false,
        error: 'Validation error',
        message: 'The offset must be greater than or equal to 0.',
        errors: {
          offset: ['The offset must be greater than or equal to 0.']
        }
      });
    }

    const total = SUPPORTED_COUNTRIES.length;
    const countries = SUPPORTED_COUNTRIES
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(offset, offset + limit);

    const has_more = (offset + limit) < total;

    return res.json({
      success: true,
      data: {
        data: countries,
        pagination: {
          limit,
          offset,
          total,
          has_more
        }
      },
      message: 'Supported countries retrieved'
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve countries'
    });
  }
};
```

### Python / Django

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('phone-numbers/info/countries', views.get_countries),
]

# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view

SUPPORTED_COUNTRIES = [
    {'code': 'AT', 'name': 'Austria'},
    {'code': 'AU', 'name': 'Australia'},
    {'code': 'BD', 'name': 'Bangladesh'},
    {'code': 'AR', 'name': 'Argentina'},
    # ... 58 more countries
]

@api_view(['GET'])
def get_countries(request):
    try:
        limit = request.GET.get('limit', 20)
        offset = request.GET.get('offset', 0)

        # Validate
        try:
            limit = int(limit)
            offset = int(offset)
        except (ValueError, TypeError):
            return JsonResponse({
                'success': False,
                'error': 'Validation error',
                'message': 'Invalid query parameters'
            }, status=422)

        if limit < 1 or limit > 100:
            return JsonResponse({
                'success': False,
                'error': 'Validation error',
                'message': 'The limit may not be greater than 100.',
                'errors': {
                    'limit': ['The limit may not be greater than 100.']
                }
            }, status=422)

        if offset < 0:
            return JsonResponse({
                'success': False,
                'error': 'Validation error',
                'message': 'The offset must be greater than or equal to 0.',
                'errors': {
                    'offset': ['The offset must be greater than or equal to 0.']
                }
            }, status=422)

        total = len(SUPPORTED_COUNTRIES)
        countries = sorted(SUPPORTED_COUNTRIES, key=lambda x: x['name'])[offset:offset + limit]
        has_more = (offset + limit) < total

        return JsonResponse({
            'success': True,
            'data': {
                'data': countries,
                'pagination': {
                    'limit': limit,
                    'offset': offset,
                    'total': total,
                    'has_more': has_more
                }
            },
            'message': 'Supported countries retrieved'
        })
    except Exception as e:
        print(f'Error fetching countries: {e}')
        return JsonResponse({
            'success': False,
            'error': 'Internal server error',
            'message': 'Failed to retrieve countries'
        }, status=500)
```

---

## Error Handling

### Validation Errors

**Invalid limit (too high)**
```bash
GET /api/v1/phone-numbers/info/countries?limit=150
```

**Response (422):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "The limit may not be greater than 100.",
  "errors": {
    "limit": ["The limit may not be greater than 100."]
  }
}
```

**Invalid offset (negative)**
```bash
GET /api/v1/phone-numbers/info/countries?offset=-5
```

**Response (422):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "The offset must be greater than or equal to 0.",
  "errors": {
    "offset": ["The offset must be greater than or equal to 0."]
  }
}
```

### Server Errors

**Database connection error**

**Response (500):**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to retrieve countries"
}
```

---

## Testing

### Manual Testing with cURL

```bash
# Test 1: Get first page (20 countries)
curl -X GET "http://localhost:8000/api/v1/phone-numbers/info/countries?limit=20&offset=0" \
  -H "Content-Type: application/json"

# Test 2: Get second page
curl -X GET "http://localhost:8000/api/v1/phone-numbers/info/countries?limit=20&offset=20" \
  -H "Content-Type: application/json"

# Test 3: Get all at once (100 limit)
curl -X GET "http://localhost:8000/api/v1/phone-numbers/info/countries?limit=100" \
  -H "Content-Type: application/json"

# Test 4: Invalid limit (should fail)
curl -X GET "http://localhost:8000/api/v1/phone-numbers/info/countries?limit=150" \
  -H "Content-Type: application/json"

# Test 5: Negative offset (should fail)
curl -X GET "http://localhost:8000/api/v1/phone-numbers/info/countries?offset=-5" \
  -H "Content-Type: application/json"
```

### Response Validation Checklist

- [ ] Response contains `success: true`
- [ ] Response data contains array in `data.data`
- [ ] Each country has `code` (2-letter) and `name`
- [ ] Pagination includes `limit`, `offset`, `total`, `has_more`
- [ ] `total` is always 62
- [ ] `has_more` is `true` when `offset + limit < total`
- [ ] Countries are sorted alphabetically by name
- [ ] Countries are properly paginated
- [ ] Invalid params return 422 error with error details

### Test Cases

| Test Case | Input | Expected |
|-----------|-------|----------|
| Default params | No params | 20 countries, offset=0 |
| Custom limit | limit=50 | 50 countries |
| Pagination page 2 | offset=20, limit=20 | Countries 21-40 |
| All at once | limit=100 | 62 countries, has_more=false |
| Invalid limit | limit=150 | 422 error |
| Invalid offset | offset=-5 | 422 error |

---

## Database Setup

### Sample SQL Setup

```sql
-- Create table
CREATE TABLE supported_countries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  dial_code VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_name (name)
);

-- Insert all 62 countries
INSERT INTO supported_countries (code, name, dial_code) VALUES
('AT', 'Austria', '43'),
('AU', 'Australia', '61'),
('BD', 'Bangladesh', '880'),
('AR', 'Argentina', '54'),
('BS', 'Bahamas', '1'),
('BB', 'Barbados', '1'),
('BE', 'Belgium', '32'),
('BZ', 'Belize', '501'),
('BR', 'Brazil', '55'),
('CA', 'Canada', '1'),
('CL', 'Chile', '56'),
('CO', 'Colombia', '57'),
('CR', 'Costa Rica', '506'),
('CU', 'Cuba', '53'),
('CZ', 'Czech Republic', '420'),
('DK', 'Denmark', '45'),
('DO', 'Dominican Republic', '1'),
('EC', 'Ecuador', '593'),
('SV', 'El Salvador', '503'),
('FI', 'Finland', '358'),
('FR', 'France', '33'),
('DE', 'Germany', '49'),
('GH', 'Ghana', '233'),
('GB', 'United Kingdom', '44'),
('GT', 'Guatemala', '502'),
('HK', 'Hong Kong', '852'),
('HN', 'Honduras', '504'),
('HU', 'Hungary', '36'),
('IS', 'Iceland', '354'),
('IN', 'India', '91'),
('ID', 'Indonesia', '62'),
('IE', 'Ireland', '353'),
('IT', 'Italy', '39'),
('JM', 'Jamaica', '1'),
('JP', 'Japan', '81'),
('KE', 'Kenya', '254'),
('KR', 'South Korea', '82'),
('MX', 'Mexico', '52'),
('MY', 'Malaysia', '60'),
('NL', 'Netherlands', '31'),
('NZ', 'New Zealand', '64'),
('NI', 'Nicaragua', '505'),
('NG', 'Nigeria', '234'),
('NO', 'Norway', '47'),
('PA', 'Panama', '507'),
('PK', 'Pakistan', '92'),
('PE', 'Peru', '51'),
('PH', 'Philippines', '63'),
('PL', 'Poland', '48'),
('PR', 'Puerto Rico', '1'),
('RO', 'Romania', '40'),
('SG', 'Singapore', '65'),
('ZA', 'South Africa', '27'),
('ES', 'Spain', '34'),
('SE', 'Sweden', '46'),
('CH', 'Switzerland', '41'),
('TW', 'Taiwan', '886'),
('TH', 'Thailand', '66'),
('TT', 'Trinidad and Tobago', '1'),
('UY', 'Uruguay', '598'),
('US', 'United States', '1'),
('VN', 'Vietnam', '84');

-- Verify
SELECT COUNT(*) as total_countries FROM supported_countries;
-- Should return: 62
```

---

## Implementation Checklist

### Before Going Live

- [ ] Database table created with all 62 countries
- [ ] Endpoint returns correct response format (JSON with success flag)
- [ ] Pagination works correctly (limit, offset, has_more)
- [ ] Validation rejects invalid parameters (limit > 100, offset < 0)
- [ ] Countries sorted alphabetically by name
- [ ] Error responses include error details
- [ ] Endpoint is public (no auth required)
- [ ] CORS configured (if needed for frontend)
- [ ] Rate limiting configured
- [ ] Logging enabled for debugging
- [ ] Tested with frontend integration
- [ ] Documentation complete

---

## Debugging

### Enable Query Logging

```php
// Laravel
DB::enableQueryLog();
// ... code ...
dd(DB::getQueryLog());
```

```javascript
// Node.js
const debug = require('debug')('app:*');
debug('Getting countries:', { limit, offset });
```

### Check Response Format

```bash
curl -X GET "http://localhost:8000/api/v1/phone-numbers/info/countries?limit=5" | jq .
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `[object object]` in frontend | Wrong response format (object instead of array) | Return `data.data` as array |
| Pagination not working | `has_more` not calculated correctly | Use `(offset + limit) < total` |
| Countries not sorted | Missing `ORDER BY name` | Add sort in query |
| 404 error | Route not registered | Check routing configuration |
| CORS error | Frontend origin not allowed | Configure CORS headers |

---

## Summary

✅ **Endpoint:** `GET /api/v1/phone-numbers/info/countries`  
✅ **Response:** Array of 62 countries with pagination  
✅ **Public:** No authentication required  
✅ **Validation:** Limit (1-100), Offset (0+)  
✅ **Format:** Success/error JSON responses  

**Total Countries:** 62  
**Data Fields:** code (2-letter ISO), name  
**Pagination:** limit, offset, total, has_more  

---

**Questions?** Review the examples above or check the Frontend Implementation Guide.
