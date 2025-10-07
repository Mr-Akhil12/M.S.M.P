# 🚀 Mobile Subscription Portal - Build Guide

**Timeline:** Oct 3-10, 2025 (7 days)  
**Submission:** Friday, Oct 10 @ 9:00 AM UTC  
**Developer:** CS-AppDev

---

## 📋 Tech Stack

### Frontend
- Vue.js 3 (Composition API) + Vite + Pinia + TailwindCSS + Axios + Socket.IO Client

### Backend
- Express.js + MongoDB (Atlas) + JWT + Socket.IO + express-rate-limit + express-validator

### Deployment
- Frontend: Vercel | Backend: Render/Railway | DB: MongoDB Atlas

---

## 📁 Project Structure

```
mobile-subscription-portal/
├── server/
│   ├── src/
│   │   ├── config/          # database.js, telco.config.js
│   │   ├── models/          # User, Service, Subscription, Transaction
│   │   ├── controllers/     # auth, services, subscriptions, transactions, admin
│   │   ├── routes/          # Route files for each controller
│   │   ├── middleware/      # auth, errorHandler, rateLimiter, validation
│   │   ├── utils/           # otpService, tokenService
│   │   ├── services/telco/  # TelcoProvider, VodacomProvider, MTNProvider
│   │   └── server.js
│   ├── scripts/             # seedServices.js
│   ├── .env
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── views/           # Landing, OTPVerify, Dashboard, Admin
│   │   ├── router/          # Vue Router config
│   │   ├── stores/          # Pinia stores (auth, services, subscriptions)
│   │   ├── composables/     # useSocket, useToast
│   │   ├── services/        # api.js (Axios instance)
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🔧 Phase 1: Backend Setup (8-10 hours)

**Goal:** Complete REST API with MongoDB + JWT Auth

### Steps:

1. **Project Init (30 min)**
   - Create `server/` folder, run `npm init -y`
   - Install: `express mongoose dotenv jsonwebtoken express-validator express-rate-limit socket.io cors helmet`
   - Install dev: `nodemon`
   - Create folder structure

2. **MongoDB Setup (30 min)**
   - Create MongoDB Atlas account (free tier)
   - Get connection string
   - Create `.env` with `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`
   - Create `config/database.js` for connection

3. **Database Models (1 hour)**
   - **User:** `msisdn`, `createdAt`, `lastLogin`
   - **Service:** `name`, `description`, `category`, `price`, `billingCycle`, `imageUrl`, `isActive`
   - **Subscription:** `userId`, `serviceId`, `status`, `subscribedAt`, `expiresAt`, `cancelledAt`
   - **Transaction:** `userId`, `serviceId`, `type`, `amount`, `status`, `date`

4. **Utilities (1.5 hours)**
   - **otpService.js:** Generate 6-digit OTP, store in Map with 5min expiry, verify with attempt limiting
   - **tokenService.js:** Generate/verify JWT tokens

5. **Middleware (1 hour)**
   - **auth.middleware.js:** Extract Bearer token, verify JWT, attach user to `req.user`
   - **errorHandler.js:** Global error handler
   - **rateLimiter.js:** OTP endpoint (3 per 15min), General API (100 per 15min)

6. **Controllers (2-3 hours)**
   - **auth:** `sendOTP()`, `verifyOTPAndLogin()` (create user if not exists)
   - **services:** `getServices()`, `getServiceById()`
   - **subscriptions:** `subscribe()` (check duplicates, create transaction), `getUserSubscriptions()`, `unsubscribe()` (soft delete)
   - **transactions:** `getTransactions()` (with pagination)
   - **admin:** `getStats()` (total users, active subs, per-service breakdown)

7. **Routes (45 min)**
   - Map controllers to endpoints:
     - `POST /api/auth/send-otp` (with rate limiter)
     - `POST /api/auth/verify-otp`
     - `GET /api/services` (protected)
     - `POST /api/subscriptions` (protected)
     - `DELETE /api/subscriptions/:serviceId` (protected)
     - `GET /api/subscriptions` (protected)
     - `GET /api/transactions` (protected)
     - `GET /api/admin/stats` (protected)

8. **Server Setup (30 min)**
   - Create `server.js` with Express + CORS + Helmet
   - Connect to MongoDB
   - Mount routes
   - Add 404 and error handlers
   - Start server on port 5000

9. **Seed Data (30 min)**
   - Create `scripts/seedServices.js` with 8-10 VAS services (games, music, news, sports, etc.)
   - Run: `npm run seed`

10. **Test (30 min)**
    - Use Postman/Thunder Client to test all endpoints
    - Verify OTP flow works
    - Test auth protection on routes
    - Check subscription duplicate prevention

**✅ Checkpoint:** All 7 API endpoints working, tested with Postman

---

## 🎨 Phase 2: Frontend Setup (8-10 hours)

**Goal:** Complete Vue 3 SPA with routing, state management, and UI

### Steps:

1. **Project Init (30 min)**
   - Run `npm create vite@latest client -- --template vue`
   - Install: `axios socket.io-client pinia vue-router`
   - Install dev: `tailwindcss postcss autoprefixer`
   - Configure TailwindCSS

2. **Router Setup (30 min)**
   - Create `router/index.js`
   - Routes: `/` (Landing), `/verify-otp` (OTP), `/dashboard` (Dashboard), `/admin` (Admin)
   - Add auth guard for protected routes (redirect if no token)

3. **Pinia Stores (1 hour)**
   - **auth.js:** `token`, `user`, `login()`, `logout()`, `isAuthenticated`
   - **services.js:** `services`, `fetchServices()`
   - **subscriptions.js:** `subscriptions`, `fetchSubscriptions()`, `subscribe()`, `unsubscribe()`

4. **Axios Setup (30 min)**
   - Create `services/api.js` with Axios instance
   - Base URL: `http://localhost:5000/api`
   - Request interceptor: Add `Authorization: Bearer ${token}` header
   - Response interceptor: Handle 401 (logout), show errors

