# 🚀 Deployment Guide - MSMP

This guide provides step-by-step instructions for deploying the Mobile Subscription Management Portal to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with repository created
- ✅ Render account ([Sign up](https://render.com/))
- ✅ Vercel account ([Sign up](https://vercel.com/))
- ✅ MongoDB Atlas cluster set up
- ✅ (Optional) EasySendSMS account with credits

---

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables Ready

**Backend (Render):**

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=64-char-secret
CLIENT_URL=https://your-app.vercel.app
TELCO_PROVIDER=Vodacom
ADMIN_PASSWORD=SecurePassword123!
EASYSENDSMS_API_KEY=your-key
EASYSENDSMS_SENDER_ID=YourBrand
SMS_ENABLED=false
NODE_ENV=production
PORT=5000
```
