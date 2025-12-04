// Application Configuration
const GEMINI_CONFIG = {
    MODEL_NAME: 'gemini-2.5-flash',
    API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};

// Storage Keys
const STORAGE_KEYS = {
    EVENTS: 'events',
    FOLDERS: 'folders',
    GEMINI_KEY: 'gemini_api_key'
};

// Folder Emojis
const FOLDER_EMOJIS = [
    '📁',  // Default folder
    '💼',  // Business
    '🏠',  // Home
    '🎓',  // Education
    '💡',  // Ideas
    '🎯',  // Goals
    '📊',  // Analytics
    '🔥',  // Priority
    '⭐',  // Starred
    '🎨',  // Creative
    '🏆',  // Achievement
    '📱',  // Mobile
    '💻',  // Tech
    '🚀',  // Launch
    '🎉'   // Celebration
];


const DEFAULT_FOLDER_ICON = '📁';


const VIEW_TYPES = {
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month'
};


const PAGE_TYPES = {
    HOME: 'home',
    EVENTS: 'events',
    FOLDERS: 'folders'
};

// Speech Recognition Config
const SPEECH_CONFIG = {
    CONTINUOUS: true,
    INTERIM_RESULTS: false,
    LANGUAGE: 'en-US',
    SHOW_LIVE_TRANSCRIPTION: false  // Disable live transcription display
};

// Validation
const VALIDATION = {
    MIN_EVENT_TITLE_LENGTH: 1,
    MAX_EVENT_TITLE_LENGTH: 100,
    MIN_FOLDER_NAME_LENGTH: 1,
    MAX_FOLDER_NAME_LENGTH: 50,
    MIN_KEY_POINT_LENGTH: 20,
    MAX_KEY_POINTS: 5
};

// Error Messages
const ERROR_MESSAGES = {
    MICROPHONE_ACCESS_DENIED: 'Microphone access denied. Please enable microphone permissions in your browser settings.',
    MICROPHONE_NOT_SUPPORTED: 'Your browser does not support microphone recording. Please use Chrome, Edge, or Firefox.',
    SPEECH_RECOGNITION_NOT_SUPPORTED: 'Speech recognition is not supported in this browser. Please use Chrome or Edge.',

    NO_TRANSCRIPTION: 'No transcription found. Please record a meeting first.',
    INVALID_EVENT_DATA: 'Please fill in all required fields (title, location, date).',
    FOLDER_NAME_REQUIRED: 'Please enter a folder name.',
    NO_FOLDERS_AVAILABLE: 'No folders available. Please create a folder first.'
};





