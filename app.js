/**
 * Meeting Notes AI - Main Application Logic
 * 
 * This application manages meeting events with voice recording, transcription,
 * and AI-powered summarization capabilities.
 * 
 * @fileoverview Main application controller handling all user interactions,
 * data management, API communications, and UI updates.
 * 
 * @author Muzzamil Yasin
 * @version 1.0.0
 * @requires config.js - Application configuration and constants
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Application Data Storage
 * All data persists in browser's localStorage for offline access
 */

// Load events from localStorage or initialize empty array
// Events contain: id, title, location, date, transcription, summary, keyPoints, folderId
let events = JSON.parse(localStorage.getItem(STORAGE_KEYS?.EVENTS || 'events')) || [];

// Load folders from localStorage or initialize empty array
// Folders contain: id, name, icon (emoji)
let folders = JSON.parse(localStorage.getItem(STORAGE_KEYS?.FOLDERS || 'folders')) || [];

// ============================================================================
// NAVIGATION STATE
// ============================================================================

/**
 * Current view filter for events
 * @type {string} - One of: 'today', 'week', 'month'
 */
let currentView = VIEW_TYPES?.TODAY || 'today';

/**
 * Currently selected folder ID for filtering events
 * @type {number|null} - Folder ID or null for all events
 */
let currentFolder = null;

/**
 * Currently active page in the application
 * @type {string} - One of: 'home', 'events', 'folders'
 */
let currentPage = PAGE_TYPES?.HOME || 'home';

// ============================================================================
// RECORDING STATE
// ============================================================================

/**
 * MediaRecorder instance for audio recording
 * @type {MediaRecorder|null}
 */
let mediaRecorder = null;

/**
 * Array of audio data chunks collected during recording
 * @type {Blob[]}
 */
let audioChunks = [];

/**
 * ID of the event currently being recorded
 * @type {number|null}
 */
let currentRecordingEventId = null;

/**
 * Web Speech Recognition instance for real-time transcription
 * @type {SpeechRecognition|null}
 */
let recognition = null;

/**
 * Flag indicating if recording is currently paused
 * @type {boolean}
 */
let isPaused = false;

// ============================================================================
// FOLDER CUSTOMIZATION
// ============================================================================

/**
 * Currently selected emoji for new folder creation
 * @type {string}
 */
let selectedEmoji = DEFAULT_FOLDER_ICON || '📁';

/**
 * Available emoji options for folders
 * Uses config constant if available, otherwise defaults to array
 * @type {string[]}
 */
const emojis = FOLDER_EMOJIS || ['📁', '💼', '🏠', '🎓', '💡', '🎯', '📊', '🔥', '⭐', '🎨', '🏆', '📱', '💻', '🚀', '🎉'];

// ============================================================================
// FOLDER MANAGEMENT
// ============================================================================

function selectEmoji(emoji, clickEvent) {
    selectedEmoji = emoji;
    document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
    if (clickEvent && clickEvent.target) {
        clickEvent.target.classList.add('selected');
    }
}

function addFolder() {
    const nameInput = document.getElementById('folderName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert(ERROR_MESSAGES?.FOLDER_NAME_REQUIRED || 'Enter folder name');
        return;
    }
    
    if (VALIDATION && name.length > VALIDATION.MAX_FOLDER_NAME_LENGTH) {
        alert(`Folder name must be less than ${VALIDATION.MAX_FOLDER_NAME_LENGTH} characters`);
        return;
    }
    
    const newFolder = {
        id: Date.now(),
        name: name,
        icon: selectedEmoji
    };
    
    folders.push(newFolder);
    
    const storageKey = STORAGE_KEYS?.FOLDERS || 'folders';
    localStorage.setItem(storageKey, JSON.stringify(folders));
    
    nameInput.value = '';
    displayFolders();
}

function deleteFolder(id) {
    const folder = folders.find(f => f.id === id);
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = `Delete folder "${folder.name}"?`;
    modal.style.display = 'flex';
    window.confirmDeleteId = id;
    window.confirmDeleteType = 'folder';
}

function selectFolder(id) {
    currentFolder = id;
    displayFolders();
    displayFolderEvents();
}