5. **Landing Page (1 hour)**
   - MSISDN input field (validate South African format: 27XXXXXXXXX)
   - "Send OTP" button
   - Loading state, error handling
   - Navigate to `/verify-otp` on success

6. **OTP Verify Page (1.5 hours)**
   - 6-digit OTP input (separate boxes or single input)
   - "Verify" button
   - Resend OTP option
   - 5-minute countdown timer
   - On success: Save token, navigate to `/dashboard`

7. **Dashboard Layout (2 hours)**
   - Header with logout button
   - Three sections:
     - **Available Services:** Grid of ServiceCard components
     - **Active Subscriptions:** List of SubscriptionCard components
     - **Transaction History:** TransactionList component

8. **ServiceCard Component (1 hour)**
   - Display: Image, name, description, price, billing cycle
   - "Subscribe" button (disabled if already subscribed)
   - Loading state on subscribe action

9. **SubscriptionCard Component (1 hour)**
   - Display: Service name, subscribed date, expiry date
   - "Unsubscribe" button
   - Confirmation modal before unsubscribe

10. **TransactionList Component (1 hour)**
    - Table: Date, service name, amount, type, status
    - Pagination (if time allows)
    - Empty state message

11. **Styling (2-3 hours)**
    - Apply TailwindCSS across all components
    - Responsive design (mobile, tablet, desktop)
    - Loading spinners
    - Toast notifications for success/error messages
    - Smooth transitions

**✅ Checkpoint:** Full auth flow working, can subscribe/unsubscribe, see transactions

---

## ⚡ Phase 3: Core Features Integration (4-5 hours)

**Goal:** Connect everything, polish user flows, handle edge cases

### Steps:

1. **Full Integration Testing (1 hour)**
   - Test complete user journey: Landing → OTP → Dashboard → Subscribe → Unsubscribe
   - Test with multiple services
   - Test transaction history updates

2. **Error Handling (1 hour)**
   - Display meaningful error messages (expired OTP, network errors, duplicate subscription)
   - Handle token expiration (auto logout)
   - Handle loading states everywhere

3. **Edge Cases (1 hour)**
   - Invalid MSISDN format
   - Expired OTP
   - Wrong OTP (show attempts remaining)
   - Rate limiting (show cooldown timer)
   - Already subscribed to service
   - Network failures

4. **UX Polish (1-2 hours)**
   - Add loading skeletons
   - Empty states (no subscriptions, no transactions)
   - Success animations
   - Form validation feedback
   - Accessibility (aria-labels, keyboard navigation)

**✅ Checkpoint:** App feels polished, handles errors gracefully

---

## 🌟 Phase 4: Bonus Features (6-8 hours)

**Goal:** Implement Socket.IO, rate limiting, admin dashboard, telco abstraction

### 1. Socket.IO Backend (1.5 hours)

**Steps:**
- Update `server.js`: Add Socket.IO server with CORS
- Add socket auth middleware (verify JWT from handshake)
- In subscription controller: Emit `subscription:created` and `subscription:cancelled` events
- Test with multiple browser tabs

