# 📱 Mobile Subscription Management Portal (MSMP)

A modern, full-stack web application for managing mobile service subscriptions with OTP authentication, real-time updates, and admin analytics.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-brightgreen.svg)](https://vuejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green.svg)](https://www.mongodb.com/)

---

## 🌟 Features

### Core Functionality

- ✅ **OTP Authentication** - Secure login via SMS (EasySendSMS integration)
- ✅ **Service Management** - Browse and subscribe to mobile services
- ✅ **Subscription Tracking** - View active subscriptions and expiry dates
- ✅ **Transaction History** - Complete audit trail of all activities
- ✅ **Real-time Updates** - Live subscription changes via Socket.IO
- ✅ **Admin Dashboard** - Analytics, revenue tracking, and user insights
- ✅ **Dark Mode** - System-aware theme switching
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS

### Technical Highlights

- 🔒 **JWT Authentication** - Secure token-based auth with 24h expiry
- 🚦 **Rate Limiting** - Brute-force protection on auth endpoints
- 📊 **MongoDB Aggregations** - Advanced analytics queries
- 🌐 **RESTful API** - Clean, documented endpoints
- ⚡ **WebSocket Support** - Real-time bidirectional communication
- 🎯 **Telco Abstraction** - Multi-provider support (Vodacom, MTN, Cell C)

---

## 🛠️ Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Vue Toastification** - Elegant notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - WebSocket server
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-rate-limit** - Rate limiting middleware
- **helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### External Services

- **EasySendSMS** - SMS delivery (REST API v1)
- **MongoDB Atlas** - Cloud database hosting

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **EasySendSMS Account** (Optional) - [Sign up](https://www.easysendsms.app/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Mr-Akhil12/M.S.M.P.git
cd M.S.M.P
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials (see Environment Variables section)
# Required: MONGODB_URI, JWT_SECRET
# Optional: EASYSENDSMS_API_KEY (for production SMS)

# Start development server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file (optional for local dev)
cp .env.example .env

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### 4. Access the Application

Open your browser and visit: `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/msmp

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-64-chars
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Telco Provider (Vodacom, MTN, CellC)
TELCO_PROVIDER=Vodacom

# Admin Dashboard
ADMIN_PASSWORD=YourSecurePassword123!

# SMS Configuration (EasySendSMS REST API v1)
EASYSENDSMS_API_KEY=your-api-key-here
EASYSENDSMS_SENDER_ID=YourBrandName

# SMS Mode (true = production, false = test mode)
SMS_ENABLED=false

# Environment (development or production)
NODE_ENV=development
```

### Frontend (`client/.env`)

```env
# Backend API URL (auto-detected if not set)
VITE_API_URL=http://localhost:5000
```

---

## 📱 SMS Configuration

The application uses **EasySendSMS** for OTP delivery and is **production-ready**.

### 🧪 Test Mode (Current - No SMS Costs)

For development and demonstration:

```env
SMS_ENABLED=false
NODE_ENV=development
```

**Behavior:**

- OTP is logged to the terminal in a boxed format
- OTP is included in the API response for easy testing
- No actual SMS is sent (no costs incurred)

**Example Terminal Output:**

```
========================================
📱 SMS TEST MODE - OTP Generated
========================================
Phone: 27812345678
OTP Code: 123456
Expires: 5 minutes
========================================
```

**Example API Response:**

```json
{
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

### 🚀 Production Mode (Ready to Activate)

When you have SMS credits loaded:

```env
SMS_ENABLED=true
NODE_ENV=production
EASYSENDSMS_API_KEY=your-api-key
EASYSENDSMS_SENDER_ID=YourBrand
```

**Behavior:**

- Real SMS sent to user's phone via EasySendSMS REST API v1
- OTP **not** included in API response (security)
- Professional sender ID displayed on user's phone
- Full error handling for invalid numbers, insufficient credits, etc.

### 🔄 Switching to Production

1. Load credits on [EasySendSMS](https://www.easysendsms.app)
2. Update `.env`:
   ```env
   SMS_ENABLED=true
   NODE_ENV=production
   ```
3. Restart server: `npm run dev` or `npm start`
4. Done! SMS will be sent automatically

**No code changes required** - the integration is already complete.

---

## 📚 API Documentation

### Base URL

- Local: `http://localhost:5000/api`
- Production: `https://your-backend.onrender.com/api`

### Authentication Endpoints

#### Send OTP

```http
POST /auth/send-otp
Content-Type: application/json

{
  "msisdn": "27812345678"
}
```

**Response (200 OK):**

```json
{
  "message": "OTP sent successfully",
  "otp": "123456" // Only in development mode
}
```

#### Verify OTP

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "msisdn": "27812345678",
  "otp": "123456"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "msisdn": "27812345678",
    "createdAt": "2025-01-07T10:30:00.000Z"
  }
}
```

### Service Endpoints

#### Get All Services

```http
GET /services
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Netflix Premium",
    "description": "Stream unlimited movies and TV shows",
    "price": 199,
    "billingCycle": "monthly",
    "imageUrl": "https://example.com/netflix.jpg"
  }
]
```

### Subscription Endpoints

#### Get User Subscriptions

```http
GET /subscriptions
Authorization: Bearer <token>
```

#### Create Subscription

```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439011"
}
```

#### Cancel Subscription

```http
DELETE /subscriptions/:serviceId
Authorization: Bearer <token>
```

### Transaction Endpoints

#### Get User Transactions

```http
GET /transactions
Authorization: Bearer <token>
```

### Admin Endpoints

#### Verify Admin Password

```http
POST /admin/verify-password
Content-Type: application/json

