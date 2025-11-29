// Application Configuration
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

// Storage Keys
const STORAGE_KEYS = {
    EVENTS: 'events',
    FOLDERS: 'folders',
    HF_TOKEN: 'hf_token'
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
    INTERIM_RESULTS: false,  // Set to true to see real-time transcription
    LANGUAGE: 'en-US'        // Change to your preferred language
};

// Recording Config
const RECORDING_CONFIG = {
    MIME_TYPE: 'audio/webm',  // Common format, browser may use alternative
    AUDIO_BITRATE: 128000     // 128 kbps - good quality/size balance
};

// Animation Timing
const ANIMATION_TIMING = {
    MODAL_SLIDE_IN: 300,
    MODAL_SLIDE_OUT: 300,
    MODAL_FADE_IN: 300,
    CARD_SLIDE_UP: 400
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
    API_TOKEN_REQUIRED: 'Hugging Face API token is required for summarization. Please enter your token.',
    API_TOKEN_INVALID: 'Invalid API token. Please check your Hugging Face token and try again.',
    API_REQUEST_FAILED: 'Failed to generate summary. Please check your internet connection and try again.',
    NO_TRANSCRIPTION: 'No transcription found. Please record a meeting first.',
    INVALID_EVENT_DATA: 'Please fill in all required fields (title, location, date).',
    FOLDER_NAME_REQUIRED: 'Please enter a folder name.',
    NO_FOLDERS_AVAILABLE: 'No folders available. Please create a folder first.'
};

// Success Messages
const SUCCESS_MESSAGES = {
    EVENT_CREATED: 'Event created successfully!',
    EVENT_DELETED: 'Event deleted successfully!',
    FOLDER_CREATED: 'Folder created successfully!',
    FOLDER_DELETED: 'Folder deleted successfully!',
    EVENT_ADDED_TO_FOLDER: 'Event added to folder successfully!',
    SUMMARY_GENERATED: 'Summary generated successfully!'
};



