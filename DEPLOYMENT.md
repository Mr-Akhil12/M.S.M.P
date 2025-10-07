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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/msmp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-64-chars-replace-this-with-generated-secret
CLIENT_URL=https://your-app.vercel.app
TELCO_PROVIDER=Vodacom
ADMIN_PASSWORD=YourSecurePassword123!
EASYSENDSMS_API_KEY=your-api-key-here
EASYSENDSMS_SENDER_ID=YourBrand
SMS_ENABLED=false
NODE_ENV=production
PORT=5000
```

**Frontend (Vercel):**

```env
VITE_API_URL=https://your-backend.onrender.com
```

### 2. Code Ready

```bash
# Ensure all changes are committed
git status

# Should show: "nothing to commit, working tree clean"
```

### 3. Test Locally One Last Time

```bash
# Backend
cd server && npm run dev

# Frontend (new terminal)
cd client && npm run dev

# Test all features:
# - OTP login
# - Subscribe/unsubscribe
# - Admin dashboard
# - Real-time updates
```

---

## 📦 Part 1: Backend Deployment (Render)

### Step 1: Push Code to GitHub

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com/)
2. Click **"Get Started"** → Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Click **"Connect"** next to your `M.S.M.P` repository

### Step 4: Configure Service

**Basic Settings:**

- **Name:** `msmp-api` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `server`
- **Environment:** `Node`
- **Build Command:** `rm -rf node_modules package-lock.json && npm install`
- **Start Command:** `npm start`

**Instance Type:**

- Select **"Free"** (for testing/demo)
- Or **"Starter"** ($7/month) for production

> **⚠️ Important:** The build command `rm -rf node_modules package-lock.json && npm install` ensures a clean installation on every deploy, preventing corrupted dependency issues that can occur with Render's build cache.

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each variable:

| Key                     | Value                                            |
| ----------------------- | ------------------------------------------------ |
| `MONGODB_URI`           | Your Atlas connection string                     |
| `JWT_SECRET`            | Your 64-char secret                              |
| `CLIENT_URL`            | `https://your-app.vercel.app` (temp placeholder) |
| `TELCO_PROVIDER`        | `Vodacom`                                        |
| `ADMIN_PASSWORD`        | Your admin password                              |
| `EASYSENDSMS_API_KEY`   | Your EasySendSMS key                             |
| `EASYSENDSMS_SENDER_ID` | Your sender ID                                   |
| `SMS_ENABLED`           | `false`                                          |
| `NODE_ENV`              | `production`                                     |
| `PORT`                  | `5000`                                           |
| `NODE_VERSION`          | `18`                                             |

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Note your backend URL: `https://msmp-api.onrender.com`

### Step 7: Test Backend

Open in browser:

```
https://msmp-api.onrender.com/health
```

**Expected response:**

```json
{
  "status": "OK",
  "timestamp": "2025-01-07T..."
}
```

✅ **Backend deployment complete!**

---

## 🌐 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend `.env`

```bash
cd client
```

Create/update `.env`:

```env
VITE_API_URL=https://msmp-api.onrender.com
```

### Step 2: Commit Changes

```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Step 3: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com/)
2. Click **"Sign Up"** → Continue with GitHub
3. Authorize Vercel to access your repositories

### Step 4: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `M.S.M.P` repository → Click **"Import"**

### Step 5: Configure Project

**Framework Preset:** Vite _(should auto-detect)_

**Root Directory:** Click **"Edit"** → Select `client` → **"Continue"**

**Build Settings:**

- Build Command: `npm run build` _(auto-filled)_
- Output Directory: `dist` _(auto-filled)_
- Install Command: `npm install` _(auto-filled)_

### Step 6: Add Environment Variables

Click **"Environment Variables"**:

| Name           | Value                           |
| -------------- | ------------------------------- |
| `VITE_API_URL` | `https://msmp-api.onrender.com` |

### Step 7: Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Note your frontend URL: `https://msmp-app.vercel.app`

✅ **Frontend deployment complete!**

---

## 🔗 Part 3: Connect Frontend & Backend

### Step 1: Update Backend CORS

Go to Render → Your Web Service → **"Environment"**

Update `CLIENT_URL`:

```
CLIENT_URL=https://msmp-app.vercel.app
```

Click **"Save Changes"** → Render will auto-redeploy

### Step 2: Test Production

Open your Vercel URL: `https://msmp-app.vercel.app`

**Test Flow:**

1. Enter MSISDN (e.g., `27812345678`)
2. Click "Send OTP"
3. Check Render logs for OTP:

   - Go to Render dashboard
   - Click your service
   - Click "Logs" tab
   - Look for boxed OTP output

4. Enter OTP from logs
5. Verify login works
6. Test subscribe/unsubscribe
7. Test admin dashboard

---

## 📱 Part 4: Mobile Testing

### Test from Your Phone

1. **Connect to Wi-Fi** (any network, not just local)
2. **Open browser** on phone
3. **Visit:** `https://msmp-app.vercel.app`
4. **Test complete flow:**
   - OTP login
   - Browse services
   - Subscribe to service
   - View transactions
   - Admin dashboard

