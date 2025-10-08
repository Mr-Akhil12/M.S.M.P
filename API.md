# 📡 API Documentation - MSMP

> **Complete REST API reference for the Mobile Subscription Management Portal.**  
> Built with Express.js, JWT authentication, Socket.IO real-time events, and production-grade security.

<div align="center">

[![API Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)](https://m-s-m-p.onrender.com/health)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/Mr-Akhil12/M.S.M.P)
[![Docs](https://img.shields.io/badge/Docs-Complete-orange?style=for-the-badge)](API.md)

</div>

---

## 🌐 Base URLs

| Environment | Base URL | Status |
|-------------|----------|--------|
| **Production** | `https://m-s-m-p.onrender.com/api` | ✅ Live |
| **Local Dev** | `http://localhost:5000/api` | 🔧 Dev |

> **⚠️ Note:** Health check endpoint (`/health`) does **NOT** use the `/api` prefix.

---

## 🚀 Quick Start

### Test the API (No Auth Required)

```bash
# Health check
curl https://m-s-m-p.onrender.com/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2025-10-08T17:30:00.000Z",
#   "environment": "production"
# }
```

### Authentication Flow

```bash
# 1. Request OTP
curl -X POST https://m-s-m-p.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"msisdn":"27812345678"}'

# 2. Verify OTP (get token)
curl -X POST https://m-s-m-p.onrender.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"msisdn":"27812345678","otp":"123456"}'

# 3. Use token for authenticated requests
curl https://m-s-m-p.onrender.com/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🔐 Authentication

Most endpoints require JWT authentication via the `Authorization` header.

### Request Header Format

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifecycle

- **Issued:** On successful OTP verification
- **Expiry:** 24 hours after issuance
- **Renewal:** Re-authenticate with OTP
- **Scope:** User-specific (includes `userId` in payload)

### Token Payload

```json
{
  "id": "68e4eacd99b1bc084f4e4897",
  "msisdn": "27812345678",
  "iat": 1728408000,
  "exp": 1728494400
}
```

---

## 📚 Endpoints Overview

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| **🔑 Authentication** | 2 endpoints | ❌ Public |
| **📦 Services** | 2 endpoints | ✅ Required |
| **📝 Subscriptions** | 3 endpoints | ✅ Required |
| **💰 Transactions** | 1 endpoint | ✅ Required |
| **👨‍💼 Admin** | 3 endpoints | ⚠️ Admin only |

---

## 🔑 Authentication Endpoints

### 1. Send OTP

Request an OTP to be sent via SMS (or logged in test mode).

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "msisdn": "27812345678"
}
```

**Validation Rules:**
- ✅ Must be South African number (starts with `27`)
- ✅ Exactly 11 digits (27 + 9 digits)
- ✅ No spaces, dashes, or special characters

**Success Response (200 OK):**
```json
{
  "message": "OTP sent successfully"
}
```

> **💡 Test Mode:** OTP is logged to Render console, not sent via SMS (see [backend logs](https://dashboard.render.com/)).

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `400` | `Invalid MSISDN format` | Number doesn't match SA format |
| `429` | `Too many OTP requests, please try again later` | Rate limit: 3 requests per 15 min |
| `500` | `Failed to send OTP` | SMS service error (production mode) |

**Rate Limit:**
- **3 requests per 15 minutes** per IP address
- Resets automatically after window expires

---

### 2. Verify OTP

Verify OTP code and receive JWT token for authentication.

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "msisdn": "27812345678",
  "otp": "123456"
}
```

**Validation Rules:**
- ✅ OTP must be 6 digits
- ✅ OTP must be valid (not expired)
- ✅ Maximum 3 verification attempts
- ✅ OTP expires after 5 minutes

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "68e4eacd99b1bc084f4e4897",
    "msisdn": "27812345678",
    "createdAt": "2025-10-08T15:30:00.000Z"
  }
}
```

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `400` | `Invalid or expired OTP` | OTP incorrect or expired |
| `400` | `Maximum verification attempts exceeded` | 3+ failed attempts |
| `404` | `OTP not found. Please request a new one.` | No OTP requested for this number |
| `500` | `OTP verification failed` | Server error |

**OTP Lifecycle:**
1. **Generated:** When `/send-otp` is called
2. **Stored:** In-memory Map with 5-minute TTL
3. **Validated:** On `/verify-otp` request
4. **Deleted:** After successful verification or expiry

---

## 📦 Service Endpoints

### 3. Get All Services

Retrieve list of all available subscription services.

**Endpoint:** `GET /api/services`

**Authentication:** ✅ Required (JWT)

**Request Headers:**
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "68e06b840157e61e65942b14",
    "name": "Showmax Premium",
    "description": "Unlimited SA movies, series and live sport",
    "category": "entertainment",
    "price": 79.99,
    "billingCycle": "monthly",
    "imageUrl": "https://example.com/showmax.png",
    "isActive": true,
    "features": [
      "4K Ultra HD",
      "5 simultaneous streams",
      "Download for offline viewing"
    ],
    "createdAt": "2025-01-07T10:00:00.000Z",
    "updatedAt": "2025-01-07T10:00:00.000Z"
  },
  {
    "_id": "68e06b840157e61e65942b15",
    "name": "Netflix Standard",
    "description": "Stream unlimited movies and TV shows",
    "category": "entertainment",
    "price": 159.00,
    "billingCycle": "monthly",
    "imageUrl": "https://example.com/netflix.png",
    "isActive": true,
    "features": [
      "HD streaming",
      "2 simultaneous streams",
      "Cancel anytime"
    ],
    "createdAt": "2025-01-07T10:00:00.000Z",
    "updatedAt": "2025-01-07T10:00:00.000Z"
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | MongoDB ObjectId (unique) |
| `name` | String | Service display name |
| `description` | String | Short description (max 200 chars) |
| `category` | String | `entertainment`, `productivity`, `lifestyle` |
| `price` | Number | Monthly price in ZAR (decimal) |
| `billingCycle` | String | `monthly`, `weekly`, `daily` |
| `imageUrl` | String | Service logo/image URL |
| `isActive` | Boolean | Whether service is available for subscription |
| `features` | Array | List of service features |

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | `Unauthorized` | Missing or invalid JWT token |
| `500` | `Failed to fetch services` | Database error |

---

### 4. Get Service by ID

Retrieve detailed information about a specific service.

**Endpoint:** `GET /api/services/:serviceId`

**Authentication:** ✅ Required (JWT)

**URL Parameters:**
- `serviceId` - MongoDB ObjectId of the service

**Example Request:**
```bash
curl https://m-s-m-p.onrender.com/api/services/68e06b840157e61e65942b14 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "_id": "68e06b840157e61e65942b14",
  "name": "Showmax Premium",
  "description": "Unlimited SA movies, series and live sport",
  "category": "entertainment",
  "price": 79.99,
  "billingCycle": "monthly",
  "imageUrl": "https://example.com/showmax.png",
  "isActive": true,
  "features": [
    "4K Ultra HD",
    "5 simultaneous streams",
    "Download for offline viewing"
  ],
  "createdAt": "2025-01-07T10:00:00.000Z",
  "updatedAt": "2025-01-07T10:00:00.000Z"
}
```

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `404` | `Service not found` | Invalid serviceId |
| `401` | `Unauthorized` | Missing or invalid token |

---

## 📝 Subscription Endpoints

### 5. Get User Subscriptions

Retrieve all active subscriptions for the authenticated user.

**Endpoint:** `GET /api/subscriptions`

**Authentication:** ✅ Required (JWT)

**Example Request:**
```bash
curl https://m-s-m-p.onrender.com/api/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "68e4eacd99b1bc084f4e4898",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium",
      "price": 79.99,
      "imageUrl": "https://example.com/showmax.png"
    },
    "status": "active",
    "subscribedAt": "2025-10-08T15:30:00.000Z",
    "expiresAt": "2025-11-08T15:30:00.000Z",
    "createdAt": "2025-10-08T15:30:00.000Z",
    "updatedAt": "2025-10-08T15:30:00.000Z"
  }
]
```

**Subscription Statuses:**
- `active` - Currently active subscription
- `cancelled` - User cancelled (soft delete)
- `expired` - Billing cycle ended without renewal

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | `Unauthorized` | Missing or invalid token |
| `500` | `Failed to fetch subscriptions` | Database error |

---

### 6. Subscribe to Service

Create a new subscription to a service (charges user via telco provider).

**Endpoint:** `POST /api/subscriptions`

**Authentication:** ✅ Required (JWT)

**Request Body:**
```json
{
  "serviceId": "68e06b840157e61e65942b14"
}
```

**Example Request:**
```bash
curl -X POST https://m-s-m-p.onrender.com/api/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"68e06b840157e61e65942b14"}'
```

**Success Response (201 Created):**
```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "_id": "68e4eacd99b1bc084f4e4898",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": "68e06b840157e61e65942b14",
    "status": "active",
    "subscribedAt": "2025-10-08T15:30:00.000Z",
    "expiresAt": "2025-11-08T15:30:00.000Z"
  },
  "transaction": {
    "_id": "68e4eacd99b1bc084f4e4899",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": "68e06b840157e61e65942b14",
    "type": "subscription",
    "amount": 79.99,
    "status": "success",
    "description": "Showmax Premium subscription",
    "createdAt": "2025-10-08T15:30:00.000Z"
  },
  "telcoTransactionId": "vodacom_1728408000000_abc123xyz"
}
```

**What Happens on Subscription:**
1. ✅ Validates service exists and is active
2. ✅ Checks for duplicate active subscription
3. ✅ Charges user via telco provider (Vodacom/MTN/CellC)
4. ✅ Creates subscription record (MongoDB)
5. ✅ Creates transaction record (audit trail)
6. ✅ Broadcasts real-time event via Socket.IO
7. ✅ Returns subscription + transaction details

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `400` | `Already subscribed to this service` | Duplicate subscription attempt |
| `404` | `Service not found` | Invalid serviceId |
| `500` | `Subscription failed` | Telco provider error |
| `401` | `Unauthorized` | Missing or invalid token |

---

### 7. Cancel Subscription

Cancel an active subscription (creates refund transaction).

**Endpoint:** `DELETE /api/subscriptions/:serviceId`

**Authentication:** ✅ Required (JWT)

**URL Parameters:**
- `serviceId` - MongoDB ObjectId of the service to unsubscribe from

**Example Request:**
```bash
curl -X DELETE https://m-s-m-p.onrender.com/api/subscriptions/68e06b840157e61e65942b14 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "message": "Unsubscribed successfully",
  "transaction": {
    "_id": "68e4eacd99b1bc084f4e489a",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": "68e06b840157e61e65942b14",
    "type": "unsubscription",
    "amount": 79.99,
    "status": "success",
    "description": "Showmax Premium unsubscription",
    "createdAt": "2025-10-08T16:45:00.000Z"
  }
}
```

**What Happens on Cancellation:**
1. ✅ Finds active subscription for user + service
2. ✅ Updates subscription status to `cancelled` (soft delete)
3. ✅ Creates refund transaction (telco provider)
4. ✅ Broadcasts real-time cancellation event
5. ✅ Returns transaction details

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `404` | `Subscription not found` | No active subscription for this service |
| `403` | `Not authorized` | Attempting to cancel another user's subscription |
| `500` | `Failed to cancel subscription` | Database or telco error |

---

## 💰 Transaction Endpoints

### 8. Get User Transactions

Retrieve transaction history for the authenticated user.

**Endpoint:** `GET /api/transactions`

**Authentication:** ✅ Required (JWT)

**Example Request:**
```bash
curl https://m-s-m-p.onrender.com/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "68e4eacd99b1bc084f4e4899",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium",
      "imageUrl": "https://example.com/showmax.png"
    },
    "type": "subscription",
    "amount": 79.99,
    "status": "success",
    "description": "Showmax Premium subscription",
    "telcoTransactionId": "vodacom_1728408000000_abc123xyz",
    "createdAt": "2025-10-08T15:30:00.000Z"
  },
  {
    "_id": "68e4eacd99b1bc084f4e489a",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium",
      "imageUrl": "https://example.com/showmax.png"
    },
    "type": "unsubscription",
    "amount": 79.99,
    "status": "success",
    "description": "Showmax Premium unsubscription",
    "telcoTransactionId": "vodacom_1728411900000_xyz789abc",
    "createdAt": "2025-10-08T16:45:00.000Z"
  }
]
```

**Transaction Types:**
- `subscription` - New subscription created (charge)
- `unsubscription` - Subscription cancelled (refund)

**Transaction Statuses:**
- `success` - Payment/refund successful
- `pending` - Transaction processing
- `failed` - Payment/refund failed

**Sorting:**
- Transactions returned in reverse chronological order (newest first)

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | `Unauthorized` | Missing or invalid token |
| `500` | `Failed to fetch transactions` | Database error |

---

## 👨‍💼 Admin Endpoints

### 9. Verify Admin Password

Authenticate as admin to access admin dashboard.

**Endpoint:** `POST /api/admin/verify-password`

**Authentication:** ❌ Not required (password-based)

**Request Body:**
```json
{
  "password": "Password123!"
}
```

**Example Request:**
```bash
curl -X POST https://m-s-m-p.onrender.com/api/admin/verify-password \
  -H "Content-Type: application/json" \
  -d '{"password":"Password123!"}'
```

**Success Response (200 OK):**
```json
{
  "valid": true,
  "success": true
}
```

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `400` | `Password is required` | Missing password field |
| `401` | `Invalid password` | Incorrect password |
| `500` | `Verification failed` | Server error |

**Security Notes:**
- ⚠️ Production: Change `ADMIN_PASSWORD` from default `Password123!`
- 🔒 Use strong password (min 12 chars, mixed case, numbers, symbols)
- 🚫 No rate limiting on this endpoint (consider adding for production)

---

### 10. Get Platform Statistics

Retrieve platform-wide analytics and revenue data.

**Endpoint:** `GET /api/admin/stats`

**Authentication:** ⚠️ Admin verification recommended (not enforced)

**Example Request:**
```bash
curl https://m-s-m-p.onrender.com/api/admin/stats
```

**Success Response (200 OK):**
```json
{
  "totalUsers": 42,
  "totalActiveSubscriptions": 87,
  "totalRevenue": 6959.13,
  "serviceBreakdown": [
    {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium",
      "activeSubscriptions": 25,
      "revenue": 1999.75
    },
    {
      "_id": "68e06b840157e61e65942b15",
      "name": "Netflix Standard",
      "activeSubscriptions": 18,
      "revenue": 2862.00
    },
    {
      "_id": "68e06b840157e61e65942b16",
      "name": "Spotify Premium",
      "activeSubscriptions": 44,
      "revenue": 2097.38
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `totalUsers` | Number | Total registered users |
| `totalActiveSubscriptions` | Number | Total active subscriptions (all users) |
| `totalRevenue` | Number | Total monthly recurring revenue (MRR) in ZAR |
| `serviceBreakdown` | Array | Per-service stats |
| `serviceBreakdown[].name` | String | Service name |
| `serviceBreakdown[].activeSubscriptions` | Number | Active subscriptions for this service |
| `serviceBreakdown[].revenue` | Number | MRR for this service (rounded to 2 decimals) |

**Revenue Calculation:**
```javascript
// Per service
revenue = activeSubscriptions * servicePrice

// Total
totalRevenue = sum(all service revenues)
```

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `500` | `Failed to fetch stats` | Database aggregation error |

---

### 11. Get User Statistics

Retrieve detailed user-level statistics (subscriptions per user, revenue contribution).

**Endpoint:** `GET /api/admin/user-stats`

**Authentication:** ⚠️ Admin verification recommended (not enforced)

**Example Request:**
```bash
curl https://m-s-m-p.onrender.com/api/admin/user-stats
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "68e4eacd99b1bc084f4e4897",
    "msisdn": "27812345678",
    "subscriptions": ["Showmax Premium", "Netflix Standard"],
    "totalRevenue": 239.99
  },
  {
    "_id": "68e4eacd99b1bc084f4e4898",
    "msisdn": "27898765432",
    "subscriptions": ["Spotify Premium"],
    "totalRevenue": 47.67
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | User MongoDB ObjectId |
| `msisdn` | String | User phone number |
| `subscriptions` | Array | List of active service names |
| `totalRevenue` | Number | User's monthly contribution (rounded to 2 decimals) |

**Use Cases:**
- Identify high-value customers
- Analyze subscription patterns
- Segment users by revenue
- Target marketing campaigns

**Error Responses:**

| Code | Message | Cause |
|------|---------|-------|
| `500` | `Failed to fetch user stats` | Database aggregation error |

---

## 🔌 Real-time Updates (Socket.IO)

The API supports real-time updates via WebSocket connections using Socket.IO.

### Connection Setup

**Client-side (JavaScript):**
```javascript
import { io } from 'socket.io-client'

const socket = io('https://m-s-m-p.onrender.com', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  },
  transports: ['websocket', 'polling'], // WebSocket preferred, fallback to polling
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
})

// Connection events
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', reason)
})

socket.on('connect_error', (error) => {
  console.error('🔴 Connection error:', error.message)
})
```

### Authentication

**Socket.IO requires JWT authentication:**

```javascript
// ✅ Correct - token in auth handshake
const socket = io('https://m-s-m-p.onrender.com', {
  auth: {
    token: jwtToken
  }
})

// ❌ Wrong - will be rejected
const socket = io('https://m-s-m-p.onrender.com')
// Error: "Authentication error"
```

**Server validates token on connection:**
1. Extracts token from handshake
2. Verifies JWT signature
3. Decodes userId from payload
4. Joins user-specific room: `socket.join(userId)`

---

### Real-time Events

#### 📦 subscription:created

Emitted when a new subscription is created.

**Event Name:** `subscription:created`

**Payload:**
```json
{
  "subscription": {
    "_id": "68e4eacd99b1bc084f4e4898",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium",
      "price": 79.99
    },
    "status": "active",
    "subscribedAt": "2025-10-08T15:30:00.000Z"
  }
}
```

**Example Listener:**
```javascript
socket.on('subscription:created', (data) => {
  console.log('🎉 New subscription:', data.subscription)
  // Update UI: add to active subscriptions list
})
```

---

#### 🚫 subscription:cancelled

Emitted when a subscription is cancelled.

**Event Name:** `subscription:cancelled`

**Payload:**
```json
{
  "subscription": {
    "_id": "68e4eacd99b1bc084f4e4898",
    "serviceId": "68e06b840157e61e65942b14",
    "status": "cancelled",
    "cancelledAt": "2025-10-08T16:45:00.000Z"
  }
}
```

**Example Listener:**
```javascript
socket.on('subscription:cancelled', (data) => {
  console.log('🚫 Subscription cancelled:', data.subscription)
  // Update UI: remove from active subscriptions
})
```

---

#### 💰 transaction:created

Emitted when a new transaction is recorded.

**Event Name:** `transaction:created`

**Payload:**
```json
{
  "transaction": {
    "_id": "68e4eacd99b1bc084f4e4899",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium"
    },
    "type": "subscription",
    "amount": 79.99,
    "status": "success",
    "description": "Showmax Premium subscription",
    "createdAt": "2025-10-08T15:30:00.000Z"
  }
}
```

**Example Listener:**
```javascript
socket.on('transaction:created', (data) => {
  console.log('💰 New transaction:', data.transaction)
  // Update UI: add to transaction history (prepend to list)
})
```

---

### Room Architecture

**User-Specific Rooms:**
- Each authenticated user joins a room named after their `userId`
- Events are broadcast only to specific user rooms
- No cross-user event leakage

**Example Server-Side Broadcast:**
```javascript
// Emit to specific user
io.to(userId).emit('transaction:created', { transaction })

// Only that user receives the event
// Other connected users won't see it
```

**Why Rooms?**
- ✅ Privacy: User A can't see User B's events
- ✅ Efficiency: No need to filter events client-side
- ✅ Scalability: Easy to add admin rooms, broadcast rooms, etc.

---

### Connection Lifecycle

```
1. Client connects with JWT token
   ↓
2. Server validates token
   ↓
3. Server extracts userId
   ↓
4. Server joins user to room: socket.join(userId)
   ↓
5. Client receives 'connect' event
   ↓
6. Client listens for events
   ↓
7. Server emits events to user's room
   ↓
8. Client receives & updates UI
   ↓
9. Connection drops (network/browser close)
   ↓
10. Client auto-reconnects (with same token)
```

**Reconnection Logic:**
- Automatic: Socket.IO handles reconnection
- Exponential backoff: 1s, 2s, 4s, 8s, 16s
- Max attempts: 5 (configurable)
- Token re-validation on reconnection

---

## 📊 Response Format Standards

All API responses follow a consistent structure for easy parsing.

### Success Response

```json
{
  "message": "Operation successful",
  "data": { /* response payload */ }
}
```

**Or for lists:**
```json
{
  "message": "Subscriptions retrieved",
  "data": [ /* array of items */ ]
}
```

### Error Response

```json
{
  "message": "Human-readable error description",
  "error": "ERROR_CODE"
}
```

**Example:**
```json
{
  "message": "Service not found",
  "error": "SERVICE_NOT_FOUND"
}
```

---

## ⚠️ Error Codes Reference

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `INVALID_MSISDN` | 400 | Invalid phone number format | Enter valid SA number (27XXXXXXXXX) |
| `OTP_EXPIRED` | 400 | OTP has expired (5 min limit) | Request new OTP |
| `OTP_INVALID` | 400 | Incorrect OTP code | Check SMS and try again |
| `OTP_ATTEMPTS_EXCEEDED` | 400 | Too many wrong OTP attempts | Request new OTP |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait 15 minutes and retry |
| `SERVICE_NOT_FOUND` | 404 | Service doesn't exist | Check service ID |
| `SUBSCRIPTION_NOT_FOUND` | 404 | No active subscription | Subscribe first |
| `ALREADY_SUBSCRIBED` | 400 | Duplicate subscription | Unsubscribe first if you want to re-subscribe |
| `UNAUTHORIZED` | 401 | Missing/invalid JWT token | Login again (verify OTP) |
| `FORBIDDEN` | 403 | Insufficient permissions | Admin access required |
| `VALIDATION_ERROR` | 400 | Invalid request data | Check request format |
| `INTERNAL_ERROR` | 500 | Server error | Try again later or contact support |

---

## 🚦 Rate Limiting

Rate limits protect the API from abuse and ensure fair usage.

### Limits by Endpoint

| Endpoint | Limit | Window | Status Code |
|----------|-------|--------|-------------|
| `POST /auth/send-otp` | **3 requests** | 15 minutes | 429 |
| `POST /auth/verify-otp` | **10 requests** | 15 minutes | 429 |
| All other endpoints | **100 requests** | 15 minutes | 429 |

### Rate Limit Headers

Responses include rate limit info:

```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1728409800
```

**Interpretation:**
- `Limit`: Max requests allowed in window
- `Remaining`: Requests left in current window
- `Reset`: Unix timestamp when limit resets

### Rate Limit Response

When exceeded:

```json
{
  "message": "Too many OTP requests, please try again later.",
  "error": "RATE_LIMIT_EXCEEDED"
}
```

**HTTP Status:** `429 Too Many Requests`

---

## 🧪 Testing the API

### Health Check (No Auth)

```bash
curl https://m-s-m-p.onrender.com/health
```

**Expected:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-08T17:30:00.000Z",
  "environment": "production",
  "allowedOrigins": [
    "http://localhost:5173",
    "https://m-s-m-p.vercel.app"
  ]
}
```

---

### Full Authentication Flow (Postman/cURL)

**Step 1: Request OTP**
```bash
curl -X POST https://m-s-m-p.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"msisdn":"27812345678"}'
```

**Step 2: Check Render Logs for OTP**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click your service → "Logs"
3. Look for boxed OTP output

**Step 3: Verify OTP**
```bash
curl -X POST https://m-s-m-p.onrender.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"msisdn":"27812345678","otp":"123456"}'
```

**Step 4: Use Token**
```bash
# Save token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get services
curl https://m-s-m-p.onrender.com/api/services \
  -H "Authorization: Bearer $TOKEN"

# Subscribe
curl -X POST https://m-s-m-p.onrender.com/api/subscriptions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"68e06b840157e61e65942b14"}'
```

---

### Postman Collection (Import Ready)

Create `MSMP.postman_collection.json`:

```json
{
  "info": {
    "name": "MSMP API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://m-s-m-p.onrender.com/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Send OTP",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/send-otp",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"msisdn\":\"27812345678\"}"
            }
          }
        },
        {
          "name": "Verify OTP",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/verify-otp",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"msisdn\":\"27812345678\",\"otp\":\"123456\"}"
            }
          }
        }
      ]
    }
  ]
}
```

**Import:** Postman → Import → Paste JSON

---

## 🔧 Environment Variables

Backend configuration via environment variables.

### Required Variables

| Variable | Description | Example | Security |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` | 🔒 Secret |
| `JWT_SECRET` | JWT signing key (64+ chars) | `0e935731a2da39d0...` | 🔒 Secret |
| `CLIENT_URL` | Frontend URL for CORS | `https://m-s-m-p.vercel.app` | ✅ Public |
| `ADMIN_PASSWORD` | Admin dashboard password | `SecurePassword123!` | 🔒 Secret |

