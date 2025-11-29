# Application Architecture 📐

This document explains how the Meeting Notes AI application works under the hood.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [File Structure](#file-structure)
- [Data Flow](#data-flow)
- [Core Components](#core-components)
- [Technology Stack](#technology-stack)
- [API Integration](#api-integration)
- [Data Storage](#data-storage)
- [User Interface](#user-interface)
- [Recording & Transcription Flow](#recording--transcription-flow)
- [AI Summarization Flow](#ai-summarization-flow)

---

## Overview

Meeting Notes AI is a **client-side web application** built with vanilla JavaScript. It runs entirely in the browser without requiring a backend server. All data is stored locally in the browser's localStorage.

### Key Design Decisions

1. **Client-Side Only**: No backend required, works offline (except AI summarization)
2. **Local Storage**: All meeting data stored in browser localStorage
3. **Modern Web APIs**: Uses Web Speech API, MediaRecorder API, and Fetch API
4. **Progressive Enhancement**: Works even if some features are unavailable

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Environment                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   HTML/UI    │◄───┤  JavaScript  │───►│  localStorage│  │
│  │  (index.html)│    │   (app.js)   │    │   (browser)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         ▲                    │                               │
│         │                    │                               │
│         └─────────┬──────────┘                               │
│                   │                                          │
│                   ▼                                          │
│          ┌─────────────────┐                                │
│          │   config.js     │                                │
│          │ (Constants/     │                                │
│          │  Configuration) │                                │
│          └─────────────────┘                                │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                  External Services                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │  Web Speech API      │    │  Hugging Face API    │      │
│  │  (Browser Service)   │    │  (AI Summarization)  │      │
│  └──────────────────────┘    └──────────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
Meeting Note AI/
│
├── index.html          # Main HTML structure and UI layout
├── app.js              # Core application logic and state management
├── config.js           # Configuration constants and API settings
├── style.css           # All styling and responsive design
│
├── README.md           # User documentation and setup guide
├── API_SETUP.md        # Detailed Hugging Face API setup instructions
├── ARCHITECTURE.md     # This file - technical documentation
├── LICENSE             # License information
└── .gitignore          # Git ignore rules
```

### File Responsibilities

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| `index.html` | UI structure | ~100 | Page layout, modals, navigation |
| `app.js` | Application logic | ~800 | State management, API calls, event handling |
| `config.js` | Configuration | ~250 | Constants, API endpoints, error messages |
| `style.css` | Styling | ~650 | Responsive design, animations, themes |

---

## Data Flow

### 1. Application Initialization

```
Browser Loads
    │
    ├─► Load index.html
    │       │
    │       ├─► Load style.css
    │       └─► Load config.js (constants)
    │       └─► Load app.js (logic)
    │
    └─► app.js Initialization
            │
            ├─► Load events from localStorage
            ├─► Load folders from localStorage
            ├─► Initialize UI state
            └─► Render home page
```

### 2. Creating an Event

```
User Input (Event Form)
    │
    ├─► addEvent() called
    │       │
    │       ├─► Validate inputs
    │       ├─► Create event object
    │       │       {
    │       │         id: timestamp,
    │       │         title: string,
    │       │         location: string,
    │       │         date: Date,
    │       │         transcription: '',
    │       │         summary: '',
    │       │         keyPoints: [],
    │       │         folderId: null
    │       │       }
    │       │
    │       ├─► Save to events array
    │       ├─► Save to localStorage
    │       └─► Update UI (displayEvents())
```

### 3. Recording & Transcription Flow

```
User Clicks Record
    │
    ├─► toggleRecording(eventId)
    │       │
    │       ├─► Request microphone access
    │       │   (navigator.mediaDevices.getUserMedia)
    │       │
    │       ├─► Initialize MediaRecorder
    │       │       │
    │       │       └─► Start audio recording
    │       │
    │       └─► Initialize Speech Recognition
    │               │
    │               ├─► recognition.onresult
    │               │       │
    │               │       └─► Append transcript chunks
    │               │
    │               └─► recognition.onend
    │                       │
    │                       └─► Save transcription to event
    │                               │
    │                               └─► Update localStorage
    │                               └─► Update UI
```

### 4. AI Summarization Flow

```
User Clicks Summarize
    │
    ├─► summarizeTranscription(eventId)
    │       │
    │       ├─► Get API token (localStorage or prompt)
    │       │
    │       ├─► Prepare API request
    │       │       │
    │       │       ├─► Extract transcription text
    │       │       ├─► Truncate to max length (1000 chars)
    │       │       └─► Build request body
    │       │
    │       ├─► Fetch API call
    │       │   (POST to Hugging Face)
    │       │       │
    │       │       └─► Wait for response (20-60s)
    │       │
    │       ├─► Process response
    │       │       │
    │       │       ├─► Extract summary text
    │       │       ├─► Extract key points
    │       │       └─► Update event object
    │       │
    │       └─► Save to localStorage
    │       └─► Update UI
```

---

## Core Components

### 1. State Management

All application state is managed in `app.js`:

```javascript
// Global State Variables
let events = [];                    // Array of event objects
let folders = [];                   // Array of folder objects
let currentView = 'today';          // Current time filter
let currentFolder = null;           // Selected folder filter
let currentPage = 'home';           // Active page

// Recording State
let mediaRecorder = null;           // MediaRecorder instance
let recognition = null;             // Speech Recognition instance
let currentRecordingEventId = null; // ID of event being recorded
let isPaused = false;               // Pause state
```

### 2. Data Models

#### Event Object
```javascript
{
  id: number,              // Timestamp-based unique ID
  title: string,           // Event title
  location: string,        // Meeting location
  date: Date,             // Date and time object
  transcription: string,   // Voice-to-text transcription
  summary: string,         // AI-generated summary
  keyPoints: string[],     // Extracted key points
  folderId: number|null    // Associated folder ID
}
```

#### Folder Object
```javascript
{
  id: number,        // Timestamp-based unique ID
  name: string,      // Folder name
  icon: string       // Emoji icon (📁, 💼, etc.)
}
```

### 3. Persistence Layer

Uses **browser localStorage** for data persistence:

```javascript
// Storage Keys (from config.js)
STORAGE_KEYS = {
  EVENTS: 'events',
  FOLDERS: 'folders',
  HF_TOKEN: 'hf_token'
}

// Save Example
localStorage.setItem('events', JSON.stringify(events));

// Load Example
events = JSON.parse(localStorage.getItem('events')) || [];
```

**Advantages**:
- No backend required
- Works offline
- Fast access
- Automatic persistence

**Limitations**:
- Browser-specific (not synced across devices)
- Size limit (~5-10MB)
- Cleared when browser data is cleared

---

## Technology Stack

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Structure and semantics | HTML5 |
| CSS3 | Styling and animations | CSS3 |
| JavaScript (ES6+) | Application logic | ES2015+ |
| Web Speech API | Voice-to-text transcription | Browser API |
| MediaRecorder API | Audio recording | Browser API |
| Fetch API | HTTP requests to Hugging Face | Browser API |
| localStorage API | Data persistence | Browser API |

### External Services

| Service | Purpose | API Type |
|---------|---------|----------|
| Hugging Face Inference API | AI text summarization | REST API |
| Google Fonts | Typography (Inter font) | CDN |

### No Build Tools

- **No bundlers** (webpack, rollup, etc.)
- **No transpilers** (Babel, TypeScript)
- **No package managers** (npm, yarn)
- Pure vanilla JavaScript for simplicity

---

## API Integration

### Hugging Face Inference API

**Endpoint**:
```
POST https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6
```

**Request Format**:
```javascript
{
  method: 'POST',
  headers: {
    'Authorization': 'Bearer hf_xxxxxxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inputs: 'transcription text...',
    parameters: {
      max_length: 130,
      min_length: 30,
      do_sample: false
    },
    options: {
      wait_for_model: true
    }
  })
}
```

**Response Format**:
```javascript
[
  {
    summary_text: "Generated summary text here..."
  }
]
```

**Error Handling**:
- 401/403: Invalid token → Clear token, prompt user
- 503: Model loading → Wait and retry
- 429: Rate limit → Show error, wait
- Network errors → Show user-friendly message

---

## Data Storage

### localStorage Structure

```javascript
// Events Storage
localStorage.getItem('events')
// Returns: JSON string of events array

// Folders Storage
localStorage.getItem('folders')
// Returns: JSON string of folders array

// API Token Storage
localStorage.getItem('hf_token')
// Returns: API token string (e.g., "hf_xxxxx")
```

### Data Lifecycle

1. **Create**: User action → Update array → Save to localStorage
2. **Read**: Load from localStorage → Parse JSON → Display in UI
3. **Update**: Modify object → Update array → Save to localStorage
4. **Delete**: Filter array → Save to localStorage → Update UI

### Data Size Considerations

- Average event size: ~2-5KB
- 100 events ≈ 200-500KB
- localStorage limit: ~5-10MB
- **Practical limit**: ~1000-2000 events

---

## User Interface

### Page Structure

```
┌─────────────────────────────────────┐
│         Header (Title)              │
├─────────────────────────────────────┤
│                                     │
│         Page Content                │
│   (Home/Events/Folders)             │
│                                     │
│   ┌───────────────────────────┐    │
│   │    Event Cards           │    │
│   │  ┌─────────────────────┐ │    │
│   │  │ Event Info          │ │    │
│   │  │ Actions             │ │    │
│   │  └─────────────────────┘ │    │
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   [Home] [Events] [Folders]         │
└─────────────────────────────────────┘
```

### Navigation Flow

```
Home Page
  ├─► Today's events only
  │
Events Page
  ├─► Create new events
  ├─► Filter by time (Today/Week/Month)
  └─► Manage all events
  │
Folders Page
  ├─► Create/manage folders
  ├─► Filter events by folder
  └─► Organize meetings
```

---

## Recording & Transcription Flow

### Web Speech API Integration

```javascript
// Initialize
recognition = new SpeechRecognition();
recognition.continuous = true;        // Keep listening
recognition.interimResults = false;   // Only final results

// Event Handlers
recognition.onresult = (event) => {
  // Process speech results
  // Append to transcription string
};

recognition.onend = () => {
  // Save transcription to event
  // Update localStorage
};
```

### MediaRecorder API Integration

```javascript
// Request microphone
stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// Initialize recorder
mediaRecorder = new MediaRecorder(stream);

// Collect audio chunks
mediaRecorder.ondataavailable = (event) => {
  audioChunks.push(event.data);
};

// Stop and cleanup
mediaRecorder.onstop = () => {
  // Stop recognition
  // Release microphone
  // Cleanup resources
};
```

### Pause/Resume Mechanism

```javascript
// Pause
mediaRecorder.pause();      // Pause audio recording
recognition.stop();         // Stop speech recognition

// Resume
mediaRecorder.resume();     // Resume audio recording
recognition.start();        // Restart speech recognition
```

---

## AI Summarization Flow

### Pre-Processing

1. **Extract Transcription**
   ```javascript
   const text = event.transcription;
   ```

2. **Validate Length**
   ```javascript
   if (!text || text.length < 50) {
     // Show error
   }
   ```

3. **Truncate if Necessary**
   ```javascript
   const truncated = text.substring(0, 1000);
   ```

### API Request

```javascript
fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inputs: truncated,
    parameters: {
      max_length: 130,
      min_length: 30
    }
  })
})
```

### Post-Processing

1. **Extract Summary**
   ```javascript
   const summary = result[0].summary_text;
   ```

2. **Extract Key Points**
   ```javascript
   const sentences = transcription.match(/[^.!?]+[.!?]+/g);
   const keyPoints = sentences
     .filter(s => s.length > 20)
     .slice(0, 5);
   ```

3. **Save Results**
   ```javascript
   event.summary = summary;
   event.keyPoints = keyPoints;
   localStorage.setItem('events', JSON.stringify(events));
   ```

---

## Error Handling Strategy

### User-Facing Errors

```javascript
// Error Messages (from config.js)
ERROR_MESSAGES = {
  MICROPHONE_ACCESS_DENIED: '...',
  API_TOKEN_INVALID: '...',
  NO_TRANSCRIPTION: '...'
}

// Usage
try {
  // Risky operation
} catch (error) {
  alert(ERROR_MESSAGES.OPERATION_FAILED);
  console.error('Details:', error);
}
```

### API Error Handling

```javascript
if (!response.ok) {
  if (response.status === 401) {
    // Invalid token
    localStorage.removeItem('hf_token');
    // Prompt for new token
  } else {
    // Other errors
    throw new Error(`API error: ${response.status}`);
  }
}
```

---

## Browser Compatibility

### Feature Support Matrix

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| MediaRecorder | ✅ | ✅ | ✅ | ⚠️ Limited |
| Speech Recognition | ✅ | ✅ | ❌ | ❌ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Fetch API | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| CSS Animations | ✅ | ✅ | ✅ | ✅ |

### Fallback Strategies

1. **Speech Recognition**: Show message if unavailable
2. **MediaRecorder**: Use alternative codecs
3. **localStorage**: Show error if quota exceeded

---

## Performance Considerations

### Optimization Techniques

1. **Lazy Rendering**: Only render visible events
2. **Debouncing**: Debounce search/filter inputs
3. **Local Storage**: Batch writes when possible
4. **API Caching**: Cache API responses (not implemented)

### Memory Management

- Clear event listeners on page navigation
- Release media streams when recording stops
- Clean up recognition instances

---

## Security Considerations

### Data Privacy

- ✅ All data stored locally (no server)
- ✅ API token stored in localStorage (browser-encrypted)
- ⚠️ Transcription sent to Hugging Face (required for summarization)
- ✅ Audio files never uploaded

### API Security

- Use read-only tokens (no write permissions)
- Token validated server-side by Hugging Face
- HTTPS required for API calls

---

## Future Enhancements

### Potential Improvements

1. **Backend Integration**
   - Cloud storage for events
   - Multi-device sync
   - User accounts

2. **Offline Support**
   - Service Workers for offline caching
   - Queue API calls when offline

3. **Advanced Features**
   - Export to PDF/Word
   - Calendar integration
   - Email reminders
   - Search functionality

4. **Performance**
   - Virtual scrolling for large event lists
   - IndexedDB for larger storage
   - Background processing

---

## Debugging Guide

### Common Debugging Techniques

1. **Browser Console**
   ```javascript
   // Check current state
   console.log('Events:', events);
   console.log('Folders:', folders);
   ```

2. **localStorage Inspection**
   ```javascript
   // View stored data
   console.log(localStorage.getItem('events'));
   ```

3. **Network Tab**
   - Monitor API requests
   - Check response status
   - View request/response bodies

4. **Application Tab**
   - Inspect localStorage
   - View stored keys
   - Clear storage if needed

---

## Contributing

See the main README.md for contribution guidelines. When adding features:

1. Update `config.js` for new constants
2. Add error messages to `ERROR_MESSAGES`
3. Document new functions with JSDoc
4. Update this architecture doc for major changes

---

**Last Updated**: 2024
**Version**: 1.0.0

