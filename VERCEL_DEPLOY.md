# Vercel Deployment

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Deploy"
git push origin main
```

## Step 2: Deploy to Vercel

1. Go to vercel.com
2. Sign up with GitHub (FREE, no card!)
3. Import repository
4. Add env variable: `HF_API_TOKEN` = your token
5. Deploy
6. Copy URL: `https://your-project.vercel.app`

## Step 3: Update config-api.js

```javascript
const API_BACKEND_URL = 'https://your-project.vercel.app';
```

## Step 4: Enable GitHub Pages

```bash
git add config-api.js
git commit -m "Update URL"
git push
```

Settings → Pages → Deploy from main

## Done!

Visit: `https://yourusername.github.io/meeting-notes-ai`
