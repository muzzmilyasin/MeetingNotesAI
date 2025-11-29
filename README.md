# Meeting Notes AI 📝

AI-powered meeting management with voice recording, transcription, and summarization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🎤 **Voice Recording & Transcription** - Real-time speech-to-text
- 🤖 **AI Summarization** - Auto-generate summaries and key points
- 📁 **Folder Organization** - Organize meetings with custom folders
- 📅 **Multiple Views** - Filter by Today, Week, or Month
- 💾 **Local Storage** - All data saved in browser
- 🎨 **Modern UI** - Responsive design with smooth animations

## 🚀 Quick Start

### Local Development

```bash
# Set API token
set HF_API_TOKEN=your_token_here

# Start server
node server.js

# Open browser
http://localhost:3000
```

### Deploy to Render (Recommended)

See [DEPLOY.md](DEPLOY.md) for step-by-step guide.

## 🔧 Setup

1. **Get Hugging Face API Token**
   - Visit https://huggingface.co/settings/tokens
   - Create a free "Read" token

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/meeting-notes-ai.git
   cd meeting-notes-ai
   ```

3. **Run Locally**
   ```bash
   set HF_API_TOKEN=your_token
   node server.js
   ```

4. **Or Deploy to Render**
   - Push to GitHub
   - Connect to Render
   - Add `HF_API_TOKEN` environment variable
   - Deploy!

## 📖 Usage

1. **Create Event** - Add meeting details (title, location, date)
2. **Record** - Click event → Record → Allow microphone
3. **Transcribe** - Speak naturally, see real-time transcription
4. **Summarize** - Click "Summarize" for AI-generated summary

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**: Web Speech API, MediaRecorder API, Hugging Face API
- **Backend**: Node.js (minimal proxy server)
- **Storage**: Browser localStorage

## 🌐 Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Recording | ✅ | ✅ | ✅ | ⚠️ |
| Transcription | ✅ | ✅ | ❌ | ❌ |
| AI Summary | ✅ | ✅ | ✅ | ✅ |

**Best in Chrome/Edge**

## 🔍 Troubleshooting

**"Failed to fetch"?**
- Start server: `node server.js`
- Use `http://localhost:3000` (not file://)

**Transcription not working?**
- Use Chrome or Edge
- Check microphone permissions
- Speak clearly

**Summarization fails?**
- Verify API token is set
- Check internet connection
- Wait 20-30 seconds for first request

## 📁 Project Structure

```
├── index.html          # UI structure
├── app.js              # Application logic
├── config.js           # Configuration
├── config-env.js       # Environment detection
├── style.css           # Styling
├── server.js           # Backend proxy
├── render.yaml         # Render config
└── package.json        # Project metadata
```

## 🔒 Privacy

- All data stored locally in browser
- API token secured on server
- Only transcription text sent to Hugging Face
- No audio files uploaded

## 📄 License

MIT License - Free to use and modify

## 🙏 Credits

- Hugging Face for AI API
- Web Speech API for transcription
