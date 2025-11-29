# Vercel Deployment - NO CARD REQUIRED! 🎉

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

## Step 2: Deploy to Vercel (FREE, No Card!)

1. Go to **https://vercel.com**
2. Click **"Sign Up"** with GitHub (no card needed!)
3. Click **"Import Project"**
4. Select your **meeting-notes-ai** repository
5. Click **"Import"**
6. Click **"Environment Variables"**:
   - **Name**: `HF_API_TOKEN`
   - **Value**: Your Hugging Face token
7. Click **"Deploy"**
8. Wait 1-2 minutes
9. **Copy your URL**: `https://your-project.vercel.app`

## Step 3: Update Frontend Config

1. Open `config-api.js`
2. Replace with your Vercel URL:
   ```javascript
   const API_BACKEND_URL = 'https://your-project.vercel.app';
   ```

## Step 4: Push & Enable GitHub Pages

```bash
git add config-api.js
git commit -m "Update Vercel URL"
git push origin main
```

Then: Settings → Pages → Deploy from main

## Done! 🚀

Visit: `https://YOUR_USERNAME.github.io/meeting-notes-ai`

## Why Vercel?

✅ **100% FREE** - No card required
✅ **No $1 charge** - Unlike Render
✅ **Fast deployment** - 1-2 minutes
✅ **Auto-deploy** - Push to GitHub = auto update
✅ **Serverless** - Scales automatically

## Files Deployed

**To Vercel** (Backend):
- `server.js` ✅
- `vercel.json` ✅
- `package.json` ✅

**To GitHub Pages** (Frontend):
- All HTML/CSS/JS files ✅