**AI Prompt:**
> "Add Socket.IO to Express server with JWT authentication and emit events on subscription create/cancel"

### 2. Socket.IO Frontend (2 hours)

**Steps:**
- Create `composables/useSocket.js`: Connect to server with JWT token
- In Dashboard: Listen for `subscription:created` and `subscription:cancelled`
- On event: Refresh subscriptions list + show toast notification
- Handle reconnection logic
- Clean up socket on component unmount

**AI Prompt:**
> "Create Vue 3 composable for Socket.IO with JWT auth, auto-reconnect, and cleanup"

**Test:** Open 2 tabs, subscribe in one, see real-time update in both

### 3. Rate Limiting (Already Done) ✅

- Applied in Phase 1 (`middleware/rateLimiter.js`)
- OTP endpoint: 3 requests per 15 minutes
- General API: 100 requests per 15 minutes

### 4. Admin Dashboard (2-3 hours)

**Backend:**
- Already created `admin.controller.js` in Phase 1
- Endpoint: `GET /api/admin/stats`

**Frontend:**
- Create `views/Admin.vue`
- Fetch stats on mount
- Display:
  - Total users card
  - Active subscriptions card
  - Service breakdown table (service name, active users)
- Simple card-based layout

**AI Prompt:**
> "Create Vue 3 admin dashboard showing total users, active subscriptions, and per-service stats"

### 5. Telco Abstraction (1.5 hours)

**Steps:**
- Create `services/telco/TelcoProvider.js` (abstract class with `charge()`, `refund()`, `checkBalance()`)
- Create `services/telco/VodacomProvider.js` (extends TelcoProvider, mock implementation)
- Create `services/telco/MTNProvider.js` (extends TelcoProvider, mock implementation)
- Create `config/telco.config.js` (provider configs from env)
- Create factory function to instantiate provider based on `process.env.TELCO_PROVIDER`
- Document usage in README

**AI Prompt:**
> "Create telco provider abstraction with factory pattern for Vodacom and MTN with mocked charge/refund methods"

**✅ Checkpoint:** All bonuses implemented, app has real-time updates

---

## 📝 Phase 5: Documentation & Polish (6-7 hours)

**Goal:** Professional documentation, clean code, production deployment

### 1. Code Cleanup (1 hour)

- Remove all `console.log` statements (except intentional ones)
- Add comments to complex logic
- Format code consistently (Prettier)
- Remove unused imports
- Ensure `.env` files are gitignored

### 2. README.md (2-3 hours)

**Structure:**
```markdown
# Mobile Subscription Management Portal

## Overview
[Brief description]

## Features
- Core features (list all 7 endpoints + frontend pages)
- Bonus features (Socket.IO, rate limiting, admin, telco abstraction)

## Tech Stack & Justifications
- Frontend: Vue.js 3 (company stack, modern, Composition API)
- Backend: Express.js (lightweight, flexible, great middleware)
- Database: MongoDB (flexible schema, scalable, great with Node.js)
- Real-time: Socket.IO (industry standard, easy WebSocket integration)
- Auth: JWT + OTP (mobile-first, standard in telco)

## Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

## Setup Instructions

### Backend
1. cd server
2. npm install
3. cp .env.example .env (edit with your values)
4. npm run seed
5. npm run dev

### Frontend
1. cd client
2. npm install
3. cp .env.example .env
4. npm run dev

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Documentation
[List all endpoints with method, path, body, response]

## Environment Variables
[List all required env vars with descriptions]

## Testing
[Manual testing steps for auth flow, subscriptions, real-time updates]

## Architecture Decisions
[Why OTP? Why JWT? Socket.IO benefits, etc.]

## Future Enhancements
- Unit tests (Jest/Vitest)
- E2E tests (Cypress)
- Real SMS gateway (Twilio)
- Docker containerization
- CI/CD pipeline

## Screenshots
[Add 3-4 screenshots of key pages]

## Live Demo
- Frontend: [Vercel URL]
- Backend: [Render URL]

## Author
Mr-Akhil12
```

### 3. API Documentation (1 hour)

**Option A:** Create detailed section in README  
**Option B:** Export Postman collection and include in repo  
**Option C:** Add Swagger/OpenAPI (if time allows)

Include for each endpoint:
- Method + Path
- Headers required
- Request body example
- Response example
- Status codes

### 4. Deployment (2-3 hours)

**Backend to Render:**
1. Push code to GitHub
2. Create Render account
3. New Web Service → Connect GitHub repo
4. Select `server/` as root directory
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
8. Deploy
9. Copy production URL

