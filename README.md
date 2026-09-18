# 📱 Mobile Subscription Management Portal (MSMP)

> **A production-ready web application for managing mobile content subscriptions with OTP authentication, real-time updates, and telco billing integration.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-brightgreen?style=for-the-badge)](https://m-s-m-p.vercel.app)
[![Backend API](https://img.shields.io/badge/📡_Backend-Render-blue?style=for-the-badge)](https://m-s-m-p.onrender.com/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📸 Application Preview

<div align="center">

### Landing Page (Light Mode)

![Landing Light](https://static.wixstatic.com/media/631845_a0eda6f146ab48e2b978becf5f03b1e7~mv2.png)

### Dashboard (Dark Mode)

![Dashboard Dark](https://static.wixstatic.com/media/631845_587ffad1dbbe48019fa6d125ad6a71dd~mv2.png)

### Admin Analytics

![Admin Dashboard](https://static.wixstatic.com/media/631845_8bede74aabde455d9688e0815e3cf4eb~mv2.png)

### Mobile Responsive

<img src="https://static.wixstatic.com/media/631845_8bc43916678942849cc9528cb636b702~mv2.png" alt="Mobile" width="250"/>

</div>

---

## 🎯 Try It Live

**👉 [Launch Application](https://m-s-m-p.vercel.app) 👈**

- The render backend is a bit slow on initial response (Free Tier)
- Request otp 1/2 times, wait a minute and then request again

**Demo access (no live credentials in this README):**

Use your own Render dashboard if you deploy the backend. For local/demo testing:

**Test Credentials:**

- 📱 MSISDN: Any valid SA number (`27XXXXXXXXX`)
- 🔑 OTP: Check your local server console / backend logs when `SMS_ENABLED=false` (test mode)
- 🔐 Admin: set via `ADMIN_PASSWORD` in your private `.env` (never commit real values)

---

## 🚀 Setup Instructions

### Prerequisites

- **Option 1 (Local):** Node.js 20+ ([Download](https://nodejs.org/))
- **Option 2 (Docker):** Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- Git ([Download](https://git-scm.com/))

---

### Option 1: Local Development (VS Code)

**1. Clone & Install**

```bash
git clone https://github.com/Mr-Akhil12/M.S.M.P.git
cd M.S.M.P

# Backend
cd server
npm install

# Frontend (new terminal)
cd ../client
npm install
```

**2. Configure Environment Variables**

Configure `server/.env`:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
PORT=5000
CLIENT_URL=http://localhost:5173
# Production URL (secondary - uncomment if testing deployed version)
# CLIENT_URL=https://m-s-m-p.vercel.app
TELCO_PROVIDER=Vodacom
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
EASYSENDSMS_API_KEY=YOUR_EASYSENDSMS_API_KEY
EASYSENDSMS_SENDER_ID=YOUR_EASYSENDSMS_SENDER_ID
SMS_ENABLED=true
NODE_ENV=development
```

Configure `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

**3. Start Development Servers**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

**4. Access Application**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

---

### Option 2: Docker Setup (Recommended)

**Prerequisites:**

- ✅ Docker Desktop installed and running
- ✅ Docker Compose installed (included with Docker Desktop)

**1. Clone Repository**

```bash
git clone https://github.com/Mr-Akhil12/M.S.M.P.git
cd M.S.M.P
docker-compose up
```

**That's it!** Open http://localhost:5173 🎉
If you have any issues, most likely your env file might not be correct

**2. Check The Environment File**

Check `.env` in project root:

```env
# Database (MongoDB Atlas)
MONGODB_URI=YOUR_MONGODB_URI

# JWT Secret
JWT_SECRET=YOUR_JWT_SECRET

# Telco Provider
TELCO_PROVIDER=Vodacom

# Admin Access
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD

# SMS Configuration
EASYSENDSMS_API_KEY=YOUR_EASYSENDSMS_API_KEY
EASYSENDSMS_SENDER_ID=YOUR_EASYSENDSMS_SENDER_ID
SMS_ENABLED=true
```

**3. Build Docker Images**

```bash
# Build images (first time: ~3-5 minutes)
docker-compose build

# Expected output:
# [+] Building 180.3s (24/24) FINISHED
#  => [backend] ...
#  => [frontend] ...
```

**4. Start Containers**

```bash
# Start in attached mode (see logs)
docker-compose up

# OR start in detached mode (background)
docker-compose up -d
```

**Expected Output:**

```
[+] Running 2/2
 ✔ Container msmp-backend   Started
 ✔ Container msmp-frontend  Started

msmp-backend  | ========================================
msmp-backend  | [Server] Running on http://0.0.0.0:5000
msmp-backend  | [ENV] Mode: development
msmp-backend  | [ENV] MongoDB: Connected ✓
msmp-backend  | ========================================
```

**5. Access Application**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

**6. View Logs**

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

**7. Stop Containers**

```bash
# Stop containers (preserves data)
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

### Docker Commands Reference

| Command                           | Purpose                         |
| --------------------------------- | ------------------------------- |
| `docker-compose up`               | Start all containers (attached) |
| `docker-compose up -d`            | Start in background (detached)  |
| `docker-compose down`             | Stop all containers             |
| `docker-compose logs -f`          | Follow logs (all services)      |
| `docker-compose logs -f backend`  | Follow backend logs only        |
| `docker-compose logs -f frontend` | Follow frontend logs only       |
| `docker-compose restart backend`  | Restart backend container       |
| `docker-compose up --build`       | Rebuild and start               |
| `docker ps`                       | List running containers         |
| `docker stats`                    | View resource usage             |
| `docker-compose exec backend sh`  | Shell into backend container    |

---

### Docker Hot Reload (Development)

The Docker setup includes hot reload for backend development:

- ✅ **Backend:** Edit files in `server/src/` → auto-restart
- ✅ **Frontend:** Nginx serves pre-built static files (rebuild for changes)

**To apply frontend changes:**

```bash
docker-compose up --build frontend
```

---

### Multi-Environment Configuration Strategy

**The Problem:** During development, I was constantly switching between Local, Docker, and Production environments. Each time I deployed, I had to manually edit `.env` files to change API URLs, which led to bugs and wasted time. I'd forget to change `http://localhost:5000` to the production URL, or accidentally commit the wrong configuration.

**The Solution:** Environment-specific `.env` files that **automatically** load based on the environment. This was my first time implementing this pattern, and it eliminated all configuration headaches.

---

#### How It Works

The project uses **three separate `.env` files** for the frontend:

```
client/
├── .env                  # Docker (Nginx proxy)
├── .env.development      # Local dev (npm run dev)
└── .env.production       # Production (npm run build)
```

**Vite automatically selects the correct file** based on the command:

| Command             | File Loaded        | API URL Used                       |
| ------------------- | ------------------ | ---------------------------------- |
| `npm run dev`       | `.env.development` | `http://localhost:5000/api`        |
| `docker-compose up` | `.env`             | `/api` (Nginx proxy)               |
| `npm run build`     | `.env.production`  | `https://m-s-m-p.onrender.com/api` |

---

#### Why This Works

1. **Zero Manual Changes** - Switch environments with just the command
2. **No More Bugs** - Can't accidentally deploy with wrong URL
3. **Docker-Optimized** - Uses Nginx proxy to eliminate CORS issues
4. **Git-Safe** - Each file committed with correct values

---

#### Example: The Three Configurations

**Local Development** (`.env.development`):

```env
# Direct connection to local backend
VITE_API_URL=http://localhost:5000/api
```

**Docker** (`.env`):

```env
# Nginx proxy forwards /api to backend container
VITE_API_URL=/api
```

**Production** (`.env.production`):

```env
# Vercel → Render (full URL required)
VITE_API_URL=https://m-s-m-p.onrender.com/api
```

---

#### The Result

Before this approach, my workflow was:

1. Edit `.env` → change URL
2. Test locally
3. Edit `.env` again → change back
4. Deploy
5. Realize I forgot to change it → redeploy

Now it's just:

1. `npm run dev` for local testing
2. `docker-compose up` to verify Docker build
3. `git push` to deploy (Vercel uses `.env.production` automatically)

**No configuration changes. No bugs. No wasted time.** This pattern is now my standard approach for all multi-environment projects.

---

### Option 3: Production Deployment

**Backend (Render):**

1. Push to GitHub
2. Create [Render](https://render.com/) account
3. New Web Service → Connect repo
4. Root directory: `server`
5. Build: `npm install`
6. Start: `npm start`
7. Add environment variables (same as local)

**Frontend (Vercel):**

1. Create [Vercel](https://vercel.com/) account
2. Import GitHub repo
3. Root directory: `client`
4. Build: `npm run build`
5. Add `VITE_API_URL=https://your-backend.onrender.com`

---

## 🛠️ Tech Stack & Justifications

### Frontend Architecture

| Technology           | Version | Justification                                                                         |
| -------------------- | ------- | ------------------------------------------------------------------------------------- |
| **Vue.js 3**         | 3.5+    | Company stack requirement. Composition API for better code organization.              |
| **Vite**             | 5.x     | Lightning-fast HMR (200ms vs Webpack's 2s). Modern ESM-based tooling.                 |
| **Pinia**            | 2.x     | Official Vue state management. TypeScript-friendly, DevTools support.                 |
| **Vue Router**       | 4.x     | Client-side routing. Guards for auth protection.                                      |
| **TailwindCSS**      | 3.x     | Utility-first CSS. Rapid prototyping. Built-in dark mode.                             |
| **Socket.IO Client** | 4.7     | Real-time subscriptions. Auto-reconnection. Cross-browser support.                    |
| **Axios**            | 1.x     | Promise-based HTTP. Interceptors for JWT injection. Better error handling than fetch. |

**Why Vue 3 over React?**

- Company stack alignment
- Smaller bundle size (13KB vs React's 42KB)
- Better performance (Virtual DOM optimizations)
- Simpler learning curve

**Why Pinia over Vuex?**

- Official recommendation from Vue team
- TypeScript support out of the box
- Modular stores (no mutations boilerplate)
- Better DevTools integration

---

### Backend Architecture

| Technology             | Version   | Justification                                                             |
| ---------------------- | --------- | ------------------------------------------------------------------------- |
| **Node.js + Express**  | 20+ / 4.x | Non-blocking I/O perfect for real-time apps. Minimal overhead.            |
| **MongoDB Atlas**      | 8.0       | Cloud-native. Flexible schema for evolving subscription models.           |
| **Mongoose**           | 8.x       | Schema validation. Middleware hooks. Query builders.                      |
| **Socket.IO**          | 4.7       | Bi-directional communication. Room-based architecture for user isolation. |
| **JWT**                | 9.x       | Stateless authentication. No server-side session storage.                 |
| **express-rate-limit** | 7.x       | DDoS protection. Prevents OTP abuse (3 requests/15min).                   |
| **Helmet**             | 7.x       | Security headers (XSS, clickjacking, MIME sniffing).                      |
| **bcrypt**             | 5.x       | Secure password hashing (admin authentication).                           |

**Why MongoDB over SQL?**

- Flexible schema (subscriptions/services evolve frequently)
- JSON-native (seamless Node.js integration)
- Horizontal scaling with sharding
- Rich aggregation framework (admin analytics)

**Why Socket.IO over WebSockets?**

- Auto-reconnection logic
- HTTP long-polling fallback (firewall-friendly)
- Room/namespace support (user isolation)
- Cross-browser compatibility

**Why JWT over Sessions?**

- Stateless (no server-side storage)
- Scalable (no session replication needed)
- Mobile-friendly (token in Authorization header)
- Microservices-ready (tokens work across services)

---

### Docker Architecture

| Component          | Technology     | Size   | Purpose                                 |
| ------------------ | -------------- | ------ | --------------------------------------- |
| **Backend Image**  | Node 20 Alpine | ~120MB | Lightweight Node.js runtime             |
| **Frontend Image** | Nginx Alpine   | ~25MB  | Static file serving (multi-stage build) |
| **Network**        | Bridge Driver  | -      | Container communication                 |
| **Volumes**        | Named volumes  | -      | Persist node_modules                    |

**Why Docker?**

- ✅ Consistent environment across dev/staging/prod
- ✅ Eliminate "works on my machine" issues
- ✅ Easy onboarding for new developers
- ✅ Isolated dependencies (no global npm installs)
- ✅ Production-ready containerization

**Why Multi-Stage Frontend Build?**

- ✅ Builder stage: Compiles Vue app (includes node_modules)
- ✅ Production stage: Only serves static files (no Node.js)
- ✅ Final image: 25MB vs 200MB (88% smaller)

---

### Real-Time Architecture (Socket.IO)

**Design Pattern: Room-Based Isolation**

```javascript
// Each user joins their own room
socket.on("connect", () => {
  const userId = decodeJWT(socket.handshake.auth.token);
  socket.join(userId);
});

// Emit to specific user only
io.to(userId).emit("subscription:created", data);
```

**Why Rooms?**

- ✅ Privacy: User A can't see User B's events
- ✅ Security: JWT validation on connection
- ✅ Scalability: Easy to add broadcast/admin rooms

**Events Emitted:**

- `subscription:created` → New subscription added
- `subscription:cancelled` → Subscription removed
- `transaction:created` → New transaction recorded

---

### SMS Integration (EasySendSMS REST API v1)

**Two-Mode System:**

```env
# Development Mode (FREE)
SMS_ENABLED=false
# OTP logged to console, no SMS sent

# Production Mode (Paid)
SMS_ENABLED=true
# Real SMS via EasySendSMS REST API
```

**Why EasySendSMS?**

- South African provider (local delivery)
- REST API v1 (simple integration)
- Bulk SMS support (30 recipients/request)
- Affordable (R0.25/SMS)

**Alternative Considered:**

- ❌ Twilio: Too expensive for SA market
- ❌ Africastalking: Complex API, overkill for OTP

---

### Telco Billing Abstraction

**Strategy Pattern Implementation:**

```javascript
// Abstract provider
class TelcoProvider {
  async charge(msisdn, amount, serviceId) { throw new Error('Not implemented') }
  async refund(msisdn, amount, transactionId) { throw new Error('Not implemented') }
}

// Concrete providers
class VodacomProvider extends TelcoProvider { ... }
class MTNProvider extends TelcoProvider { ... }
class CellCProvider extends TelcoProvider { ... }

// Factory
const provider = TelcoFactory.create(process.env.TELCO_PROVIDER)
```

**Why This Approach?**

- ✅ Easy to add new providers (extend base class)
- ✅ Mock for testing (TestProvider class)
- ✅ Swap providers via env var (no code changes)
- ✅ Future-proof (international expansion ready)

---

### Security Layers

| Layer                | Implementation      | Purpose                          |
| -------------------- | ------------------- | -------------------------------- |
| **CORS**             | Whitelist origins   | Prevent unauthorized domains     |
| **Helmet**           | 15 security headers | XSS, clickjacking, MIME sniffing |
| **Rate Limiting**    | 3 OTP/15min         | Prevent brute-force attacks      |
| **JWT Expiry**       | 24 hours            | Force re-authentication          |
| **OTP Expiry**       | 5 minutes           | Minimize attack window           |
| **Input Validation** | Server-side checks  | Sanitize MSISDN, serviceId       |
| **Attempt Limiting** | 3 tries per OTP     | Lock after failed verifications  |

---

## 📡 API Documentation

### Base URLs

- **Local:** `http://localhost:5000/api`
- **Production:** `https://m-s-m-p.onrender.com/api`

> **Note:** `/health` endpoint excludes `/api` prefix

---

### Authentication Endpoints

#### 1. Send OTP

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "msisdn": "27812345678"
}
```

**Response (200):**

```json
{
  "message": "OTP sent successfully",
  "otp": "123456" // Only in development mode
}
```

**Rate Limit:** 3 requests per 15 minutes

---

#### 2. Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "msisdn": "27812345678",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "msisdn": "27812345678",
    "createdAt": "2025-10-08T10:30:00.000Z"
  }
}
```

**Token Expiry:** 24 hours

---

### Service Endpoints

#### 3. Get All Services

```http
GET /api/services
Authorization: Bearer {token}
```

**Response (200):**

```json
[
  {
    "_id": "68e06b840157e61e65942b14",
    "name": "Showmax Premium",
    "description": "Stream unlimited SA content",
    "category": "entertainment",
    "price": 79.99,
    "billingCycle": "monthly",
    "imageUrl": "https://example.com/showmax.jpg",
    "isActive": true,
    "features": ["4K Ultra HD", "5 streams", "Download offline"]
  }
]
```

---

#### 4. Get Service by ID

```http
GET /api/services/{serviceId}
Authorization: Bearer {token}
```

**Response (200):** Same as above (single object)

---

### Subscription Endpoints

#### 5. Get User Subscriptions

```http
GET /api/subscriptions
Authorization: Bearer {token}
```

**Response (200):**

```json
[
  {
    "_id": "68e4eacd99b1bc084f4e4898",
    "userId": "68e4eacd99b1bc084f4e4897",
    "serviceId": {
      "_id": "68e06b840157e61e65942b14",
      "name": "Showmax Premium",
      "price": 79.99
    },
    "status": "active",
    "subscribedAt": "2025-10-08T15:30:00.000Z",
    "expiresAt": "2025-11-08T15:30:00.000Z"
  }
]
```

---

#### 6. Subscribe to Service

```http
POST /api/subscriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "68e06b840157e61e65942b14"
}
```

**Response (201):**

```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "_id": "68e4eacd99b1bc084f4e4898",
    "status": "active",
    "subscribedAt": "2025-10-08T15:30:00.000Z"
  },
  "transaction": {
    "_id": "68e4eacd99b1bc084f4e4899",
    "type": "subscription",
    "amount": 79.99,
    "status": "success"
  },
  "telcoTransactionId": "vodacom_1728408000_abc123"
}
```

**Real-Time Event:** `subscription:created` emitted to user's Socket.IO room

---

#### 7. Cancel Subscription

```http
DELETE /api/subscriptions/{serviceId}
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "message": "Unsubscribed successfully",
  "transaction": {
    "_id": "68e4eacd99b1bc084f4e489a",
    "type": "unsubscription",
    "amount": 79.99,
    "status": "success"
  }
}
```

**Real-Time Event:** `subscription:cancelled` emitted

---

### Transaction Endpoints

#### 8. Get Transaction History

```http
GET /api/transactions
Authorization: Bearer {token}
```

**Response (200):**

```json
[
  {
    "_id": "68e4eacd99b1bc084f4e4899",
    "serviceId": {
      "name": "Showmax Premium",
      "imageUrl": "https://example.com/showmax.jpg"
    },
    "type": "subscription",
    "amount": 79.99,
    "status": "success",
    "description": "Showmax Premium subscription",
    "telcoTransactionId": "vodacom_1728408000_abc123",
    "createdAt": "2025-10-08T15:30:00.000Z"
  }
]
```

---

### Admin Endpoints

#### 9. Verify Admin Password

```http
POST /api/admin/verify-password
Content-Type: application/json

{
  "password": "YOUR_ADMIN_PASSWORD"
}
```

**Response (200):**

```json
{
  "valid": true,
  "success": true
}
```

---

#### 10. Get Platform Statistics

```http
GET /api/admin/stats
```

**Response (200):**

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
    }
  ]
}
```

---

#### 11. Get User Statistics

```http
GET /api/admin/user-stats
```

**Response (200):**

```json
[
  {
    "_id": "68e4eacd99b1bc084f4e4897",
    "msisdn": "27812345678",
    "subscriptions": ["Showmax Premium", "Netflix Standard"],
    "totalRevenue": 239.99
  }
]
```

---

### Error Responses

All errors follow this format:

```json
{
  "message": "Human-readable error",
  "error": "ERROR_CODE"
}
```

**Common Error Codes:**

- `INVALID_MSISDN` (400) - Invalid phone number
- `OTP_EXPIRED` (400) - OTP expired (5 min)
- `OTP_INVALID` (400) - Wrong OTP code
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `UNAUTHORIZED` (401) - Missing/invalid JWT
- `SERVICE_NOT_FOUND` (404) - Invalid serviceId
- `ALREADY_SUBSCRIBED` (400) - Duplicate subscription

---

### Rate Limits

| Endpoint           | Limit        | Window     |
| ------------------ | ------------ | ---------- |
| `/auth/send-otp`   | 3 requests   | 15 minutes |
| `/auth/verify-otp` | 10 requests  | 15 minutes |
| All others         | 100 requests | 15 minutes |

---

## 📁 Project Structure

```
M.S.M.P/
├── client/                           # Vue 3 Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── DarkModeToggle.vue   # Theme switcher
│   │   │   ├── ServiceCard.vue      # Service display
│   │   │   ├── SubscriptionCard.vue # Active subscription
│   │   │   └── TransactionList.vue  # Transaction history
│   │   ├── composables/             # Vue composables
│   │   │   ├── useSocket.js         # Socket.IO logic
│   │   │   └── useToast.js          # Toast notifications
│   │   ├── stores/                  # Pinia state
│   │   │   ├── auth.js              # Auth + JWT
│   │   │   ├── services.js          # Services state
│   │   │   └── subscriptions.js     # Subscriptions state
│   │   ├── views/                   # Page components
│   │   │   ├── Landing.vue          # OTP login
│   │   │   ├── OTPVerify.vue        # OTP verification
│   │   │   ├── Dashboard.vue        # Main dashboard
│   │   │   └── Admin.vue            # Admin analytics
│   │   ├── router/                  # Vue Router
│   │   ├── services/api.js          # Axios instance
│   │   └── App.vue                  # Root component
│   ├── .env                         # Frontend env vars
│   ├── Dockerfile                   # Frontend Docker config
│   ├── nginx.conf                   # Nginx configuration
│   ├── tailwind.config.js           # TailwindCSS config
│   └── vite.config.js               # Vite config
│
├── server/                           # Express.js Backend
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   │   ├── auth.js              # OTP + JWT logic
│   │   │   ├── services.js          # Service CRUD
│   │   │   ├── subscriptions.js     # Subscription mgmt
│   │   │   ├── transactions.js      # Transaction history
│   │   │   └── admin.js             # Analytics
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.js              # User model
│   │   │   ├── Service.js           # Service model
│   │   │   ├── Subscription.js      # Subscription model
│   │   │   └── Transaction.js       # Transaction model
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js              # JWT verification
│   │   │   └── rateLimiter.js       # Rate limiting
│   │   ├── services/                # Business logic
│   │   │   ├── smsService.js        # EasySendSMS API
│   │   │   └── telco/               # Telco providers
│   │   │       ├── TelcoProvider.js      # Abstract class
│   │   │       ├── VodacomProvider.js    # Vodacom
│   │   │       ├── MTNProvider.js        # MTN
│   │   │       └── CellCProvider.js      # Cell C
│   │   ├── utils/                   # Utilities
│   │   │   ├── otpService.js        # OTP generation
│   │   │   └── tokenService.js      # JWT utils
│   │   ├── config/                  # Configuration
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── telco.config.js      # Telco configs
│   │   └── server.js                # Express entry
│   ├── .env                         # Backend env vars
│   ├── Dockerfile                   # Backend Docker config
│   └── package.json                 # Dependencies
│
├── .env                              # Docker Compose env vars
├── .gitignore                        # Git ignore
├── docker-compose.yml                # Docker orchestration
├── README.md                         # This file
└── LICENSE                           # MIT License
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Token-based, 24h expiry
- ✅ **OTP Expiry** - 5-minute validity
- ✅ **Rate Limiting** - Prevents brute-force
- ✅ **CORS Whitelist** - Allowed origins only
- ✅ **Helmet Security** - 15 HTTP headers
- ✅ **Input Validation** - Server-side sanitization
- ✅ **Attempt Limiting** - 3 OTP tries max
- ✅ **Password Hashing** - bcrypt for admin
- ✅ **Docker Isolation** - Container security

---

## 🎯 Live Demo

**Frontend:** [https://m-s-m-p.vercel.app](https://m-s-m-p.vercel.app)  
**Backend:** [https://m-s-m-p.onrender.com](https://m-s-m-p.onrender.com)  
**Health Check:** [/health](https://m-s-m-p.onrender.com/health)  
**GitHub:** [Mr-Akhil12/M.S.M.P](https://github.com/Mr-Akhil12/M.S.M.P)

---

## 👨‍💻 Author

**Akhil Pillay**

- GitHub: [@Mr-Akhil12](https://github.com/Mr-Akhil12)
- GitHub Issues: use the repository for contact
- Contact: via GitHub

---

## 📝 License

MIT License - Free to use, modify, and distribute.

---

**Built with ❤️ for the Penrose Assessment | October 2025**
