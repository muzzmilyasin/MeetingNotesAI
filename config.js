/**
 * Application Configuration
 * 
 * Central configuration file for Meeting Notes AI application.
 * Contains API endpoints, constants, and default settings.
 * 
 * @module config
 * @version 1.0.0
 */

// ============================================================================
// HUGGING FACE API CONFIGURATION
// ============================================================================

/**
 * Hugging Face API Configuration
 * 
 * The application uses Hugging Face's Inference API for AI-powered summarization.
 * 
 * @constant {Object} HF_CONFIG
 * @property {string} BASE_URL - Base URL for Hugging Face Inference API
 * @property {string} MODEL_NAME - Model used for text summarization
 * @property {string} API_ENDPOINT - Full API endpoint URL
 * @property {number} MAX_INPUT_LENGTH - Maximum characters to send for summarization (API limit)
 * @property {number} MAX_LENGTH - Maximum length of generated summary
 * @property {number} MIN_LENGTH - Minimum length of generated summary
 */
const HF_CONFIG = {
    BASE_URL: 'https://api-inference.huggingface.co/models/',
    MODEL_NAME: 'sshleifer/distilbart-cnn-12-6',
    get API_ENDPOINT() {
        return this.BASE_URL + this.MODEL_NAME;
    },
    MAX_INPUT_LENGTH: 1000,  // Character limit for API input
    MAX_LENGTH: 130,         // Maximum summary length
    MIN_LENGTH: 30,          // Minimum summary length
    DO_SAMPLE: false         // Use greedy decoding for consistent results
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * LocalStorage Keys
 * 
 * Keys used to store application data in browser's localStorage.
 * 
 * @constant {Object} STORAGE_KEYS
 * @property {string} EVENTS - Key for storing events array
 * @property {string} FOLDERS - Key for storing folders array
 * @property {string} HF_TOKEN - Key for storing Hugging Face API token
 */
const STORAGE_KEYS = {
    EVENTS: 'events',
    FOLDERS: 'folders',
    HF_TOKEN: 'hf_token'
};

// ============================================================================
// APPLICATION CONSTANTS
// ============================================================================

/**
 * Folder Emoji Options
 * 
 * Available emoji icons for folder customization.
 * 
 * @constant {string[]} FOLDER_EMOJIS
 */
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

/**
 * Default Folder Icon
 * 
 * @constant {string} DEFAULT_FOLDER_ICON
 */
const DEFAULT_FOLDER_ICON = '📁';

/**
 * View Types
 * 
 * Available time-based view filters for events.
 * 
 * @constant {Object} VIEW_TYPES
 */
const VIEW_TYPES = {
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month'
};

/**
 * Page Types
 * 
 * Available application pages for navigation.
 * 
 * @constant {Object} PAGE_TYPES
 */
const PAGE_TYPES = {
    HOME: 'home',
    EVENTS: 'events',
    FOLDERS: 'folders'
};

// ============================================================================
// SPEECH RECOGNITION CONFIGURATION
// ============================================================================

/**
 * Speech Recognition Settings
 * 
 * Configuration for Web Speech API.
 * 
 * @constant {Object} SPEECH_CONFIG
 * @property {boolean} CONTINUOUS - Keep listening after speech ends
 * @property {boolean} INTERIM_RESULTS - Show interim results (partial transcripts)
 * @property {string} LANGUAGE - Language code for recognition (default: browser language)
 */
const SPEECH_CONFIG = {
    CONTINUOUS: true,
    INTERIM_RESULTS: false,  // Set to true to see real-time transcription
    LANGUAGE: 'en-US'        // Change to your preferred language
};

// ============================================================================
// MEDIA RECORDING CONFIGURATION
// ============================================================================

/**
 * Media Recorder Settings
 * 
 * Configuration for MediaRecorder API.
 * 
 * @constant {Object} RECORDING_CONFIG
 * @property {string} MIME_TYPE - Audio format (browser will select compatible one)
 * @property {number} AUDIO_BITRATE - Audio quality in bits per second
 */
const RECORDING_CONFIG = {
    MIME_TYPE: 'audio/webm',  // Common format, browser may use alternative
    AUDIO_BITRATE: 128000     // 128 kbps - good quality/size balance
};

// ============================================================================
// UI ANIMATION TIMING
// ============================================================================

/**
 * Animation Durations
 * 
 * Timing constants for UI animations (in milliseconds).
 * 
 * @constant {Object} ANIMATION_TIMING
 */
const ANIMATION_TIMING = {
    MODAL_SLIDE_IN: 300,
    MODAL_SLIDE_OUT: 300,
    MODAL_FADE_IN: 300,
    CARD_SLIDE_UP: 400
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Input Validation Limits
 * 
 * Minimum and maximum lengths for user inputs.
 * 
 * @constant {Object} VALIDATION
 * @property {number} MIN_EVENT_TITLE_LENGTH - Minimum characters for event title
 * @property {number} MAX_EVENT_TITLE_LENGTH - Maximum characters for event title
 * @property {number} MIN_FOLDER_NAME_LENGTH - Minimum characters for folder name
 * @property {number} MAX_FOLDER_NAME_LENGTH - Maximum characters for folder name
 * @property {number} MIN_KEY_POINT_LENGTH - Minimum characters for extracted key points
 * @property {number} MAX_KEY_POINTS - Maximum number of key points to extract
 */
const VALIDATION = {
    MIN_EVENT_TITLE_LENGTH: 1,
    MAX_EVENT_TITLE_LENGTH: 100,
    MIN_FOLDER_NAME_LENGTH: 1,
    MAX_FOLDER_NAME_LENGTH: 50,
    MIN_KEY_POINT_LENGTH: 20,
    MAX_KEY_POINTS: 5
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * User-Friendly Error Messages
 * 
 * Error messages displayed to users for various failure scenarios.
 * 
 * @constant {Object} ERROR_MESSAGES
 */
const ERROR_MESSAGES = {
    MICROPHONE_ACCESS_DENIED: 'Microphone access denied. Please enable microphone permissions in your browser settings.',
    MICROPHONE_NOT_SUPPORTED: 'Your browser does not support microphone recording. Please use Chrome, Edge, or Firefox.',
    SPEECH_RECOGNITION_NOT_SUPPORTED: 'Speech recognition is not supported in this browser. Please use Chrome or Edge.',
    API_TOKEN_REQUIRED: 'Hugging Face API token is required for summarization. Please enter your token.',
    API_TOKEN_INVALID: 'Invalid API token. Please check your Hugging Face token and try again.',
    API_REQUEST_FAILED: 'Failed to generate summary. Please check your internet connection and try again.',
    NO_TRANSCRIPTION: 'No transcription found. Please record a meeting first.',
    INVALID_EVENT_DATA: 'Please fill in all required fields (title, location, date).',
    FOLDER_NAME_REQUIRED: 'Please enter a folder name.',
    NO_FOLDERS_AVAILABLE: 'No folders available. Please create a folder first.'
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

/**
 * Success Messages
 * 
 * Positive feedback messages for user actions.
 * 
 * @constant {Object} SUCCESS_MESSAGES
 */
const SUCCESS_MESSAGES = {
    EVENT_CREATED: 'Event created successfully!',
    EVENT_DELETED: 'Event deleted successfully!',
    FOLDER_CREATED: 'Folder created successfully!',
    FOLDER_DELETED: 'Folder deleted successfully!',
    EVENT_ADDED_TO_FOLDER: 'Event added to folder successfully!',
    SUMMARY_GENERATED: 'Summary generated successfully!'
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

// Note: In a browser environment, these constants are available globally
// when this script is loaded before app.js
// For module systems, you would export them differently

