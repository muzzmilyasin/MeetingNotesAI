# Quick Start: 3 Steps to Deploy

## ✅ Step 1: Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. New + → Web Service → Connect GitHub repo
3. Add environment variable: `HF_API_TOKEN` = your token
4. Deploy
5. **Copy your URL**: `https://your-app.onrender.com`

## ✅ Step 2: Update Config

Edit `config-api.js`:
```javascript
const API_BACKEND_URL = 'https://your-app.onrender.com';
```

## ✅ Step 3: Deploy Frontend (GitHub Pages)

```bash
git add .
git commit -m "Deploy"
git push origin main
```

Then: Settings → Pages → Deploy from main branch

**Done!** Access at: `https://yourusername.github.io/meeting-notes-ai`

---

## Architecture

```
User Browser
    ↓
GitHub Pages (HTML/CSS/JS)
    ↓
Render Backend (Node.js)
    ↓
Hugging Face API
```

**Both free forever!** 🎉
