// Environment configuration - detects if running locally or on Render
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;
