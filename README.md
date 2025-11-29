# Meeting Notes AI 📝

A professional web application for managing meetings with AI-powered transcription and summarization capabilities. Built with vanilla JavaScript, this app runs entirely in your browser with no backend required.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Setup](#api-setup)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- **🎤 Voice Recording & Transcription**: Record meeting conversations with live real-time speech-to-text conversion
- **📝 Live Transcription Display**: See your words appear instantly as you speak with interim results
- **📜 Scrollable Transcription**: Fixed-height transcription area with smooth scrolling (maintains position during recording)
- **🤖 AI Summarization**: Automatically generate concise summaries and key points using Hugging Face AI
- **📁 Folder Organization**: Organize meetings into custom folders with emoji icons
- **📅 Multiple Views**: Filter and view meetings by Today, This Week, or This Month
- **⏸️ Pause/Resume Recording**: Full control over your recording sessions
- **💾 Persistent Storage**: All data saved locally in browser (no backend required)
- **🗑️ Selective Deletion**: Delete individual recording sections, summaries, or key points

### User Experience
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Core features work without internet (AI summarization requires connection)
- **No Account Required**: Use immediately without sign-up
- **Privacy-Focused**: All data stored locally in your browser

---

## 📸 Screenshots

*Add screenshots of your application here*

---

## 🚀 Quick Start

### Option 1: Run Locally (Recommended)

1. **Clone or Download** the repository
2. **Navigate** to the project folder
3. **Start a local server**:
   ```bash
   # Using Python (pre-installed on most systems)
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server -p 8000
   ```
4. **Open** `http://localhost:8000` in your browser

### Option 2: Use npm Scripts

If you have Node.js installed:

```bash
npm start           # Start Python server
npm run serve       # Start Node.js server
npm run serve:python  # Explicitly use Python
npm run serve:node    # Explicitly use Node.js
```

### Option 3: GitHub Pages

1. Fork this repository
2. Go to Settings → Pages
3. Select main branch → Save
4. Access at `https://yourusername.github.io/meeting-notes-ai`

---

## 📦 Installation

### Prerequisites

- **Modern Web Browser**: Chrome, Edge, or Firefox recommended
- **Microphone Access**: For voice recording feature
- **Internet Connection**: Required for AI summarization (optional for other features)
- **Local Server**: Python 3.x or Node.js (for running locally)

### Step-by-Step Setup

1. **Download or Clone**
   ```bash
   git clone https://github.com/yourusername/meeting-notes-ai.git
   cd meeting-notes-ai
   ```

2. **File Structure**
   ```
   Meeting Note AI/
   ├── index.html          # Main HTML structure
   ├── app.js              # Core application logic
   ├── config.js           # Configuration and constants
   ├── style.css           # Styling and animations
   ├── package.json        # Project metadata
   ├── README.md           # This file
   ├── API_SETUP.md        # Hugging Face API setup guide
   ├── ARCHITECTURE.md     # Technical documentation
   └── LICENSE             # License information
   ```

3. **API Setup** (Required for AI Summarization)
   - See [API Setup](#api-setup) section below
   - Detailed guide: [API_SETUP.md](API_SETUP.md)

4. **Run the Application**
   - Follow [Quick Start](#quick-start) instructions above

---

## 🔧 API Setup

### Hugging Face API Token (Required)

To use the AI summarization feature, you need a free Hugging Face API token:

1. **Create Account**
   - Visit [https://huggingface.co](https://huggingface.co)
   - Sign up for a free account

2. **Generate Token**
   - Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
   - Click "New token"
   - Name: "Meeting Notes AI"
   - Type: **Read** (read-only access is sufficient)
   - Click "Generate token"
   - **Copy the token** (starts with `hf_`)

3. **Enter Token in App**
   - Open the application
   - Click "Summarize" on any event
   - Paste your token when prompted
   - Token is saved automatically for future use

📖 **For detailed setup instructions, see [API_SETUP.md](API_SETUP.md)**

### API Configuration

- **Model**: `sshleifer/distilbart-cnn-12-6` (DistilBART)
- **Endpoint**: `https://api-inference.huggingface.co/models/`
- **Rate Limit**: Free tier allows reasonable usage (~30 requests/minute)
- **Cost**: **FREE** for personal use

---

## 📖 Usage Guide

### First Time Setup

1. Open the application in your browser
2. When you click "Summarize" for the first time, enter your Hugging Face API token
3. The token is saved automatically (stored in browser localStorage)

### Creating Events

1. Navigate to **Events** tab (bottom navigation)
2. Fill in the event form:
   - **Title**: Meeting name (e.g., "Team Standup")
   - **Location**: Meeting location (e.g., "Conference Room A")
   - **Date & Time**: Select date and time
3. Click **"Add Event"**

### Recording Meetings

1. Click on any event card to open the event details modal
2. Click **🎤 Record** button in the modal
3. **Allow microphone access** when prompted by browser
4. **Speak naturally** - transcription appears in real-time as you speak
5. **Scroll through transcription** while recording - your position is maintained
6. Use **⏸️ Pause** to pause/resume recording
7. Click **⏹️ Stop** when finished
8. Transcription is automatically saved

**Note**: 
- Works best in Chrome or Edge browsers. Firefox and Safari have limited speech recognition support.
- Only microphone audio is transcribed. System audio transcription is not supported in web browsers due to browser API limitations.

### AI Summarization

1. After recording, open the event details modal
2. Scroll down below the transcription
3. Click **✨ Summarize Transcription** button
4. **Wait 20-30 seconds** for AI processing
   - First request may take longer (model loading)
   - Subsequent requests are faster
5. View the generated results (displayed at the top of the modal):
   - **Summary**: Concise overview with teal background (30-130 words)
   - **Key Points**: Extracted important points with amber background
6. Summary and key points remain visible above the transcription for easy access

### Organizing with Folders

1. Navigate to **Folders** tab
2. **Select an emoji icon** from the picker
3. **Enter folder name** (e.g., "Work Projects")
4. Click **"Create Folder"**
5. To add events to folders:
   - Click **📂 Add to Folder** on any event
   - Select the desired folder from the modal

### Viewing Meetings

- **🏠 Home**: Shows today's scheduled meetings only
- **📅 Events**: All meetings with time filters (Today/Week/Month)
- **📁 Folders**: Meetings organized by custom folders

---

## 📁 Project Structure

```
Meeting Note AI/
│
├── index.html          # Main HTML structure and UI layout
├── app.js              # Core application logic (800+ lines)
│                       # - State management
│                       # - Event handling
│                       # - API integration
│                       # - UI updates
│
├── config.js           # Configuration constants (250+ lines)
│                       # - API endpoints
│                       # - Storage keys
│                       # - Error messages
│                       # - Validation rules
│
├── style.css           # Styling and animations (650+ lines)
│                       # - Responsive design
│                       # - Theme colors
│                       # - Animations
│
├── package.json        # Project metadata and npm scripts
│
├── README.md           # This file - user documentation
├── API_SETUP.md        # Detailed Hugging Face API setup guide
├── ARCHITECTURE.md     # Technical architecture documentation
├── LICENSE             # License information
└── .gitignore          # Git ignore rules
```

### File Responsibilities

| File | Purpose | Key Features |
|------|---------|--------------|
| `index.html` | UI structure | Page layout, modals, navigation |
| `app.js` | Application logic | State management, API calls, event handling |
| `config.js` | Configuration | Constants, API settings, error messages |
| `style.css` | Styling | Responsive design, animations, themes |

---

## 🛠️ Technology Stack

### Frontend Technologies

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Application logic and API integration
- **Web Speech API**: Real-time voice-to-text transcription
- **MediaRecorder API**: Audio recording from microphone
- **Fetch API**: HTTP requests to Hugging Face API
- **localStorage API**: Client-side data persistence

### External Services

- **Hugging Face Inference API**: AI-powered text summarization
  - Model: `sshleifer/distilbart-cnn-12-6` (DistilBART)
  - Type: Abstractive summarization
- **Google Fonts**: Inter font family (via CDN)

### Development Tools

- **No Build Tools**: Pure vanilla JavaScript
- **No Dependencies**: Zero external libraries required
- **Local Server**: Python/Node.js for development

---

## 🌐 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Voice Recording | ✅ | ✅ | ✅ | ⚠️ Limited |
| Speech Recognition | ✅ | ✅ | ❌ | ❌ |
| AI Summarization | ✅ | ✅ | ✅ | ✅ |
| Local Storage | ✅ | ✅ | ✅ | ✅ |
| Responsive UI | ✅ | ✅ | ✅ | ✅ |

**Recommended Browsers**: Chrome or Edge for full feature support.

**Note**: 
- Speech recognition works best in Chrome/Edge. Firefox and Safari have limited or no support for the Web Speech API.
- Live transcription with interim results is enabled for real-time feedback.
- System audio transcription is not supported due to browser API limitations - only microphone input can be transcribed.

---

## 🔍 Troubleshooting

### Common Issues

#### Microphone Not Working
- ✅ Check browser permissions (click lock icon in address bar)
- ✅ Ensure microphone is connected and working
- ✅ Try using HTTPS or localhost (required by some browsers)
- ✅ Grant microphone access in browser settings

#### Transcription Not Working
- ✅ Use Chrome or Edge browser (best support)
- ✅ Check microphone permissions
- ✅ Speak clearly and at normal volume
- ✅ Ensure stable internet connection (for speech recognition service)
- ✅ Note: Only microphone audio is transcribed - system audio is not supported in browsers

#### Transcription Jumps to Top While Recording
- ✅ This has been fixed - scroll position is now maintained during live transcription
- ✅ If issue persists, try refreshing the page

#### AI Summarization Fails
- ✅ Verify your API token is correct (starts with `hf_`)
- ✅ Check internet connection
- ✅ Wait for model to load (first request takes 20-60 seconds)
- ✅ Ensure transcription text exists and is not empty
- ✅ Try again if rate limit error appears

#### "Failed to Fetch" Error
- ✅ Run app from localhost or HTTPS (not `file://`)
- ✅ Check if Hugging Face API is accessible
- ✅ Verify API token is valid
- ✅ Check browser console for detailed error messages

#### Token Prompt Appears Every Time
- ✅ Check browser allows localStorage (not in private/incognito mode)
- ✅ Clear browser cache and try again
- ✅ Check browser console for errors

### Getting More Help

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review [API_SETUP.md](API_SETUP.md) for API-related issues
3. Check browser console (F12) for error messages
4. Verify all prerequisites are met
5. Test in Chrome/Edge browser
6. Open an issue on GitHub

---

## 📚 Documentation

### User Documentation

- **[README.md](README.md)** (This file): Getting started and usage guide
- **[API_SETUP.md](API_SETUP.md)**: Detailed Hugging Face API setup instructions
  - Creating Hugging Face account
  - Generating API tokens
  - Configuration options
  - Troubleshooting API issues

### Technical Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Technical architecture and implementation details
  - System architecture
  - Data flow diagrams
  - Component breakdown
  - API integration details
  - Browser compatibility notes

### Code Documentation

- **Inline Comments**: All functions documented with JSDoc
- **config.js**: Well-commented configuration constants
- **style.css**: Section comments explaining styling

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add comments**: Document new functions and features
5. **Test thoroughly**: Ensure all features work correctly
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and structure
- Add JSDoc comments to new functions
- Update documentation for new features
- Test in multiple browsers
- Keep code readable and maintainable

### Ideas for Contributions

- 🐛 Bug fixes
- ✨ New features (see Future Enhancements)
- 📖 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌐 Multi-language support
- 📱 Mobile optimizations

---

## 🔒 Data Privacy

### What Data is Stored?

- **Locally (in browser)**:
  - All meeting events (title, location, date)
  - Voice transcriptions
  - AI-generated summaries and key points
  - Folder organization
  - API token (encrypted by browser)

- **Sent to Hugging Face**:
  - Transcription text only (for summarization)
  - No audio files
  - No personal information

### Privacy Features

- ✅ All data stored locally in your browser
- ✅ No account creation required
- ✅ No data synced to external servers
- ✅ API token stored securely in browser
- ✅ Audio recordings never uploaded
- ✅ Clear browser data to delete everything

### Security Best Practices

- Use read-only Hugging Face API tokens
- Don't share your API token
- Clear browser data regularly if needed
- Use HTTPS when possible

---

## 🚀 Future Enhancements

Planned features and improvements:

- [ ] Export meetings to PDF/Word documents
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Multi-language support for transcription
- [ ] Cloud sync option (optional)
- [ ] Meeting reminders and notifications
- [ ] Advanced search functionality
- [ ] Collaborative features (share folders)
- [ ] Dark mode theme
- [ ] Mobile app version
- [ ] Offline mode with service workers

Have a feature request? [Open an issue](https://github.com/yourusername/meeting-notes-ai/issues)!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Free to use and modify for personal and commercial projects.**

---

## 💬 Support

### Need Help?

1. **Check Documentation**:
   - [README.md](README.md) - Getting started
   - [API_SETUP.md](API_SETUP.md) - API setup guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details

2. **Troubleshooting**:
   - Review the [Troubleshooting](#troubleshooting) section
   - Check browser console (F12) for errors
   - Verify API token is correct

3. **Get Support**:
   - Open an issue on GitHub
   - Check existing issues for solutions
   - Contribute improvements via pull requests

### Community

- ⭐ Star the repository if you find it useful
- 🐛 Report bugs by opening issues
- 💡 Suggest features via issues
- 🤝 Contribute code improvements

---

## 🙏 Acknowledgments

- **Hugging Face** for providing free AI inference API
- **Web Speech API** developers for browser speech recognition
- **Inter Font** from Google Fonts

---

**Version**: 1.0.0  
**Last Updated**: 2025

---
