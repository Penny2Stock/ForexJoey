// API Configuration for ForexJoey
// This file centralizes API configuration to easily switch between local and deployed environments

// Default to local development if not specified
const API_ENVIRONMENTS = {
  local: 'http://localhost:8000/api',
  production: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://forexjoey-backend.onrender.com/api'
};

// Determine which environment to use
// In production, this will use the Render-deployed backend
const API_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'local';

// Export the base URL for use in api.ts
export const API_BASE_URL = API_ENVIRONMENTS[API_ENV];

// Export configuration for WebSocket connections
export const WS_BASE_URL = API_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_WS_URL || 'wss://forexjoey-backend.onrender.com/api/ws')
  : 'ws://localhost:8000/api/ws';

// Export configuration object with all settings
export const apiConfig = {
  baseUrl: API_BASE_URL,
  wsUrl: WS_BASE_URL,
  timeout: 30000, // 30 seconds timeout for API calls
  retryAttempts: 3, // Number of retry attempts for failed calls
  environment: API_ENV
};

export default apiConfig;