### Optional Variables

| Variable | Description | Default | Production |
|----------|-------------|---------|------------|
| `PORT` | Server port | `5000` | Set by Render |
| `NODE_ENV` | Environment mode | `development` | `production` |
| `TELCO_PROVIDER` | Default telco | `Vodacom` | `Vodacom` |
| `SMS_ENABLED` | Enable real SMS | `false` | `false` (test mode) |
| `EASYSENDSMS_API_KEY` | SMS service API key | - | Required if `SMS_ENABLED=true` |
| `EASYSENDSMS_SENDER_ID` | SMS sender name | `MSMP` | Your brand name |

### Security Best Practices

- ✅ Never commit `.env` to Git (use .gitignore)
- ✅ Use 64+ character `JWT_SECRET` (generate with crypto)
- ✅ Change default `ADMIN_PASSWORD` in production
- ✅ Rotate secrets every 90 days
- ✅ Use environment variable management (Render/Vercel dashboards)

---

## 📚 Additional Resources

### Documentation

- **README.md** - Project overview, setup, tech stack
- **DEPLOYMENT.md** - Step-by-step deployment guide
- **API.md** - This file (complete API reference)

### Live URLs

- **Frontend:** [https://m-s-m-p.vercel.app](https://m-s-m-p.vercel.app)
- **Backend:** [https://m-s-m-p.onrender.com](https://m-s-m-p.onrender.com)
- **Health Check:** [https://m-s-m-p.onrender.com/health](https://m-s-m-p.onrender.com/health)
- **GitHub:** [https://github.com/Mr-Akhil12/M.S.M.P](https://github.com/Mr-Akhil12/M.S.M.P)

### Support

- 📧 **Email:** [pillayakhil2@gmail.com](mailto:pillayakhil2@gmail.com)
- 📱 **Phone:** 067 865 9396
- 🐙 **GitHub Issues:** [Report a bug](https://github.com/Mr-Akhil12/M.S.M.P/issues)

---

## 📝 Changelog

### Version 1.0.0 (October 2025)

**Initial Release:**
- ✅ JWT authentication with OTP
- ✅ Service management (list, details)
- ✅ Subscription lifecycle (subscribe, cancel)
- ✅ Transaction history
- ✅ Admin analytics
- ✅ Real-time updates via Socket.IO
- ✅ Rate limiting on all endpoints
- ✅ Production deployment (Vercel + Render)

---

<div align="center">

**API Documentation Complete! 📡**

---

**Built with ❤️ by [AkhilDevs](https://github.com/Mr-Akhil12)**

*Production-ready RESTful API with WebSocket support* ⚡

