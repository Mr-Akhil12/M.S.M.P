# 📡 API Documentation - MSMP

Complete API reference for the Mobile Subscription Management Portal backend.

---

## 🔗 Base URL

```
https://your-backend.onrender.com
```

---

## 🔐 Authentication

All API endpoints (except `/auth/send-otp` and `/auth/verify-otp`) require authentication.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

---

## 📱 Authentication Endpoints

### Send OTP

**POST** `/auth/send-otp`

Send OTP to user's mobile number for authentication.

**Request Body:**

```json
{
  "msisdn": "27812345678"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "msisdn": "27812345678",
    "expiresIn": 300
  }
}
```

**Error Responses:**

- `400`: Invalid MSISDN format
- `429`: Rate limit exceeded
- `500`: SMS service error

### Verify OTP

**POST** `/auth/verify-otp`

Verify OTP and return JWT token.

**Request Body:**

```json
{
  "msisdn": "27812345678",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "msisdn": "27812345678",
      "telco": "Vodacom",
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

- `400`: Invalid OTP or expired
- `404`: User not found
- `429`: Too many attempts

---

## 📊 Services Endpoints

### Get All Services

**GET** `/services`

Retrieve all available services.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "service_id",
      "name": "Netflix Premium",
      "description": "Premium streaming service",
      "price": 299,
      "currency": "ZAR",
      "category": "Entertainment",
      "active": true,
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  ]
}
```

### Get Service by ID

**GET** `/services/:id`

Retrieve specific service details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "service_id",
    "name": "Netflix Premium",
    "description": "Premium streaming service",
    "price": 299,
    "currency": "ZAR",
    "category": "Entertainment",
    "active": true,
    "createdAt": "2025-01-07T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Service not found

---

## 📋 Subscriptions Endpoints

### Get User Subscriptions

**GET** `/subscriptions`

Get all subscriptions for authenticated user.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "sub_id",
      "service": {
        "id": "service_id",
        "name": "Netflix Premium",
        "price": 299,
        "currency": "ZAR"
      },
      "status": "active",
      "startDate": "2025-01-07T10:00:00.000Z",
      "endDate": "2025-02-07T10:00:00.000Z",
      "autoRenew": true,
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  ]
}
```

### Subscribe to Service

**POST** `/subscriptions`

Subscribe user to a service.

**Request Body:**

```json
{
  "serviceId": "service_id",
  "autoRenew": true
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "id": "sub_id",
    "service": {
      "id": "service_id",
      "name": "Netflix Premium",
      "price": 299,
      "currency": "ZAR"
    },
    "status": "active",
    "startDate": "2025-01-07T10:00:00.000Z",
    "endDate": "2025-02-07T10:00:00.000Z",
    "autoRenew": true,
    "createdAt": "2025-01-07T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Already subscribed or insufficient balance
- `404`: Service not found

### Unsubscribe from Service

**DELETE** `/subscriptions/:id`

Cancel user's subscription.

**Response (200):**

```json
{
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

**Error Responses:**

- `404`: Subscription not found
- `403`: Not authorized to cancel this subscription

### Update Subscription

**PUT** `/subscriptions/:id`

Update subscription settings.

**Request Body:**

```json
{
  "autoRenew": false
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "id": "sub_id",
    "autoRenew": false
  }
}
```

---

## 💳 Transactions Endpoints

### Get User Transactions

**GET** `/transactions`

Get transaction history for authenticated user.

**Query Parameters:**

- `limit` (optional): Number of transactions (default: 20, max: 100)
- `offset` (optional): Skip transactions (default: 0)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "txn_id",
      "type": "subscription",
      "amount": 299,
      "currency": "ZAR",
      "status": "completed",
      "description": "Netflix Premium subscription",
      "service": {
        "id": "service_id",
        "name": "Netflix Premium"
      },
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get Transaction by ID

**GET** `/transactions/:id`

Get specific transaction details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "txn_id",
    "type": "subscription",
    "amount": 299,
    "currency": "ZAR",
    "status": "completed",
    "description": "Netflix Premium subscription",
    "service": {
      "id": "service_id",
      "name": "Netflix Premium"
    },
    "createdAt": "2025-01-07T10:00:00.000Z"
  }
}
```

---

## 👨‍� Admin Endpoints

_Requires admin authentication_

### Get Dashboard Stats

**GET** `/admin/stats`