### Test from Desktop

1. Open in different browsers (Chrome, Firefox, Safari, Edge)
2. Test responsive design (resize window)
3. Test dark mode toggle
4. Test all features

---

## 🔄 Part 5: Enable Production SMS (Optional)

When ready to send real SMS:

### Step 1: Load EasySendSMS Credits

1. Go to [EasySendSMS.app](https://www.easysendsms.app/)
2. Login → Load Credits
3. Verify API key is active

### Step 2: Update Backend Environment

Go to Render → Environment Variables:

```
SMS_ENABLED=true
```

Click **"Save Changes"** → Auto-redeploy

### Step 3: Test Real SMS

1. Request OTP from production site
2. Check your phone for SMS
3. OTP should arrive within 10-30 seconds

---

## 🐛 Troubleshooting

### Issue: "Cannot find module './router'" or Similar Module Errors

**Solution:**

This is caused by Render's build cache corrupting dependencies. Update your **Build Command** to:

```bash
rm -rf node_modules package-lock.json && npm install
```

This forces a clean installation on every deploy.

### Issue: "Failed to send OTP"

**Check:**

1. Render logs for error messages
2. Backend `CLIENT_URL` matches frontend URL
3. MongoDB connection string is correct
4. Frontend `VITE_API_URL` is correct

### Issue: "CORS Error"

**Solution:**

1. Render → Environment → Update `CLIENT_URL`
2. Include `https://` prefix
3. No trailing slash
4. Save and redeploy

### Issue: "Real-time updates not working"

**Check:**

1. Socket.IO connecting (check browser console)
2. Backend logs show WebSocket connections
3. Try refresh page

### Issue: Render "Service Unavailable"

**Possible causes:**

1. Free tier sleeping (first request wakes it up, wait 30s)
2. Build failed (check Render logs)
3. Environment variables missing

### Issue: Vercel "Build Failed"

**Check:**

1. Root directory set to `client`
2. `package.json` exists in `client/`
3. Node version compatible (check Vercel build logs)

---

## 📊 Monitoring

### Render Logs

View real-time logs:

```
Dashboard → Your Service → Logs
```

Monitor:

- API requests
- OTP generation (test mode)
- Errors
- WebSocket connections

### Vercel Analytics (Optional)

Enable in Vercel dashboard for:

- Page views
- Performance metrics
- Error tracking

---

## 🔒 Security Checklist

Before going live:

- [ ] `JWT_SECRET` is strong (64+ chars)
- [ ] `ADMIN_PASSWORD` is secure
- [ ] `NODE_ENV=production` on backend
- [ ] MongoDB IP whitelist configured (or allow all for cloud deployment)
- [ ] `.env` files not committed to Git
- [ ] `node_modules/` not committed to Git
- [ ] Rate limiting enabled
- [ ] CORS properly configured

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Backend health endpoint returns 200 OK  
✅ Frontend loads without errors  
✅ OTP login works (test mode)  
✅ Services display correctly  
✅ Subscribe/unsubscribe works  
✅ Transactions appear  
✅ Admin dashboard accessible  
✅ Real-time updates working  
✅ Mobile responsive  
✅ Dark mode works

---

## 📝 Post-Deployment

### Update README

Update live demo URLs in `README.md`:

```markdown
## 🎯 Live Demo

**Frontend:** https://msmp-app.vercel.app  
**Backend API:** https://msmp-api.onrender.com
```

### Final Git Push

```bash
git add README.md
git commit -m "Add live demo URLs"
git push origin main
```

### Share Your Work

Your production URLs:

- **Frontend:** `https://msmp-app.vercel.app`
- **Backend:** `https://msmp-api.onrender.com`
- **GitHub:** `https://github.com/Mr-Akhil12/M.S.M.P`

### Test Credentials

- **Admin Password:** `Password123!`
- **Test MSISDN:** Any valid SA number (27XXXXXXXXX)
- **OTP:** Check terminal logs (test mode) or your phone (production)

---

## 💡 Tips

### Free Tier Limitations

**Render Free Tier:**

- Spins down after 15 min inactivity
- First request after sleep takes ~30s
- 750 hours/month free

**Vercel Free Tier:**

- Unlimited deployments
- 100GB bandwidth/month
- Excellent performance

### Upgrade Recommendations

For production with real users:

**Render:**

- Upgrade to **Starter** ($7/mo)
- Always-on service
- No cold starts

**MongoDB Atlas:**

- Free tier: 512MB storage
- Upgrade if > 1000 users

**EasySendSMS:**

- Pay-as-you-go
- ~R0.25 per SMS

---

## 🆘 Support

**Deployment Issues:**

- Render: [Documentation](https://render.com/docs)
- Vercel: [Documentation](https://vercel.com/docs)

**MongoDB:**

- [Atlas Documentation](https://docs.atlas.mongodb.com/)

**EasySendSMS:**

- [API Documentation](https://www.easysendsms.app/developers)

---

**Deployment complete! 🎉**

Your MSMP application is now live and accessible worldwide!
