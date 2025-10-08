# 🚀 Deployment Guide - MSMP

> **From local development to global production in under 30 minutes.**  
> Deploy your full-stack Vue + Express + MongoDB app to Vercel + Render with zero cost.

<div align="center">

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)

</div>

---

## 🎯 What You'll Deploy

By the end of this guide, you'll have:

- ✅ **Backend API** running on Render (free tier, always-on option available)
- ✅ **Frontend SPA** hosted on Vercel (unlimited deployments, edge network)
- ✅ **MongoDB** on Atlas (cloud-native, 512MB free)
- ✅ **Production URLs** accessible worldwide
- ✅ **HTTPS & Security** configured automatically
- ✅ **CI/CD Pipeline** (auto-deploy on git push)

**Cost:** $0/month on free tiers (perfect for demos/portfolio)  
**Time:** ~25 minutes (if you follow the checklist)

---

## 📋 Prerequisites

Before starting, ensure you have:

| Requirement | Status | Link |
|-------------|--------|------|
| ✅ GitHub account | Required | [Sign up](https://github.com/join) |
| ✅ Render account | Required | [Sign up](https://render.com/) |
| ✅ Vercel account | Required | [Sign up](https://vercel.com/) |
| ✅ MongoDB Atlas cluster | Required | [Free setup](https://www.mongodb.com/cloud/atlas/register) |
| 🔧 EasySendSMS account | Optional | [For real SMS](https://www.easysendsms.app/) |
| 🐙 Git installed | Required | [Download](https://git-scm.com/) |

> **💡 Pro Tip:** Sign up with GitHub for all services to streamline authentication!

---

## 🧪 Pre-Flight Checklist

### 1️⃣ Test Locally One Last Time

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Visit: http://localhost:5173
```

Test these features:

- OTP login works
- Services load correctly
- Subscribe/unsubscribe functions
- Admin dashboard accessible (Password123!)
- Real-time updates (open 2 tabs, subscribe in one)
- Dark mode toggle
- Mobile responsive (resize browser)

If anything fails, fix it now before deploying!

### 2️⃣ Prepare Environment Variables

Copy these templates and fill in your values:

**Backend Environment (Render)**

```bash
# 🗄️ Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/msmp?retryWrites=true&w=majority

# 🔐 Authentication
JWT_SECRET=your-super-secret-jwt-key-min-64-chars-replace-this-with-generated-secret

# 🌐 CORS (Update after deploying frontend)
CLIENT_URL=https://m-s-m-p.vercel.app

# 📞 Telco Provider
TELCO_PROVIDER=Vodacom

# 👨‍💼 Admin Access
ADMIN_PASSWORD=YourSecurePassword123!

# 📱 SMS Configuration (EasySendSMS REST API v1)
EASYSENDSMS_API_KEY=your-api-key-here
EASYSENDSMS_SENDER_ID=YourBrand
SMS_ENABLED=false    # false = test mode (free), true = real SMS

NODE_ENV=production
PORT=5000
NODE_VERSION=18
```

**Frontend Environment (Vercel)**

```bash
# 📡 Backend API (Update after deploying backend)
VITE_API_URL=https://m-s-m-p.onrender.com
```

⚠️ Important: You'll update CLIENT_URL and VITE_API_URL after getting your production URLs!

### 3️⃣ Verify vercel.json Exists

Ensure vercel.json exists with this content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Why? This fixes 404 errors on page refresh by routing all paths to index.html for Vue Router.

If missing:

```bash
cd client
echo '{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}' > vercel.json
git add vercel.json
git commit -m "Add Vercel routing config"
```

### 4️⃣ Commit All Changes

```bash
# From project root
git status
# If you have uncommitted changes:
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

Expected output:

```
nothing to commit, working tree clean
```

✅ Pre-flight checks complete! Ready to deploy.

## 🌐 Part 1: Deploy Backend to Render

### Step 1: Create Render Account

- Visit: Render.com
- Click: "Get Started"
- Sign in with GitHub (recommended)
- Authorize Render to access your repositories

### Step 2: Create Web Service

- Click: "New +" → "Web Service"
- Connect repository:
  - Find M.S.M.P in the list
  - Click "Connect"
- If repo not found:
  - Click "Configure GitHub App"
  - Grant access to your repository
  - Return to Render and refresh

### Step 3: Configure Service

Fill in these settings:

| Setting | Value | Notes |
|---------|-------|-------|
| Name | msmp-api | Or your preferred name |
| Region | Oregon (US West) | Choose closest to your users |
| Branch | main | Or your default branch |
| Root Directory | server | ⚠️ Critical - points to backend folder |
| Environment | Node | Auto-detected |
| Build Command | See below ⬇️ | Clean install command |
| Start Command | npm start | Production start script |

Build Command (Copy exactly):

```bash
rm -rf node_modules package-lock.json && npm install
```

Why this build command? Render's build cache can corrupt dependencies. This forces a clean installation on every deploy, preventing mysterious module errors.

Instance Type:

- Free: Perfect for demos/testing (spins down after 15min inactivity)
- Starter ($7/mo): Always-on, no cold starts (recommended for production)

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add each variable individually:

| Key | Value | Example |
|-----|-------|---------|
| MONGODB_URI | Your connection string | mongodb+srv://user:pass@... |
| JWT_SECRET | 64+ char random string | Use generator |
| CLIENT_URL | https://m-s-m-p.vercel.app | Update after frontend deploy |
| TELCO_PROVIDER | Vodacom | Or MTN, CellC |
| ADMIN_PASSWORD | Your secure password | Min 8 chars, mixed case |
| EASYSENDSMS_API_KEY | Your API key | From EasySendSMS dashboard |
| EASYSENDSMS_SENDER_ID | YourBrand | Max 11 chars |
| SMS_ENABLED | false | Test mode (free) |
| NODE_ENV | production | Enables production optimizations |
| PORT | 5000 | Backend port |
| NODE_VERSION | 18 | Specifies Node.js version |

Tips:

- Click "Add Environment Variable" for each entry
- Double-check spelling (variables are case-sensitive!)
- Keep your JWT secret secure (never commit to Git)

### Step 5: Deploy Backend

- Click: "Create Web Service"
- Wait for deployment: 3-5 minutes (watch logs in real-time)
- Note your backend URL:https://m-s-m-p.onrender.com

Expected log output:

```
========================================
[Server] Running on http://0.0.0.0:5000
[ENV] Mode: production
[ENV] MongoDB: Connected
[ENV] Client URL: https://m-s-m-p.vercel.app
[SMS] Test mode enabled (no actual SMS sent)
========================================
```

✅ Deployment successful if you see "Your service is live 🎉"

### Step 6: Test Backend API

**Test 1: Health Check**

Open in browser:

https://msmp-api.onrender.com/health

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2025-10-08T...",
  "environment": "production"
}
```

**Test 2: Send OTP (cURL)**

```bash
curl -X POST https://m-s-m-p.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"msisdn":"27812345678"}'
```

Expected response:

```json
{
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

**Test 3: Check Logs for OTP**

Go to: Render Dashboard → Your service → "Logs"

Look for:

```
========================================
📱 SMS TEST MODE - OTP Generated
========================================
Phone: 27812345678
OTP Code: 123456
Expires: 5 minutes
========================================
```

✅ Backend fully operational!

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Config

**Option A: Update .env file**

```bash
cd client
```

Edit client/.env:

```
VITE_API_URL=https://m-s-m-p.onrender.com
```

Commit changes:

```bash
git add .env
git commit -m "Update API URL for production"
git push origin main
```

**Option B: Set in Vercel Dashboard (recommended for security)**

You'll set VITE_API_URL in Vercel's environment variables panel (Step 5 below).

### Step 2: Create Vercel Account

- Visit: Vercel.com
- Click: "Sign Up"
- Continue with GitHub (recommended)
- Authorize Vercel to access your repositories

### Step 3: Import Project

- Click: "Add New..." → "Project"
- Find your repository: M.S.M.P
- Click: "Import"

### Step 4: Configure Build Settings

Vercel should auto-detect Vue/Vite, but verify these settings:

| Setting | Value | Auto-Detected? |
|---------|-------|----------------|
| Framework Preset | Vite | ✅ Yes |
| Root Directory | client | ⚠️ Must click "Edit" |
| Build Command | npm run build | ✅ Yes |
| Output Directory | dist | ✅ Yes |
| Install Command | npm install | ✅ Yes |

⚠️ Critical Step:

- Click "Edit" next to "Root Directory" → Select client folder → Click "Continue"

### Step 5: Configure Environment Variables

Click "Environment Variables"

Add these variables:

| Name | Value | When to Use |
|------|-------|-------------|
| VITE_API_URL | https://m-s-m-p.onrender.com | Always |

Why this matters:

- Vite only exposes variables prefixed with VITE_
- Variables must be set at build time (not runtime)
- Values are embedded into the build output

### Step 6: Deploy Frontend

- Click: "Deploy"
- Wait for build: 2-3 minutes (watch progress)
- Note your URL: https://m-s-m-p.vercel.app

Expected build output:

```
✓ built in Xs
✓ Compiled successfully
```

✅ Frontend live! Click the deployment URL to visit.

### Step 7: Test Frontend

- Visit: Your Vercel URL
- Test features:
  - Landing page loads
  - Dark mode toggle works
  - OTP input field functional

Check browser console (F12):

```javascript
console.log(import.meta.env.VITE_API_URL)
// Should output: https://m-s-m-p.onrender.com
```

✅ Frontend deployment complete!

## 🔗 Part 3: Connect Frontend ↔ Backend

### Step 1: Update Backend CORS

Your backend needs to allow requests from your new frontend URL.

- Go to: Render Dashboard → Your service
- Click: "Environment" tab
- Find: CLIENT_URL variable
- Update to: https://m-s-m-p.vercel.app (your actual Vercel URL)
- Click: "Save Changes"

Render will automatically redeploy (takes ~2 minutes).

Watch logs for:

```
[CORS] Allowed origins: [ 'http://localhost:5173', 'https://m-s-m-p.vercel.app' ]
```

### Step 2: End-to-End Testing

Now test the complete flow on production:

- Visit: https://m-s-m-p.vercel.app

**Test 1: OTP Login Flow**

- Enter MSISDN: 27812345678 (or any valid SA number)
- Click: "Send OTP"
- Check Render logs:
  - Dashboard → Your service → Logs
  - Look for boxed OTP output
- Enter OTP from logs
- Verify: Redirects to dashboard

**Test 2: Service Subscription**

- Browse services on dashboard
- Click "Subscribe" on any service
- Verify:
  - Toast notification appears
  - Service moves to "Active Subscriptions"
  - Transaction appears in history

**Test 3: Real-Time Updates**

- Open 2 browser tabs with your Vercel URL
- Login with same MSISDN in both
- Tab 1: Subscribe to a service
- Tab 2: Should see transaction appear instantly (no refresh!)
- Check browser console in Tab 2:

```
💰 Transaction created event received
✅ Transactions loaded: 1
```

**Test 4: Admin Dashboard**

- Visit: https://m-s-m-p.vercel.app/admin
- Enter password: Password123! (or your custom password)
- Verify: Statistics display correctly
- Check: Revenue values are properly rounded (e.g., R239.97, not R239.96999...)

✅ Full integration working!

## 📱 Part 4: Mobile & Cross-Browser Testing

### Test from Mobile Device

Grab your phone 📱

- Connect to any Wi-Fi (doesn't need to be same network as PC)
- Open browser (Chrome, Safari, Firefox)
- Visit: Your Vercel URL

Test complete flow:

- OTP login
- Browse services (touch scrolling)
- Subscribe/unsubscribe (tap gestures)
- View transactions
- Toggle dark mode
- Admin dashboard

Expected behavior:

✅ Responsive layout adapts to screen size  
✅ Touch targets are adequately sized  
✅ No horizontal scrolling  
✅ Images load quickly  
✅ Buttons easy to tap  

### Test from Desktop (Multiple Browsers)

| Browser | Test Status |
|---------|-------------|
| Chrome  | [ ] Passed  |
| Firefox | [ ] Passed  |
| Safari  | [ ] Passed  |
| Edge    | [ ] Passed  |

Test in each browser:

- Visit production URL
- Complete OTP login
- Subscribe to service
- Toggle dark mode
- Check admin dashboard

## 🚀 Part 5: Enable Production SMS (Optional)

Currently, OTP is logged to terminal (test mode). When ready for real SMS:

### Step 1: Load SMS Credits

- Visit: EasySendSMS.app
- Login to your account
- Load Credits:
  - R50 minimum (~200 SMS)
  - Cost: ~R0.25 per SMS
- Verify API key is active

### Step 2: Update Backend Environment

- Go to: Render Dashboard → Your service → Environment
- Update these variables:

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| SMS_ENABLED | false | true |
| NODE_ENV | production | production |

- Click: "Save Changes"
- Wait for redeploy: ~2 minutes

### Step 3: Test Real SMS

- Visit: Your Vercel URL
- Enter your real phone number: 276XXXXXXXX
- Click: "Send OTP"
- Check your phone: SMS should arrive in 10-30 seconds

Expected SMS:

```
Your MSMP verification code is: 123456. Valid for 5 minutes. Do not share this code.
```

Check Render logs:

```
[SMS] Sending OTP to 27678659396
[SMS] Sent to 27678659396 (ID: 543dca42-9e46-485b-af4a-f5143a1dc2a1)
```

### Step 4: Monitor SMS Usage

EasySendSMS Dashboard:

- View delivery reports
- Check credit balance
- Monitor costs
- Set low credit alert:
  - Dashboard → Settings
  - Alert threshold: R10 remaining
  - Email notification enabled

✅ Production SMS enabled!

## 🐛 Troubleshooting

### 🔴 Backend Issues

**Error: "Cannot find module './router'"**

Cause: Render's build cache corrupted dependencies.

Solution:

Update Build Command to:

```bash
rm -rf node_modules package-lock.json && npm install
```

Then click "Manual Deploy" → "Clear build cache & deploy"

**Error: "Service Unavailable" on Render**

Possible causes:

- Free tier sleeping:
  - First request takes 30-50 seconds (cold start)
  - Solution: Upgrade to Starter ($7/mo) or wait
- Build failed:
  - Check Render logs for errors
  - Verify all environment variables are set
- MongoDB connection failed:
  - Verify MONGODB_URI is correct
  - Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud deployment)

**Error: "OTP not sent" / SMS fails**

Check:

- Test mode (SMS_ENABLED=false):
  - OTP logged to Render logs (not sent)
  - Expected behavior for demos
- Production mode (SMS_ENABLED=true):
  - Verify EasySendSMS has credits
  - Check API key is correct
  - Phone number format: 27XXXXXXXXX (no spaces, dashes, or +)

### 🔵 Frontend Issues

**Error: Vercel "Build Failed"**

Common causes:

- Root directory not set:
  - Fix: Edit project settings → Root Directory → client
- Missing package.json:
  - Verify: package.json exists
  - Check: Git pushed correctly
- Build command error:
  - Check: Vercel build logs for specific error
  - Common: Missing dependencies in package.json

**Error: "404 Not Found" on page refresh**

Cause: Missing vercel.json routing config.

Solution:

Create vercel.json:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Commit and push:

```bash
git add client/vercel.json
git commit -m "Add Vercel routing config"
git push origin main
```

Vercel will auto-redeploy.

**Error: "CORS Error" in browser console**

Symptoms:

```
Access to XMLHttpRequest at https://m-s-m-p.onrender.com/api/...' from origin 'https://m-s-m-p.vercel.app' has been blocked by CORS policy
```

Solution:

- Verify backend CLIENT_URL:
  - Render → Environment → CLIENT_URL
  - Must match Vercel URL exactly
  - Include https:// prefix
  - No trailing slash
- Check backend logs:

```
[CORS] Allowed origins: [ ..., 'https://m-s-m-p.vercel.app' ]
```

- Restart backend:
  - Render → Manual Deploy → Deploy latest commit

### ⚡ Real-Time Issues

Socket.IO not connecting

Check browser console:

```
// Look for these logs:
✅ Socket connected in TransactionList
🔌 Setting up transaction socket listeners
// Or this error:
❌ Socket connection error
```

Solutions:

- Clear browser cache (Ctrl+Shift+Del)
- Check backend supports WebSocket:
  - Render free tier supports WebSocket ✅
- Verify Socket.IO server running (check logs)
- Test with cURL:

```bash
curl https://m-s-m-p.onrender.com/socket.io/
# Should return Socket.IO client code
```

## 🔒 Security Checklist

Before sharing your app publicly:

- JWT_SECRET is strong (64+ characters, random)
- ADMIN_PASSWORD is secure (not Password123!)
- NODE_ENV=production on backend
- MongoDB IP whitelist configured (or allow all: 0.0.0.0/0)
- .env files not committed to Git (check .gitignore)
- node_modules/ not committed (check .gitignore)
- Rate limiting enabled (3 OTP per 15min, 100 API per 15min)
- CORS properly configured (only allow your domain)
- HTTPS enabled (automatic on Vercel/Render)
- Helmet security headers active

Run security audit:

```bash
# Backend
cd server
npm audit

# Frontend
cd client
npm audit
```

## 📊 Monitoring & Maintenance

### View Render Logs

Real-time monitoring:

- Dashboard → Your service → "Logs"

Watch for:

- API requests
- OTP generation (test mode)
- Socket.IO connections
- Errors

Useful log filters:

```
[ERROR]       # All errors
[SMS]         # SMS-related logs
[Socket.IO]   # WebSocket events
```

### Vercel Analytics (Optional)

Enable in Vercel dashboard for:

- Page views (traffic analysis)
- Performance metrics (load times)
- Core Web Vitals (user experience)
- Error tracking (catch frontend bugs)

Cost: Free for hobby projects

### MongoDB Atlas Monitoring

- Login to Atlas
- Select your cluster
- View:
  - Database size (512MB free limit)
  - Connection count
  - Query performance
  - Network traffic

Set alerts:

- Storage > 400MB (80% capacity)
- Connection spikes
- Slow queries

## 🎯 Success Criteria

Your deployment is production-ready when:

✅ **Backend:**

- Health endpoint returns 200 OK
- OTP endpoint works (test mode)
- MongoDB connected (check logs)
- Socket.IO server running
- Environment variables set correctly

✅ **Frontend:**

- Landing page loads without errors
- Dark mode toggle works
- Responsive on mobile (test real device)
- Console shows no errors (F12)

✅ **Integration:**

- OTP login completes successfully
- Services display correctly
- Subscribe/unsubscribe functions
- Transactions appear in history
- Real-time updates work (2 tabs test)
- Admin dashboard accessible

✅ **Performance:**

- Page loads in < 3 seconds (test with DevTools)
- API responds in < 500ms (check Network tab)
- No memory leaks (watch Render logs)

✅ **Security:**

- HTTPS enabled (automatic)
- CORS configured correctly
- Rate limiting active
- JWT expiry working (24 hours)

## 📝 Post-Deployment Tasks

1. **Update Documentation**

Update live URLs in README.md:

```
## 🎯 Live Demo

**🌐 Frontend:** https://m-s-m-p.vercel.app  
**📡 Backend API:** https://m-s-m-p.onrender.com  
**📦 GitHub:** https://github.com/Mr-Akhil12/M.S.M.P

### Test Credentials
- **Admin Password:** `Password123!`
- **Test MSISDN:** Any valid SA number (27XXXXXXXXX)
- **OTP:** Check [Render logs](https://dashboard.render.com/)
```

2. **Final Git Push**

```bash
git add README.md
git commit -m "Add live production URLs to documentation"
git push origin main
```

3. **Share Your Work**

Your production URLs:

| Service | URL | Share this! |
|---------|-----|-------------|
| Frontend | https://m-s-m-p.vercel.app | ✅ Yes |
| Backend |https://m-s-m-p.onrender.com |    |
| GitHub | https://github.com/Mr-Akhil12/M.S.M.P | ✅ Yes |

For demos/interviews:

- Share frontend URL only
- Provide test credentials
- Walk through key features

4. **Create Deployment Badge (Optional)**

Add to your README.md:

```
[![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen?style=for-the-badge)](https://m-s-m-p.vercel.app)
```

## 💡 Cost Optimization Tips

### Free Tier Limits

**Render (Free):**

- ✅ 750 hours/month (always covered for 1 service)
- ❌ Spins down after 15min inactivity
- ❌ Cold start ~30-50 seconds
- ✅ 100GB bandwidth/month
- ✅ WebSocket support

**Vercel (Free):**

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Edge network (fast worldwide)
- ✅ Automatic HTTPS
- ✅ No cold starts

**MongoDB Atlas (Free):**

- ✅ 512MB storage
- ✅ Shared cluster (good for 1000+ users)
- ❌ No automatic backups
- ❌ Limited to 500 connections

### When to Upgrade

- Render → Starter ($7/mo):
  - ✅ Always-on (no cold starts)
  - ✅ Better for real users
  - ✅ 400 build minutes/month
- MongoDB Atlas → M2 ($9/mo):
  - ✅ 2GB storage
  - ✅ Automated backups
  - ✅ More connections
  - ✅ Better performance
- EasySendSMS:
  - Pay-as-you-go: ~R0.25/SMS
  - Bulk discounts available
  - R50 minimum (~200 SMS)

Total monthly cost (production):

- Free tier: R0 (perfect for demos)
- Starter tier: ~R300 ($16 Render + $9 Atlas + SMS usage)

## 🆘 Getting Help

### Official Documentation

| Service | Documentation | Support |
|---------|---------------|---------|
| Render | docs.render.com | Community |
| Vercel | vercel.com/docs | Support |
| MongoDB Atlas | docs.atlas.mongodb.com | Forums |
| EasySendSMS | easysendsms.app/developers | Help Center |

### Project Support

- 📧 Email: pillayakhil2@gmail.com
- 📱 Phone: 067 865 9396
- 🐙 GitHub Issues: Report a bug

### Common Issues Database

- Check API.md for:
  - Endpoint examples
  - Error codes
  - Rate limiting details
- Check README.md for:
  - Local setup guide
  - Architecture overview
  - Technology decisions

## 🎉 Deployment Complete!

Your MSMP application is now live and accessible worldwide! 🚀

- Frontend: https://m-s-m-p.vercel.app
- Backend: https://m-s-m-p.onrender.com
- Status: ✅ Production-Ready

**Test Credentials:**

- 📱 MSISDN: Any valid SA number (27XXXXXXXXX)
- 🔑 OTP: Check Render logs (test mode)
- 🔐 Admin: Password123!

**Next Steps:**

- ✅ Test all features on production
- ✅ Share with friends/reviewers
- ✅ Update portfolio with live link
- ✅ Prepare for demo/interview

Built with ❤️ by AkhilDevs

Deployed from local to global in under 30 minutes ⚡