**Frontend to Vercel:**
1. Create Vercel account
2. Import GitHub repo
3. Select `client/` as root directory
4. Build command: `npm run build`
5. Add environment variable: `VITE_API_URL=[Render backend URL]`
6. Deploy
7. Copy production URL

**Update README with live URLs**

### 5. Final Testing (1 hour)

**Production Testing Checklist:**
- [ ] Landing page loads
- [ ] OTP sent (check server logs)
- [ ] OTP verification works
- [ ] Dashboard loads with services
- [ ] Subscribe works
- [ ] Unsubscribe works
- [ ] Transactions show up
- [ ] Real-time updates work (2 tabs)
- [ ] Admin dashboard loads
- [ ] Responsive on mobile
- [ ] No console errors

### 6. Submission (30 min)

**Create submission email:**
```
Subject: Mobile Subscription Portal - Assessment Submission

Hi [Name],

I've completed the Mobile Subscription Management Portal assessment.

🔗 GitHub: [repo link]
🌐 Live Demo: [Vercel URL]
📡 API: [Render URL]

Implemented:
✅ All core requirements (Vue.js SPA, Express API, MongoDB)
✅ OTP authentication with JWT
✅ Full subscription management
✅ Socket.IO real-time updates
✅ Rate limiting
✅ Admin dashboard
✅ Telco provider abstraction
✅ Production deployment
✅ Comprehensive documentation

Tech Stack:
- Frontend: Vue.js 3, Pinia, TailwindCSS
- Backend: Express.js, MongoDB, Socket.IO
- Deployment: Vercel + Render

The README includes setup instructions, API docs, and architecture decisions.

Looking forward to your feedback!

Best,
CS-AppDev
```

**Send by Friday, Oct 10 @ 9:00 AM UTC** ✅

---

## ✅ Testing Checklist

### Backend
- [ ] All 7 endpoints return correct data
- [ ] JWT authentication works
- [ ] OTP generation and validation works
- [ ] Rate limiting prevents abuse
- [ ] MongoDB queries are efficient
- [ ] Error handling is comprehensive
- [ ] Socket.IO emits events correctly

### Frontend
- [ ] All routes accessible
- [ ] Auth flow works (Landing → OTP → Dashboard)
- [ ] Services display correctly
- [ ] Subscribe/Unsubscribe works
- [ ] Transactions display
- [ ] Real-time updates work
- [ ] Admin dashboard shows stats
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Loading states everywhere
- [ ] Error messages display

### Integration
- [ ] Frontend connects to backend
- [ ] Token persists on refresh
- [ ] Logout clears state
- [ ] CORS configured correctly
- [ ] Socket.IO connects with auth

---

## 🐛 Troubleshooting

### Common Issues:

**CORS Error:**
- Ensure backend CORS allows `CLIENT_URL`
- Check Socket.IO CORS config

**Socket.IO not connecting:**
- Verify token passed in `socket.handshake.auth`
- Check backend socket auth middleware

**MongoDB connection fails:**
- Whitelist IP in MongoDB Atlas (0.0.0.0/0)
- Verify connection string format

**OTP not working:**
- Check OTP hasn't expired (5 min)
- Verify MSISDN format (27XXXXXXXXX)
- Check rate limiting not blocking

**Token expired:**
- Increase `JWT_EXPIRES_IN` in .env
- Implement refresh token (future enhancement)

---

## 📊 Time Breakdown

| Phase | Hours | Days |
|-------|-------|------|
| Backend Setup | 8-10h | Fri PM + Sat AM |
| Frontend Setup | 8-10h | Sat PM + Sun AM |
| Core Integration | 4-5h | Sun PM |
| Bonus Features | 6-8h | Mon-Wed evenings |
| Documentation | 6-7h | Thu evening + Fri |
| **TOTAL** | **32-40h** | **7 days** |

---

## 🎯 Success Criteria

By Friday Oct 10, you will have:

✅ Fully functional full-stack application  
✅ Production deployment with live URLs  
✅ All core requirements implemented  
✅ 4 bonus features working  
✅ Professional documentation  
✅ Clean, modular codebase  
✅ Comprehensive testing  

**This will impress them!** 💪

---

## 🚀 Quick Start

```bash
# Friday evening - Start here!
mkdir mobile-subscription-portal && cd mobile-subscription-portal
mkdir server client
cd server && npm init -y
# Follow Phase 1...
```

**Let's build this! 🔥**