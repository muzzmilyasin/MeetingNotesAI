# Hybrid Deployment: GitHub Pages + Render

Host frontend on GitHub Pages (free) and backend on Render (free)!

## Step 1: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and sign up
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variable**: 
     - Key: `HF_API_TOKEN`
     - Value: Your Hugging Face token
5. Click **"Create Web Service"**
6. **Copy your Render URL**: `https://your-app-name.onrender.com`

## Step 2: Update Frontend Config

1. Open `config-api.js`
2. Replace with your Render URL:
   ```javascript
   const API_BACKEND_URL = 'https://your-app-name.onrender.com';
   ```
3. Save the file

## Step 3: Deploy Frontend to GitHub Pages

1. **Commit changes**:
   ```bash
   git add .
   git commit -m "Configure backend URL"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main → / (root)
   - Click Save

3. **Access your app**:
   - Wait 2-3 minutes
   - Visit: `https://yourusername.github.io/meeting-notes-ai`

## How It Works

```
GitHub Pages (Frontend)
    ↓
    ↓ API calls
    ↓
Render (Backend with API key)
    ↓
    ↓ Secure API calls
    ↓
Hugging Face API
```

## Benefits

✅ Frontend on GitHub Pages (free, fast CDN)
✅ Backend on Render (free, secure API key)
✅ No CORS issues
✅ API key never exposed
✅ Both completely free!

## Update Your App

**Frontend changes** (HTML/CSS/JS):
```bash
git add .
git commit -m "Update frontend"
git push
# GitHub Pages auto-updates
```

**Backend changes** (server.js):
```bash
git add .
git commit -m "Update backend"
git push
# Render auto-deploys
```

## Troubleshooting

**"Failed to fetch" error?**
- Check `config-api.js` has correct Render URL
- Verify Render backend is running (not sleeping)
- Check browser console for CORS errors

**Backend sleeping?**
- Free tier sleeps after 15 min inactivity
- First request takes 30-60 sec to wake up
- Subsequent requests are fast

**CORS errors?**
- Make sure server.js has CORS headers (already included)
- Verify Render URL is correct in config-api.js
