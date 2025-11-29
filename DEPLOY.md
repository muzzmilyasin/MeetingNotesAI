# Deployment Guide

## ⚠️ Important: GitHub Pages Won't Work

Hugging Face API blocks direct browser calls (CORS policy).
You **must** deploy the backend to Render, Railway, or Vercel.

## Quick Deploy to Render (5 minutes, FREE)

### 1. Get API Token
Get free Hugging Face token: https://huggingface.co/settings/tokens

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meeting-notes-ai.git
git push -u origin main
```

### 3. Deploy on Render
1. Go to https://render.com (sign up free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add Environment Variable:
   - Key: `HF_API_TOKEN`
   - Value: `your_huggingface_token`
6. Click "Create Web Service"
7. Wait 2-3 minutes

### 4. Done!
Your app is live at: `https://your-app.onrender.com`

## Local Development

```bash
# Set API token
set HF_API_TOKEN=your_token_here

# Start server
node server.js

# Open browser
http://localhost:3000
```

## Update Your App

```bash
git add .
git commit -m "Update"
git push
# Render auto-deploys!
```

## Troubleshooting

**"Failed to fetch" error?**
- Make sure server is running: `node server.js`
- Check you're using `http://localhost:3000` not opening HTML directly

**Summarization fails?**
- Verify `HF_API_TOKEN` is set in Render Environment Variables
- Check token is valid at https://huggingface.co/settings/tokens

**App sleeps on Render?**
- Free tier sleeps after 15 min inactivity
- First request takes 30-60 sec to wake up
