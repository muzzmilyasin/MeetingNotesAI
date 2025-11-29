# Hugging Face API Setup Guide 🔧

This guide will walk you through setting up the Hugging Face Inference API for AI-powered meeting summarization.

## Table of Contents

- [Overview](#overview)
- [Step 1: Create Hugging Face Account](#step-1-create-hugging-face-account)
- [Step 2: Generate API Token](#step-2-generate-api-token)
- [Step 3: Configure the Application](#step-3-configure-the-application)
- [Step 4: Test Your Setup](#step-4-test-your-setup)
- [Troubleshooting](#troubleshooting)
- [API Limits & Costs](#api-limits--costs)
- [Alternative Models](#alternative-models)

---

## Overview

Meeting Notes AI uses **Hugging Face Inference API** to generate intelligent summaries of meeting transcriptions. The application uses the **DistilBART** model (`sshleifer/distilbart-cnn-12-6`), which is optimized for abstractive text summarization.

### What is Hugging Face?

Hugging Face is a platform that provides access to thousands of pre-trained AI models. The Inference API allows you to use these models without running them on your own infrastructure.

### Why DistilBART?

- **Fast**: Distilled version is faster than full BART
- **Accurate**: Maintains high-quality summarization
- **Free Tier**: Available on free Hugging Face accounts
- **Lightweight**: Good for meeting summaries (typically 30-130 words)

---

## Step 1: Create Hugging Face Account

1. **Visit Hugging Face**
   - Go to [https://huggingface.co](https://huggingface.co)
   - Click **"Sign Up"** in the top right corner

2. **Create Your Account**
   - Choose email/password or sign up with GitHub/Google
   - Verify your email address when prompted

3. **Complete Profile (Optional)**
   - Add a username and profile information
   - This helps with account identification

---

## Step 2: Generate API Token

An API token is required to authenticate with Hugging Face's Inference API.

### Method 1: Using Web Interface (Recommended)

1. **Navigate to Settings**
   - Click your profile picture in the top right
   - Select **"Settings"** from the dropdown menu

2. **Access Tokens Section**
   - Click **"Access Tokens"** in the left sidebar
   - You'll see a list of existing tokens (empty if first time)

3. **Create New Token**
   - Click **"New token"** button
   - Configure the token:
     - **Name**: Give it a descriptive name (e.g., "Meeting Notes AI")
     - **Type**: Select **"Read"** (read-only access is sufficient)
     - **Role**: Leave as default or select "User"
   
4. **Generate and Copy**
   - Click **"Generate token"**
   - **IMPORTANT**: Copy the token immediately (it starts with `hf_`)
   - The token will look like: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Store it securely - you won't be able to see it again!

### Method 2: Using Hugging Face CLI (Advanced)

If you have the Hugging Face CLI installed:

```bash
# Install Hugging Face CLI (if not installed)
pip install huggingface_hub

# Login and generate token
huggingface-cli login
```

This will open a browser window for authentication and save your token automatically.

---

## Step 3: Configure the Application

### Option A: First-Time Use (Automatic Setup)

1. **Open the Application**
   - Launch Meeting Notes AI in your browser
   - Navigate to the Events page

2. **Record or Add Transcription**
   - Record a meeting or manually add transcription text
   - Click the **"✨ Summarize"** button

3. **Enter API Token**
   - A prompt will appear asking for your Hugging Face API token
   - Paste the token you copied in Step 2
   - Click **OK**

4. **Token Saved**
   - The token is automatically saved in your browser's localStorage
   - You won't need to enter it again (unless you clear browser data)

### Option B: Manual Configuration (Advanced)

If you prefer to set the token before first use:

1. **Open Browser Developer Console**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)

2. **Run Console Command**
   ```javascript
   localStorage.setItem('hf_token', 'YOUR_TOKEN_HERE');
   ```

3. **Replace YOUR_TOKEN_HERE**
   - Paste your actual token from Step 2
   - Press Enter

4. **Verify Token is Set**
   ```javascript
   console.log(localStorage.getItem('hf_token'));
   ```
   - Should display your token

---

## Step 4: Test Your Setup

1. **Create a Test Event**
   - Go to Events page
   - Create a new event with title, location, and date

2. **Add Test Transcription**
   - Use the Record button or manually add text
   - Example transcription:
     ```
     Today we discussed the new project timeline. We decided to push 
     the deadline back by two weeks. John will handle the frontend 
     development, and Sarah will work on the backend. Our next meeting 
     is scheduled for next Monday at 2 PM. We also need to finalize 
     the budget by Friday.
     ```

3. **Generate Summary**
   - Click **"✨ Summarize"** button
   - Wait 20-30 seconds (first request may take longer as model loads)
   - You should see:
     - A concise summary paragraph
     - Key points extracted from the transcription

4. **Verify Results**
   - Summary should be 30-130 words
   - Key points should list main topics discussed
   - If you see an error, check the Troubleshooting section

---

## Troubleshooting

### ❌ "Invalid API token" Error

**Problem**: Token is incorrect or expired

**Solutions**:
1. Verify token is correct (starts with `hf_`)
2. Regenerate token in Hugging Face settings
3. Check token type is set to "Read"
4. Clear browser localStorage and re-enter token:
   ```javascript
   localStorage.removeItem('hf_token');
   ```

### ❌ "Failed to Fetch" Error

**Problem**: Network issue or CORS error

**Solutions**:
1. Check internet connection
2. Ensure you're running on `localhost` or HTTPS (not `file://`)
3. Check browser console for detailed error messages
4. Try disabling browser extensions that might block requests

### ❌ "Model is currently loading" Error

**Problem**: Hugging Face model is cold-starting (first request)

**Solutions**:
1. Wait 30-60 seconds and try again
2. The model stays warm for ~5 minutes after first use
3. This is normal for free tier usage

### ❌ "Rate limit exceeded" Error

**Problem**: Too many requests in a short time

**Solutions**:
1. Wait a few minutes before trying again
2. Free tier has rate limits - see API Limits section
3. Consider upgrading to paid tier for higher limits

### ❌ Summarization Returns Empty Result

**Problem**: Transcription is too short or malformed

**Solutions**:
1. Ensure transcription has at least 50 characters
2. Check transcription has proper punctuation
3. Try with a longer transcription (100+ words)

### ❌ Token Prompt Appears Every Time

**Problem**: Token not saving to localStorage

**Solutions**:
1. Check browser allows localStorage (not in private/incognito mode)
2. Clear browser cache and try again
3. Check browser console for errors
4. Try manual configuration (Option B above)

---

## API Limits & Costs

### Free Tier

- **Rate Limits**: ~30 requests per minute
- **Model Loading**: May take 20-60 seconds on first request (cold start)
- **Request Timeout**: 60 seconds maximum
- **Cost**: **FREE** for reasonable usage

### Paid Tier (Optional)

If you need higher limits:

1. **Visit Hugging Face Billing**
   - Go to [https://huggingface.co/settings/billing](https://huggingface.co/settings/billing)
   - Select a paid plan

2. **Benefits**:
   - Higher rate limits
   - Faster model loading
   - Priority support
   - More concurrent requests

3. **Cost**: Starting at $9/month for Pro tier

**Note**: The free tier is typically sufficient for personal use and small teams.

---

## Alternative Models

The application uses DistilBART by default, but you can configure different models:

### Available Models

1. **DistilBART** (Current)
   - Model: `sshleifer/distilbart-cnn-12-6`
   - Best for: Fast, general-purpose summaries
   - Length: 30-130 words

2. **BART Large**
   - Model: `facebook/bart-large-cnn`
   - Best for: Higher quality, longer summaries
   - Length: 50-200 words

3. **Pegasus**
   - Model: `google/pegasus-xsum`
   - Best for: Very concise summaries
   - Length: 10-50 words

### How to Change Models

Edit `config.js`:

```javascript
const HF_CONFIG = {
    BASE_URL: 'https://api-inference.huggingface.co/models/',
    MODEL_NAME: 'facebook/bart-large-cnn', // Change this line
    // ... rest of config
};
```

### Model Comparison

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| DistilBART | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Quick summaries |
| BART Large | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High-quality summaries |
| Pegasus | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Very concise summaries |

---

## Security Best Practices

### ⚠️ Token Security

1. **Never Share Your Token**
   - Treat it like a password
   - Don't commit it to version control
   - Don't share it publicly

2. **Token Storage**
   - Stored in browser localStorage (encrypted by browser)
   - Only accessible from same domain
   - Cleared when browser data is cleared

3. **Rotate Tokens Regularly**
   - Regenerate tokens every 90 days
   - Revoke old tokens if compromised

4. **Use Read-Only Tokens**
   - Only "Read" permission is needed
   - Don't use tokens with write/admin permissions

### 🔒 Privacy Considerations

- **Transcription Data**: Sent to Hugging Face for summarization
- **Audio Files**: Never uploaded (only text transcription)
- **Storage**: All data stored locally in your browser
- **No Account Linking**: Hugging Face doesn't link requests to your account (with read tokens)

---

## Additional Resources

### Official Documentation

- [Hugging Face Inference API Docs](https://huggingface.co/docs/api-inference/index)
- [DistilBART Model Card](https://huggingface.co/sshleifer/distilbart-cnn-12-6)
- [Hugging Face Community](https://discuss.huggingface.co/)

### Support

- **Hugging Face Support**: [support@huggingface.co](mailto:support@huggingface.co)
- **Documentation Issues**: Open an issue in this repository
- **Community Forum**: [Hugging Face Forums](https://discuss.huggingface.co/)

---

## Quick Reference

### Token Format
```
hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### API Endpoint
```
https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6
```

### Default Model Settings
- Max Length: 130 words
- Min Length: 30 words
- Input Limit: 1000 characters

### Token Storage Key
```
hf_token (in browser localStorage)
```

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or open an issue in the repository.