{
  "password": "YourAdminPassword"
}
```

#### Get Admin Stats

```http
GET /admin/stats
```

#### Get User Stats

```http
GET /admin/user-stats
```

---

## 🧪 Testing the Application

### Local Testing (Desktop)

1. **Start backend:** `cd server && npm run dev`
2. **Start frontend:** `cd client && npm run dev`
3. **Open browser:** `http://localhost:5173`
4. **Login:**
   - Enter MSISDN: `27812345678`
   - Click "Send OTP"
   - Check terminal for OTP code
   - Enter OTP and verify

### Mobile Testing (Local Network)

1. **Find your PC's IP:**

   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.51)
   ```

2. **Update frontend `.env`:**

   ```env
   VITE_API_URL=http://192.168.1.51:5000
   ```

3. **Restart frontend:**

   ```bash
   npm run dev -- --host
   ```

4. **Access from phone:**
   - Connect phone to same Wi-Fi network
   - Open: `http://192.168.1.51:5173`

### Test Credentials

**Admin Dashboard:**

- Password: `Password123!` (configured in `.env`)

**Test MSISDN:**

- Any valid South African number: `27XXXXXXXXX`
- OTP will appear in terminal (test mode)

---

## 🚢 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**

2. **Create Render Account** - [Sign up](https://render.com/)

3. **Create New Web Service:**

   - Connect GitHub repository
   - Name: `msmp-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables:**

   ```
   MONGODB_URI=your-atlas-connection-string
   JWT_SECRET=your-64-char-secret
   CLIENT_URL=https://your-frontend.vercel.app
   TELCO_PROVIDER=Vodacom
   ADMIN_PASSWORD=YourSecurePassword
   EASYSENDSMS_API_KEY=your-api-key
   EASYSENDSMS_SENDER_ID=YourBrand
   SMS_ENABLED=false
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy** and note your backend URL: `https://msmp-api.onrender.com`

### Frontend Deployment (Vercel)

1. **Update `client/.env`:**

   ```env
   VITE_API_URL=https://msmp-api.onrender.com
   ```

2. **Push to GitHub**

3. **Create Vercel Account** - [Sign up](https://vercel.com/)

4. **Import Project:**

   - Select your GitHub repository
   - Framework: `Vite`
   - Root Directory: `client`

5. **Set Environment Variables:**

   ```
   VITE_API_URL=https://msmp-api.onrender.com
   ```

6. **Deploy** and note your frontend URL: `https://msmp-app.vercel.app`

### Post-Deployment

1. **Update Backend CORS:**

   - Add Vercel URL to `CLIENT_URL` in Render environment variables

2. **Test Production:**
   - Visit your Vercel URL
   - Test OTP flow
   - Test subscriptions
   - Test admin dashboard

---

## 📁 Project Structure

```
M.S.M.P/
├── client/                    # Frontend (Vue 3 + Vite)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   │   ├── DarkModeToggle.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Header.vue
│   │   │   ├── ServiceCard.vue
│   │   │   ├── SubscriptionCard.vue
│   │   │   └── TransactionList.vue
│   │   ├── composables/      # Vue composables
│   │   │   ├── useSocket.js
│   │   │   └── useToast.js
│   │   ├── router/           # Vue Router configuration
│   │   │   └── index.js
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── stores/           # Pinia stores
│   │   │   ├── auth.js
│   │   │   ├── services.js
│   │   │   └── subscriptions.js
│   │   ├── views/            # Page components
│   │   │   ├── Admin.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── Landing.vue
│   │   │   └── OTPVerify.vue
│   │   ├── App.vue           # Root component
│   │   ├── main.js           # Application entry point
│   │   └── style.css         # Global styles
│   ├── .env.example          # Environment variables template
│   ├── index.html            # HTML entry point
│   ├── package.json          # Frontend dependencies
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite configuration
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── database.js
│   │   │   └── telco.config.js
│   │   ├── controllers/      # Request handlers
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── services.js
│   │   │   ├── subscriptions.js
│   │   │   └── transactions.js
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.js
│   │   │   └── rateLimiter.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── Service.js
│   │   │   ├── Subscription.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   ├── routes/           # Express routes
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── services.js
│   │   │   ├── subscriptions.js
│   │   │   └── transactions.js
│   │   ├── services/         # Business logic services
│   │   │   ├── smsService.js
│   │   │   └── telco/        # Telco provider implementations
│   │   │       ├── VodacomProvider.js
│   │   │       ├── MTNProvider.js
│   │   │       ├── CellCProvider.js
│   │   │       └── index.js
│   │   └── utils/            # Utility functions
│   │       ├── otpService.js
│   │       └── tokenService.js
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies
│   └── server.js             # Server entry point
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcrypt for admin password
- ✅ **Rate Limiting** - Prevent brute-force attacks
- ✅ **Helmet.js** - Security headers
- ✅ **CORS Protection** - Whitelist allowed origins
- ✅ **OTP Expiry** - 5-minute validity
- ✅ **Attempt Limiting** - Max 3 OTP attempts
- ✅ **Input Validation** - Server-side validation
- ✅ **SQL Injection Protection** - MongoDB parameterized queries

---

## 🎨 UI/UX Features

- 📱 **Mobile-First Design** - Optimized for all screen sizes
- 🌓 **Dark Mode** - System-aware theme switching
- 🎨 **Tailwind CSS** - Modern, responsive design
- 🔔 **Toast Notifications** - User-friendly feedback
- ⚡ **Real-time Updates** - Live subscription changes
- 🎭 **Loading States** - Skeleton screens and spinners
- ♿ **Accessibility** - Semantic HTML and ARIA labels
- 🎯 **Smooth Animations** - Tailwind transitions

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **In-Memory OTP Storage** - Use Redis in production for scalability
2. **SMS Test Mode** - EasySendSMS credits required for production
3. **Single Admin User** - No multi-admin support yet
4. **No Email Notifications** - Only SMS OTP currently
5. **Limited Payment Integration** - Mock payment system

### Planned Improvements

- [ ] Redis integration for OTP storage
- [ ] Email OTP as fallback
- [ ] Multi-admin role management
- [ ] Payment gateway integration (PayFast/PayGate)
- [ ] Service usage analytics
- [ ] Subscription renewal reminders
- [ ] Export transactions to CSV/PDF

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**AkhilDevs**

- GitHub: https://github.com/Mr-Akhil12
- LinkedIn: https://www.linkedin.com/in/akhil-pillay-627b032b6/
- Email: pillayakhil2@gmail.com

---

## 🙏 Acknowledgments

- **Penrose** - For the assessment opportunity
- **EasySendSMS** - SMS delivery service
- **MongoDB Atlas** - Cloud database hosting
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Vue.js Community** - Amazing framework and ecosystem
- **Tailwind CSS** - Beautiful utility-first CSS

---

## 📞 Support

For issues, questions, or feedback:

- Phone: 067 865 9396
- Email: pillayakhil2@gmail.com
---

## 🎯 Live Demo

**Frontend:** [https://msmp-app.vercel.app](https://msmp-app.vercel.app) _(Update after deployment)_  
**Backend API:** [https://msmp-api.onrender.com](https://msmp-api.onrender.com) _(Update after deployment)_

### Test Credentials

- **Admin Password:** `Password123!`
- **Test MSISDN:** Any valid SA number (27XXXXXXXXX)
- **OTP:** Check terminal logs (test mode) or your phone (production)

---

**Built with ❤️ by AkhilDevs to impress Penrose** 🚀
