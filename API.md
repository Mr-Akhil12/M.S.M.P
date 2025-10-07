# 📡 API Documentation - MSMP

Complete API reference for the Mobile Subscription Management Portal backend.

---

## 🌐 Base URLs

- **Local Development:** `http://localhost:5000/api`
- **Production:** `https://m-s-m-p.onrender.com/api`

**Note:** The health check endpoint (`/health`) does NOT use the `/api` prefix.

---

## 🔐 Authentication

Most endpoints require JWT authentication.

### Request Header

```http
Authorization: Bearer <your-jwt-token>
```

---

## 🔑 Authentication Endpoints

### 1. Send OTP

Request an OTP to be sent via SMS.

**Endpoint:** `POST /api/auth/send-otp`

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

### 2. Verify OTP

Verify OTP and receive JWT token.

**Endpoint:** `POST /api/auth/verify-otp`

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

## 📦 Service Endpoints

### 3. Get All Services

Retrieve all available services.

**Endpoint:** `GET /api/services`

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

## 📝 Subscription Endpoints

### 4. Get User Subscriptions

Retrieve all active subscriptions for authenticated user.

**Endpoint:** `GET /api/subscriptions`

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

### 5. Subscribe to Service

Create a new subscription.

**Endpoint:** `POST /api/subscriptions`

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

### 6. Cancel Subscription

Cancel an active subscription.

**Endpoint:** `DELETE /api/subscriptions/:serviceId`

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

## 💰 Transaction Endpoints

### 7. Get User Transactions

Retrieve transaction history for authenticated user.

**Endpoint:** `GET /api/transactions`

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

## 👨‍💼 Admin Endpoints

### 8. Verify Admin Password

Verify admin password to access admin dashboard.

**Endpoint:** `POST /api/admin/verify-password`

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

### 9. Get Admin Statistics

Retrieve platform-wide statistics.

**Endpoint:** `GET /api/admin/stats`

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

### 10. Get User Statistics

Retrieve user-level impact statistics.

**Endpoint:** `GET /api/admin/user-stats`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalActiveSubscriptions": 756,
    "totalRevenue": 267100,
    "monthlyGrowth": 12.5,
    "churnRate": 5.3
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
