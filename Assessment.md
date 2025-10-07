# 📋 Mobile Subscription Management Portal - Assessment Requirements

**Company Assessment | October 2025**

---

## 🎯 Project Overview

Develop a web application that allows users to:
- View available subscription-based content services (e.g., games, music, quizzes)
- Subscribe/unsubscribe to services using mobile numbers (MSISDN)
- View subscription history
- Simulate integration with a telco (e.g., Vodacom or MTN) for billing

---

## 🛠️ Tech Stack Requirements

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vue.js *(selected)* |
| **Backend API** | Node.js + Express.js |
| **Database** | MongoDB *(selected)* |
| **Authentication** | OTP-based login using MSISDN |
| **Bonus** | Socket.IO for real-time updates |

---

## ✅ Functional Requirements

### Frontend (SPA)

**Landing Page:**
- Input MSISDN to request OTP (simulate send)

**OTP Page:**
- Enter OTP to log in (simulate verify)

**Dashboard:**
- View list of available services (from API)
- Subscribe/Unsubscribe to services
- View active subscriptions
- View historical transactions (fake data ok)

### Backend API

**Required Endpoints:**

1. `POST /auth/send-otp`
   - Accepts: MSISDN
   - Returns: OTP (mocked)

2. `POST /auth/verify-otp`
   - Accepts: MSISDN + OTP
   - Returns: Auth token

3. `GET /services`
   - Returns: Available VAS services

4. `POST /subscriptions`
   - Subscribes a user to a service

5. `DELETE /subscriptions/:serviceId`
   - Unsubscribes a user from a service

6. `GET /subscriptions`
   - Returns: Current user's subscriptions

7. `GET /transactions`
   - Returns: Simulated transaction history

---

## 🔒 Non-Functional Requirements

- ✅ Code must be **structured and modular**
- ✅ Use **environment variables** for config
- ✅ Use **Axios or Fetch** on the frontend
- ✅ **Minimal but modern UI** (TailwindCSS optional)
- ✅ **Token-based session** (JWT or cookie preferred)
- ✅ Use **nodemon or vite** for local development

---

## 🌟 Bonus Features (Optional)

- [ ] **Admin view** (mock): See total active users per service
- [ ] **Real-time dashboard updates** with Socket.IO
- [ ] **Telco config abstraction** (simulate different billing providers)
- [ ] **Rate limiting** or abuse detection for OTP endpoint

---

## 📦 Deliverables

### GitHub Repository Structure:
```
mobile-subscription-portal/
├── client/          # Vue.js app
├── server/          # Express.js API
└── README.md
```

### README Must Include:
- Setup instructions
- Tech choices + justifications
- API documentation

---

## ✅ Implementation Checklist

### Core Features
- [ ] Landing page with MSISDN input
- [ ] OTP verification page
- [ ] Dashboard with services listing
- [ ] Subscribe functionality
- [ ] Unsubscribe functionality
- [ ] Active subscriptions view
- [ ] Transaction history view
- [ ] All 7 API endpoints working
- [ ] JWT authentication
- [ ] MongoDB integration

### Bonus Features
- [ ] Socket.IO real-time updates
- [ ] Rate limiting on OTP endpoint
- [ ] Admin dashboard
- [ ] Telco provider abstraction

### Quality & Documentation
- [ ] Modular code structure
- [ ] Environment variables configured
- [ ] Modern UI with TailwindCSS
- [ ] Comprehensive README
- [ ] API documentation
- [ ] Setup instructions tested

---

## 📊 Assessment Criteria (Implied)

1. **Functionality** - Does everything work as specified?
2. **Code Quality** - Is the code clean, modular, and well-structured?
3. **Tech Stack** - Proper use of Vue.js, Express.js, MongoDB
4. **Authentication** - OTP + JWT implementation
5. **UI/UX** - Modern, responsive, user-friendly interface
6. **Documentation** - Clear README with setup and justifications
7. **Bonus Features** - Extra points for implementing optional features
8. **Production Readiness** - Error handling, validation, security

---

## 🎯 Success Criteria

**Minimum to Pass:**
- All 7 API endpoints functional
- Complete auth flow (OTP → JWT)
- Frontend SPA with all required pages
- Subscribe/Unsubscribe working
- Basic documentation

**To Impress:**
- All bonus features implemented
- Production deployment (live URLs)
- Comprehensive documentation
- Clean, professional code
- Real-time updates with Socket.IO
- Excellent UI/UX

---

## 📅 Timeline

**Submission Deadline:** Friday, October 10th @ 9:00 AM UTC

**Recommended Schedule:**
- **Days 1-2:** Backend API + MongoDB
- **Days 3-4:** Frontend core features
- **Days 5-6:** Bonus features + integration
- **Day 7:** Documentation + deployment

---

**Good luck! 🚀**