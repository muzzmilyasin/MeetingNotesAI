# Render Deployment - Complete Guide

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Render"
git push origin main
```

## Step 2: Deploy Backend to Render

1. Go to **https://render.com** and sign up (free)
2. Click **"New +" → "Web Service"**
3. Click **"Connect GitHub"** and authorize
4. Select your **meeting-notes-ai** repository
5. Configure:
   - **Name**: `meeting-notes-ai` (or any name)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Click **"Advanced"** → **"Add Environment Variable"**:
   - **Key**: `HF_API_TOKEN`
   - **Value**: Your Hugging Face token (get from https://huggingface.co/settings/tokens)
7. Click **"Create Web Service"**
8. Wait 2-3 minutes for deployment
9. **Copy your Render URL**: `https://your-app-name.onrender.com`

## Step 3: Update Frontend Config

1. Open `config-api.js`
2. Replace `YOUR_APP_NAME` with your actual Render app name:
   ```javascript
   const API_BACKEND_URL = 'https://your-app-name.onrender.com';
   ```
3. Save the file

## Step 4: Deploy Frontend to GitHub Pages

```bash
git add config-api.js
git commit -m "Update backend URL"
git push origin main
```

Then:
1. Go to your GitHub repository
2. **Settings** → **Pages**
3. Source: **Deploy from branch**
4. Branch: **main** → **/ (root)**
5. Click **Save**
6. Wait 2-3 minutes

## Step 5: Access Your App

Visit: `https://YOUR_USERNAME.github.io/meeting-notes-ai`

## Files Needed on Render

- `server.js` ✅
- `package.json` ✅
- `render.yaml` ✅

## Files Needed on GitHub Pages

- `index.html` ✅
- `app.js` ✅
- `config.js` ✅
- `config-api.js` ✅ (with your Render URL)
- `style.css` ✅

## Done! 🎉

Your app is now live with:
- Frontend on GitHub Pages (free)
- Backend on Render (free)
- Secure API key on server