function addEventToFolder(eventId) {
    if (folders.length === 0) {
        alert('Create a folder first');
        return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event.folderIds) event.folderIds = [];
    
    const modal = document.getElementById('folderModal');
    const folderList = document.getElementById('modalFolderList');
    
    folderList.innerHTML = folders.map(f => {
        const isInFolder = event.folderIds.includes(f.id);
        return `
        <div class="modal-folder-item" onclick="toggleFolderForEvent(${eventId}, ${f.id})">
            <span>${f.icon} ${f.name}</span>
            ${isInFolder ? '<span style="color: #48bb78; font-weight: bold;">✓</span>' : ''}
        </div>
    `}).join('');
    
    modal.style.display = 'flex';
}

function toggleFolderForEvent(eventId, folderId) {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (!events[eventIndex].folderIds) events[eventIndex].folderIds = [];
    
    const idx = events[eventIndex].folderIds.indexOf(folderId);
    if (idx > -1) {
        events[eventIndex].folderIds.splice(idx, 1);
    } else {
        events[eventIndex].folderIds.push(folderId);
    }
    
    const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
    localStorage.setItem(eventsKey, JSON.stringify(events));
    addEventToFolder(eventId);
}

function closeModal() {
    const modal = document.getElementById('folderModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'slideOut 0.3s';
    
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.style.animation = '';
    }, 300);
}

window.onclick = function(event) {
    const folderModal = document.getElementById('folderModal');
    const confirmModal = document.getElementById('confirmModal');
    const addEventModal = document.getElementById('addEventModal');
    const emojiModal = document.getElementById('emojiModal');
    if (event.target === folderModal) {
        folderModal.style.display = 'none';
    }
    if (event.target === confirmModal) {
        confirmModal.style.display = 'none';
    }
    if (event.target === addEventModal) {
        closeAddEventModal();
    }
    if (event.target === emojiModal) {
        closeEmojiModal();
    }
}

function displayFolders() {
    const container = document.getElementById('foldersContainer');
    const emojiPicker = document.getElementById('emojiPicker');
    
    container.innerHTML = `
        <div class="folder-item ${!currentFolder ? 'active' : ''}" onclick="selectFolder(null)">
            <span>📋 All</span>
        </div>
        ${folders.map(f => `
            <div class="folder-item ${currentFolder === f.id ? 'active' : ''}" onclick="selectFolder(${f.id})">
                <span>${f.icon} ${f.name}</span>
                <button class="folder-delete" onclick="event.stopPropagation(); deleteFolder(${f.id});">×</button>
            </div>
        `).join('')}
    `;
    
    // Calculate how many emojis can fit
    const pickerWidth = emojiPicker.offsetWidth || 300;
    const emojiWidth = 52; // min-width (44) + gap (8)
    const plusBtnWidth = 52;
    const maxEmojis = Math.floor((pickerWidth - 16) / emojiWidth); // Subtract padding
    
    // If all emojis fit, show all. Otherwise show (maxEmojis - 1) + plus button
    const canFitAll = emojis.length <= maxEmojis;
    const visibleCount = canFitAll ? emojis.length : Math.max(1, maxEmojis - 1);
    
    emojiPicker.innerHTML = emojis.slice(0, visibleCount).map(e => 
        `<span class="emoji-option ${e === selectedEmoji ? 'selected' : ''}" onclick="selectEmoji('${e}', event)">${e}</span>`
    ).join('') + (!canFitAll ? '<button class="emoji-plus-btn" onclick="openEmojiModal()">+</button>' : '');
}

function openEmojiModal() {
    const modal = document.getElementById('emojiModal');
    const grid = document.getElementById('emojiModalGrid');
    
    grid.innerHTML = emojis.map(e => 
        `<span class="emoji-option ${e === selectedEmoji ? 'selected' : ''}" onclick="selectEmojiFromModal('${e}')">${e}</span>`
    ).join('');
    
    modal.style.display = 'flex';
}

function closeEmojiModal() {
    const modal = document.getElementById('emojiModal');
    modal.style.display = 'none';
}