Get system statistics.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalSubscriptions": 890,
    "totalRevenue": 267100,
    "activeSubscriptions": 756,
    "recentTransactions": 45,
    "topServices": [
      {
        "name": "Netflix Premium",
        "subscriptions": 234
      }
    ]
  }
}
```

### Get All Users

**GET** `/admin/users`

Get all registered users.

**Query Parameters:**

- `limit` (optional): Number of users (default: 20)
- `offset` (optional): Skip users (default: 0)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "msisdn": "27812345678",
      "telco": "Vodacom",
      "subscriptionsCount": 3,
      "totalSpent": 897,
      "createdAt": "2025-01-07T10:00:00.000Z",
      "lastLogin": "2025-01-07T15:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get All Subscriptions

**GET** `/admin/subscriptions`

Get all subscriptions in system.

**Query Parameters:**

- `status` (optional): Filter by status (`active`, `cancelled`, `expired`)
- `limit` (optional): Number of subscriptions (default: 20)
- `offset` (optional): Skip subscriptions (default: 0)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "sub_id",
      "user": {
        "id": "user_id",
        "msisdn": "27812345678"
      },
      "service": {
        "id": "service_id",
        "name": "Netflix Premium",
        "price": 299
      },
      "status": "active",
      "startDate": "2025-01-07T10:00:00.000Z",
      "endDate": "2025-02-07T10:00:00.000Z",
      "autoRenew": true,
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 890,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get All Transactions

**GET** `/admin/transactions`

Get all transactions in system.

**Query Parameters:**

- `type` (optional): Filter by type (`subscription`, `refund`)
- `status` (optional): Filter by status (`pending`, `completed`, `failed`)
- `limit` (optional): Number of transactions (default: 20)
- `offset` (optional): Skip transactions (default: 0)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "txn_id",
      "user": {
        "id": "user_id",
        "msisdn": "27812345678"
      },
      "type": "subscription",
      "amount": 299,
      "currency": "ZAR",
      "status": "completed",
      "description": "Netflix Premium subscription",
      "service": {
        "id": "service_id",
        "name": "Netflix Premium"
      },
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 2340,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Admin Login

**POST** `/admin/login`

Authenticate admin user.

**Request Body:**

```json
{
  "password": "YourSecurePassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "admin_id",
      "role": "admin",
      "createdAt": "2025-01-07T10:00:00.000Z"
    }
  }
}
```

---

## 🔌 WebSocket Events

The API supports real-time updates via Socket.IO.

### Connection

```javascript
import io from "socket.io-client";

const socket = io("https://your-backend.onrender.com", {
  auth: {
    token: "your_jwt_token",
  },
});
```

### Events

#### User Events

**subscription:created**

```json
{
  "subscription": {
    "id": "sub_id",
    "service": {
      "name": "Netflix Premium",
      "price": 299
    },
    "status": "active"
  }
}
```

**subscription:cancelled**

```json
{
  "subscription": {
    "id": "sub_id",
    "service": {
      "name": "Netflix Premium"
    }
  }
}
```

**transaction:created**

```json
{
  "transaction": {
    "id": "txn_id",
    "type": "subscription",
    "amount": 299,
    "description": "Netflix Premium subscription"
  }
}
```

#### Admin Events

**user:registered**

```json
{
  "user": {
    "id": "user_id",
    "msisdn": "27812345678",
    "telco": "Vodacom"
  }
}
```

**subscription:updated**

```json
{
  "subscription": {
    "id": "sub_id",
    "status": "cancelled"
  }
}
```

---

## 📊 Response Format

All API responses follow this structure:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // Only for list endpoints
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": { ... } // Optional additional error info
}
```

---

## ⚠️ Error Codes

| Code                     | Description                          |
| ------------------------ | ------------------------------------ |
| `INVALID_MSISDN`         | Invalid mobile number format         |
| `OTP_EXPIRED`            | OTP has expired                      |
| `OTP_INVALID`            | Incorrect OTP entered                |
| `RATE_LIMIT_EXCEEDED`    | Too many requests                    |
| `INSUFFICIENT_BALANCE`   | Not enough balance for subscription  |
| `SERVICE_NOT_FOUND`      | Requested service doesn't exist      |
| `SUBSCRIPTION_NOT_FOUND` | Requested subscription doesn't exist |
| `UNAUTHORIZED`           | Authentication required              |
| `FORBIDDEN`              | Insufficient permissions             |
| `VALIDATION_ERROR`       | Invalid request data                 |
| `INTERNAL_ERROR`         | Server error                         |

---

## 🔒 Rate Limits

| Endpoint            | Limit        | Window     |
| ------------------- | ------------ | ---------- |
| `/auth/send-otp`    | 5 requests   | 15 minutes |
| `/auth/verify-otp`  | 10 requests  | 15 minutes |
| All other endpoints | 100 requests | 15 minutes |

---

## 🧪 Testing

### Health Check

**GET** `/health`

Check if API is running.

**Response (200):**

```json
{
  "status": "OK",
  "timestamp": "2025-01-07T10:00:00.000Z",
  "uptime": "1d 2h 30m",
  "version": "1.0.0"
}
```

### Test OTP (Development Only)

In test mode, OTPs are logged to console instead of being sent via SMS.

Check Render/Vercel logs for OTP values during testing.

---

## 🔧 Environment Variables

| Variable                | Description                     | Required |
| ----------------------- | ------------------------------- | -------- |
| `MONGODB_URI`           | MongoDB Atlas connection string | Yes      |
| `JWT_SECRET`            | JWT signing secret (64+ chars)  | Yes      |
| `CLIENT_URL`            | Frontend URL for CORS           | Yes      |
| `TELCO_PROVIDER`        | Default telco provider          | No       |
| `ADMIN_PASSWORD`        | Admin login password            | Yes      |
| `EASYSENDSMS_API_KEY`   | SMS service API key             | No       |
| `EASYSENDSMS_SENDER_ID` | SMS sender ID                   | No       |
| `SMS_ENABLED`           | Enable real SMS sending         | No       |
| `NODE_ENV`              | Environment mode                | No       |
| `PORT`                  | Server port                     | No       |

---

## 📝 Notes

- All monetary values are in cents (e.g., 299 = R2.99)
- MSISDN should be in international format (278XXXXXXXXX)
- JWT tokens expire after 24 hours
- Admin endpoints require special admin JWT token
- WebSocket connections require authentication
- Rate limiting is enforced on all endpoints
- CORS is configured for production domains

---

**API Documentation Complete! 📚**