function selectEmojiFromModal(emoji) {
    selectedEmoji = emoji;
    closeEmojiModal();
    displayFolders();
}

// ============================================================================
// EVENT MANAGEMENT
// ============================================================================

function addEvent() {
    const titleInput = document.getElementById('eventTitle');
    const locationInput = document.getElementById('eventLocation');
    const dateInput = document.getElementById('eventDate');
    
    const title = titleInput.value.trim();
    const location = locationInput.value.trim();
    const date = dateInput.value;

    if (!title || !location || !date) {
        alert(ERROR_MESSAGES?.INVALID_EVENT_DATA || 'Please fill all fields');
        return;
    }
    
    if (VALIDATION) {
        if (title.length < VALIDATION.MIN_EVENT_TITLE_LENGTH || 
            title.length > VALIDATION.MAX_EVENT_TITLE_LENGTH) {
            alert(`Title must be between ${VALIDATION.MIN_EVENT_TITLE_LENGTH} and ${VALIDATION.MAX_EVENT_TITLE_LENGTH} characters`);
            return;
        }
    }

    const newEvent = {
        id: Date.now(),
        title: title,
        location: location,
        date: new Date(date),
        transcription: '',
        summary: '',
        keyPoints: [],
        folderIds: []
    };

    events.push(newEvent);

    const storageKey = STORAGE_KEYS?.EVENTS || 'events';
    localStorage.setItem(storageKey, JSON.stringify(events));
    
    titleInput.value = '';
    locationInput.value = '';
    dateInput.value = '';

    displayEvents();
}

function deleteEvent(id) {
    const modal = document.getElementById('confirmModal');
    const eventTitle = events.find(e => e.id === id)?.title || 'this event';
    document.getElementById('confirmMessage').textContent = `Delete "${eventTitle}"?`;
    
    modal.style.display = 'flex';
    window.confirmDeleteId = id;
}

function confirmDelete() {
    closeConfirmModal();
    
    if (window.confirmDeleteType === 'folder') {
        folders = folders.filter(f => f.id !== window.confirmDeleteId);
        events.forEach(e => {
            if (!e.folderIds) e.folderIds = [];
            e.folderIds = e.folderIds.filter(fid => fid !== window.confirmDeleteId);
        });
        localStorage.setItem('folders', JSON.stringify(folders));
        const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
        localStorage.setItem(eventsKey, JSON.stringify(events));
        currentFolder = null;
        displayFolders();
        displayEvents();
    } else if (window.confirmDeleteType === 'transcription') {
        const eventIndex = events.findIndex(e => e.id === window.confirmDeleteId);
        if (eventIndex !== -1) {
            events[eventIndex].transcription = '';
            const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
            localStorage.setItem(eventsKey, JSON.stringify(events));
            closeEventDetails();
        }
    } else if (window.confirmDeleteType === 'summary') {
        const eventIndex = events.findIndex(e => e.id === window.confirmDeleteId);
        if (eventIndex !== -1) {
            events[eventIndex].summary = '';
            const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
            localStorage.setItem(eventsKey, JSON.stringify(events));
            closeEventDetails();
        }
    } else if (window.confirmDeleteType === 'keypoints') {
        const eventIndex = events.findIndex(e => e.id === window.confirmDeleteId);
        if (eventIndex !== -1) {
            events[eventIndex].keyPoints = [];
            const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
            localStorage.setItem(eventsKey, JSON.stringify(events));
            closeEventDetails();
        }
    } else if (window.confirmDeleteType === 'section') {
        const eventIndex = events.findIndex(e => e.id === window.confirmDeleteId);
        if (eventIndex !== -1) {
            const sections = events[eventIndex].transcription.split(/\n\n\n/);
            sections.splice(window.confirmDeleteSection, 1);
            events[eventIndex].transcription = sections.join('\n\n\n');
            const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
            localStorage.setItem(eventsKey, JSON.stringify(events));
            closeEventDetails();
        }
    } else {
        const cards = document.querySelectorAll('.event-card');
        let targetCard = null;
        
        cards.forEach(card => {
            if (card.querySelector(`[onclick*="deleteEvent(${window.confirmDeleteId})"]`)) {
                targetCard = card;
            }
        });
        
        if (targetCard) {
            targetCard.classList.add('deleting');
            setTimeout(() => {
                events = events.filter(e => e.id !== window.confirmDeleteId);
                const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
                localStorage.setItem(eventsKey, JSON.stringify(events));
                displayEvents();
                displayFolderEvents();
            }, 300);
        } else {
            events = events.filter(e => e.id !== window.confirmDeleteId);
            const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
            localStorage.setItem(eventsKey, JSON.stringify(events));
            displayEvents();
            displayFolderEvents();
        }
    }
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

function switchView(view) {
    currentView = view;
    currentFolder = null;
    
    document.querySelectorAll('.view-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayEvents();
}

function renderTranscription(transcription, eventId) {
    const sections = transcription.split(/\n\n\n/);
    return sections.map((section, idx) => {
        if (section.trim()) {
            return `<div class="transcript-section">${section.replace(/\n/g, '<br>')}<button class="clear-section" onclick="deleteSection(${eventId}, ${idx})" title="Delete this section">×</button></div>`;
        }
        return '';
    }).join('');
}

function displayEvents() {
    const containerId = currentPage === 'events' ? 'eventsPageContainer' : 'eventsContainer';
    const container = document.getElementById(containerId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let filtered = events.map(e => ({...e, date: new Date(e.date)}));
    
    if (currentFolder !== null) {
        filtered = filtered.filter(e => e.folderIds && e.folderIds.includes(currentFolder));
    }

    if (currentView === 'today') {
        filtered = filtered.filter(e => {
            const eventDate = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
            return eventDate.getTime() === today.getTime();
        });
    } else if (currentView === 'week') {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        filtered = filtered.filter(e => e.date >= today && e.date < weekEnd);
    } else if (currentView === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filtered = filtered.filter(e => e.date >= monthStart && e.date <= monthEnd);
    }

    filtered.sort((a, b) => a.date - b.date);

    if (filtered.length === 0) {
        if (currentPage === 'home') {
            container.innerHTML = '<div class="no-events">No meetings scheduled for today<br><a href="#" onclick="switchPage(\'events\'); return false;" class="no-events-link">Go to Events to set up a meeting</a></div>';
        } else {
            container.innerHTML = '<div class="no-events">No events scheduled</div>';
        }
        return;
    }

    container.innerHTML = filtered.map(e => `
        <div class="event-card" onclick="showEventDetails(${e.id})" style="cursor: pointer;">
            <div class="event-info">
                <h3>${e.title}</h3>
                <p>📍 ${e.location}</p>
                <p>📅 ${e.date.toLocaleString()}</p>
            </div>
            <div class="event-actions" onclick="event.stopPropagation();">
                <button class="add-to-folder-btn" onclick="addEventToFolder(${e.id})">📂 Add to Folder</button>
                <button class="delete-btn" onclick="deleteEvent(${e.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// VOICE RECORDING & TRANSCRIPTION
// ============================================================================

async function toggleRecording(eventId) {
    const btn = document.getElementById(`record-${eventId}`);
    const pauseBtn = document.getElementById(`pause-${eventId}`);
    
    if (currentRecordingEventId === eventId) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (btn) {
            btn.textContent = '🎤 Record';
            btn.style.background = '';
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
        currentRecordingEventId = null;
        isPaused = false;
    } 
    else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            currentRecordingEventId = eventId;
            isPaused = false;

            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = SPEECH_CONFIG?.CONTINUOUS ?? true;
            recognition.interimResults = true;
            if (SPEECH_CONFIG?.LANGUAGE) {
                recognition.lang = SPEECH_CONFIG.LANGUAGE;
            }

            const existingEvent = events.find(e => e.id === eventId);
            const timestamp = new Date().toLocaleTimeString();
            let transcription = existingEvent?.transcription ? existingEvent.transcription + `\n\n\n[${timestamp}]\n` : `[${timestamp}]\n`;
            let savedTranscription = transcription;

            recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        transcription += transcript + ' ';
                        savedTranscription = transcription;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                const eventIndex = events.findIndex(e => e.id === eventId);
                if (eventIndex !== -1) {
                    events[eventIndex].transcription = (savedTranscription + interimTranscript).trim();
                }
                
                const modal = document.getElementById('eventDetailsModal');
                const content = document.getElementById('eventDetailsContent');
                if (modal && modal.style.display === 'flex') {
                    const currentScroll = content.scrollTop;
                    showEventDetails(eventId);
                    content.scrollTop = currentScroll;
                }
            };

            recognition.onend = () => {
                if (isPaused || currentRecordingEventId !== eventId) {
                    return;
                }
            };

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                recognition.stop();
                stream.getTracks().forEach(track => track.stop());
                
                setTimeout(() => {
                    const eventIndex = events.findIndex(e => e.id === eventId);
                    if (eventIndex !== -1 && savedTranscription) {
                        events[eventIndex].transcription = savedTranscription.trim();
                        const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
                        localStorage.setItem(eventsKey, JSON.stringify(events));
                        displayEvents();
                        displayFolderEvents();
                        
                        const modal = document.getElementById('eventDetailsModal');
                        if (modal && modal.style.display === 'flex') {
                            showEventDetails(eventId);
                        }
                    }
                }, 500);
            };

            mediaRecorder.start();
            recognition.start();
            if (btn) {
                btn.textContent = '⏹️ Stop';
                btn.style.background = '#fc8181';
            }
            if (pauseBtn) pauseBtn.style.display = 'block';
        } catch (err) {
            console.error('Microphone access error:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                alert('No microphone found. Please connect a microphone and try again.');
            }
        }
    }
}

function pauseRecording(eventId) {
    const pauseBtn = document.getElementById(`pause-${eventId}`);
    
    if (isPaused) {
        mediaRecorder.resume();
        recognition.start();
        pauseBtn.textContent = '⏸️ Pause';
        pauseBtn.style.background = '';
        isPaused = false;
    } else {
        mediaRecorder.pause();
        recognition.stop();
        pauseBtn.textContent = '▶️ Resume';
        pauseBtn.style.background = '#4299e1';
        isPaused = true;
    }
}

// ============================================================================
// AI SUMMARIZATION
// ============================================================================

function deleteSection(eventId, sectionIndex) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = 'Delete this recording section?';
    modal.style.display = 'flex';
    window.confirmDeleteId = eventId;
    window.confirmDeleteSection = sectionIndex;
    window.confirmDeleteType = 'section';
}

function clearTranscription(eventId) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = 'Delete ALL transcription notes?';
    modal.style.display = 'flex';
    window.confirmDeleteId = eventId;
    window.confirmDeleteType = 'transcription';
}

function clearSummary(eventId) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = 'Delete summary?';
    modal.style.display = 'flex';
    window.confirmDeleteId = eventId;
    window.confirmDeleteType = 'summary';
}

function clearKeyPoints(eventId) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = 'Delete key points?';
    modal.style.display = 'flex';
    window.confirmDeleteId = eventId;
    window.confirmDeleteType = 'keypoints';
}

function deleteSummary(eventId) {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex].summary = '';
        events[eventIndex].keyPoints = [];
    const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
    localStorage.setItem(eventsKey, JSON.stringify(events));
        displayEvents();
    }
}

async function summarizeTranscription(eventId) {
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        console.error('Event not found:', eventId);
        return;
    }
    
    if (!event.transcription || event.transcription.trim().length === 0) {
        alert(ERROR_MESSAGES?.NO_TRANSCRIPTION || 'No transcription found. Please record a meeting first.');
        return;
    }

    const GEMINI_API_KEY = localStorage.getItem('gemini_api_key');
    if (!GEMINI_API_KEY) {
        const key = prompt('Enter your Gemini API key:');
        if (!key) return;
        localStorage.setItem('gemini_api_key', key);
        summarizeTranscription(eventId);
        return;
    }

    const btn = document.querySelector(`button[onclick="summarizeTranscription(${eventId})"]`);
    if (!btn) {
        console.error('Summarize button not found for event:', eventId);
        return;
    }
    
    btn.textContent = '⏳ Summarizing...';
    btn.disabled = true;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Summarize the following meeting notes in 2-3 concise sentences:\n\n${event.transcription}`
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';
        
        const sentences = event.transcription.match(/[^.!?]+[.!?]+/g) || [];
        const minKeyPointLength = VALIDATION?.MIN_KEY_POINT_LENGTH || 20;
        const maxKeyPoints = VALIDATION?.MAX_KEY_POINTS || 5;
        
        const keyPoints = sentences
            .filter(s => s.trim().length >= minKeyPointLength)
            .slice(0, maxKeyPoints)
            .map(s => s.trim());

        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            events[eventIndex].summary = summary;
            events[eventIndex].keyPoints = keyPoints;
            
            const eventsKey = STORAGE_KEYS?.EVENTS || 'events';
            localStorage.setItem(eventsKey, JSON.stringify(events));
            
            displayEvents();
        }
    } catch (err) {
        console.error('Summarization error:', err);
        alert('Error: ' + err.message);
        btn.textContent = '✨ Summarize';
        btn.disabled = false;
    }
}

// ============================================================================
// PAGE NAVIGATION
// ============================================================================

function switchPage(page) {
    currentPage = page;
    
    document.querySelectorAll('.footer-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${page}`).classList.add('active');
    
    document.getElementById('homePage').style.display = page === 'home' ? 'block' : 'none';
    document.getElementById('eventsPage').style.display = page === 'events' ? 'block' : 'none';
    document.getElementById('foldersPage').style.display = page === 'folders' ? 'block' : 'none';
    
    if (page === 'home') {
        currentView = 'today';
        currentFolder = null;
        displayEvents();
    } else if (page === 'events') {
        displayEvents();
    } else if (page === 'folders') {
        displayFolders();
        displayFolderEvents();
    }
}

function displayFolderEvents() {
    const container = document.getElementById('folderEventsContainer');
    let filtered = events.map(e => ({...e, date: new Date(e.date)}));
    
    if (currentFolder !== null) {
        filtered = filtered.filter(e => e.folderIds && e.folderIds.includes(currentFolder));
    }
    
    filtered.sort((a, b) => a.date - b.date);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-events">No events in this folder</div>';
        return;
    }
    
    container.innerHTML = filtered.map(e => `
        <div class="event-card" onclick="showEventDetails(${e.id})" style="cursor: pointer;">
            <div class="event-info">
                <h3>${e.title}</h3>
                <p>📍 ${e.location}</p>
                <p>📅 ${e.date.toLocaleString()}</p>
            </div>
            <div class="event-actions" onclick="event.stopPropagation();">
                <button class="add-to-folder-btn" onclick="addEventToFolder(${e.id})">📂 Add to Folder</button>
                <button class="delete-btn" onclick="deleteEvent(${e.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// EVENT DETAILS MODAL
// ============================================================================

function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventDetailsModal');
    const content = document.getElementById('eventDetailsContent');
    const isRecording = currentRecordingEventId === eventId;
    
    content.innerHTML = `
        <h2>${event.title}</h2>
        <p><strong>📍 Location:</strong> ${event.location}</p>
        <p><strong>📅 Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <div style="display: flex; gap: 10px; margin: 20px 0;">
            <button class="modal-record-btn" id="modal-record-${event.id}" onclick="toggleModalRecording(${event.id})" style="flex: 1;">${isRecording ? '⏹️ Stop' : '🎤 Record'}</button>
            <button class="modal-pause-btn" id="modal-pause-${event.id}" onclick="pauseModalRecording(${event.id})" style="flex: 1; display: ${isRecording ? 'block' : 'none'};">${isPaused ? '▶️ Resume' : '⏸️ Pause'}</button>
        </div>
        ${event.summary ? `<div class="summary"><strong>Summary:</strong><button class="clear-transcription" onclick="clearSummary(${event.id}); closeEventDetails();" title="Clear summary">×</button> ${event.summary}</div>` : ''}
        ${event.keyPoints && event.keyPoints.length > 0 ? `<div class="key-points"><strong>Key Points:</strong><button class="clear-transcription" onclick="clearKeyPoints(${event.id}); closeEventDetails();" title="Clear key points">×</button><ul>${event.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
        ${event.transcription ? `<div class="transcription"><strong>Notes:</strong><button class="clear-transcription" onclick="clearTranscription(${event.id}); closeEventDetails();" title="Clear all transcription">×</button><br>${renderTranscription(event.transcription, event.id)}</div>` : '<p>No transcription available</p>'}
        ${event.transcription && !event.summary ? `<div style="text-align: center; margin: 20px 0;"><button class="modal-summarize-btn" onclick="summarizeTranscription(${event.id})">✨ Summarize Transcription</button></div>` : ''}
    `;
    
    modal.style.display = 'flex';
}

function closeEventDetails() {
    document.getElementById('eventDetailsModal').style.display = 'none';
    displayEvents();
    displayFolderEvents();
}

// ============================================================================
// ADD EVENT MODAL (MOBILE)
// ============================================================================

function openAddEventModal() {
    const modal = document.getElementById('addEventModal');
    modal.style.display = 'flex';
}

function closeAddEventModal() {
    const modal = document.getElementById('addEventModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'slideOut 0.3s';
    
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.style.animation = '';
        document.getElementById('modalEventTitle').value = '';
        document.getElementById('modalEventLocation').value = '';
        document.getElementById('modalEventDate').value = '';
    }, 300);
}

function addEventFromModal() {
    const titleInput = document.getElementById('modalEventTitle');
    const locationInput = document.getElementById('modalEventLocation');
    const dateInput = document.getElementById('modalEventDate');
    
    const title = titleInput.value.trim();
    const location = locationInput.value.trim();
    const date = dateInput.value;

    if (!title || !location || !date) {
        alert(ERROR_MESSAGES?.INVALID_EVENT_DATA || 'Please fill all fields');
        return;
    }
    
    if (VALIDATION) {
        if (title.length < VALIDATION.MIN_EVENT_TITLE_LENGTH || 
            title.length > VALIDATION.MAX_EVENT_TITLE_LENGTH) {
            alert(`Title must be between ${VALIDATION.MIN_EVENT_TITLE_LENGTH} and ${VALIDATION.MAX_EVENT_TITLE_LENGTH} characters`);
            return;
        }
    }

    const newEvent = {
        id: Date.now(),
        title: title,
        location: location,
        date: new Date(date),
        transcription: '',
        summary: '',
        keyPoints: [],
        folderIds: []
    };

    events.push(newEvent);

    const storageKey = STORAGE_KEYS?.EVENTS || 'events';
    localStorage.setItem(storageKey, JSON.stringify(events));

    closeAddEventModal();
    displayEvents();
}

async function toggleModalRecording(eventId) {
    const wasRecording = currentRecordingEventId === eventId;
    await toggleRecording(eventId);
    
    setTimeout(() => {
        const recordBtn = document.getElementById(`modal-record-${eventId}`);
        const pauseBtn = document.getElementById(`modal-pause-${eventId}`);
        
        if (wasRecording) {
            if (recordBtn) {
                recordBtn.textContent = '🎤 Record';
                recordBtn.style.background = '#667eea';
            }
            if (pauseBtn) pauseBtn.style.display = 'none';
        } else {
            if (recordBtn) {
                recordBtn.textContent = '⏹️ Stop';
                recordBtn.style.background = '#ef4444';
            }
            if (pauseBtn) pauseBtn.style.display = 'block';
        }
    }, 50);
}

function pauseModalRecording(eventId) {
    const pauseBtn = document.getElementById(`modal-pause-${eventId}`);
    
    if (isPaused) {
        mediaRecorder.resume();
        recognition.start();
        pauseBtn.textContent = '⏸️ Pause';
        pauseBtn.style.background = '';
        isPaused = false;
    } else {
        mediaRecorder.pause();
        recognition.stop();
        pauseBtn.textContent = '▶️ Resume';
        pauseBtn.style.background = '#4299e1';
        isPaused = true;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    console.warn('Speech recognition not supported in this browser');
}

window.addEventListener('resize', () => {
    if (currentPage === 'folders') {
        displayFolders();
    }
});

displayFolders();
switchPage('home');
