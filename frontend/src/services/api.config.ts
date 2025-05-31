// API Configuration for ForexJoey
// This file centralizes API configuration to support local, development, and production environments

// ForexJoey requires multiple intelligence sources for high-accuracy decision making
// These API configurations ensure proper connectivity to all backend services

// Define environment types for type safety
type Environment = 'local' | 'development' | 'production';

// Environment configuration
const API_ENVIRONMENTS: Record<Environment, string> = {
  // Local development environment
  local: 'http://localhost:8000/api',
  
  // Development environment (connects to development branch deployment)
  development: process.env.NEXT_PUBLIC_DEV_API_URL || 'https://forexjoey-backend-dev.onrender.com/api',
  
  // Production environment (connects to main branch deployment)
  production: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://forexjoey-backend.onrender.com/api'
};

// WebSocket environments for real-time trading data
const WS_ENVIRONMENTS: Record<Environment, string> = {
  local: 'ws://localhost:8000/api/ws',
  development: process.env.NEXT_PUBLIC_DEV_WS_URL || 'wss://forexjoey-backend-dev.onrender.com/api/ws',
  production: process.env.NEXT_PUBLIC_WS_URL || 'wss://forexjoey-backend.onrender.com/api/ws'
};

// Determine which environment to use based on NEXT_PUBLIC_APP_ENV or NODE_ENV
// This allows explicit control over which backend to connect to
// Safeguard against undefined during SSR
const getAppEnv = (): Environment => {
  // Default to production for Vercel deployment safety
  if (typeof process === 'undefined') return 'production';
  
  return (process.env.NEXT_PUBLIC_APP_ENV as Environment) || 
         (process.env.NODE_ENV === 'production' ? 'production' : 
         (process.env.NODE_ENV === 'development' ? 'development' : 'local'));
};

const APP_ENV = getAppEnv();

// Export the base URL for use in api.ts
export const API_BASE_URL = API_ENVIRONMENTS[APP_ENV];

// Export configuration for WebSocket connections
export const WS_BASE_URL = WS_ENVIRONMENTS[APP_ENV];

// Export configuration object with all settings
export const apiConfig = {
  baseUrl: API_BASE_URL,
  wsUrl: WS_BASE_URL,
  timeout: 30000, // 30 seconds timeout for API calls
  retryAttempts: 3, // Number of retry attempts for failed calls
  environment: APP_ENV,
  
  // Intelligence source configuration
  intelligenceSources: {
    technical: true,      // Technical analysis indicators
    sentiment: true,      // Market sentiment analysis
    fundamental: true,    // Economic data and news
    aiPrediction: true,   // AI-driven predictions
    reflectionEngine: true // Learning from past trades
  },
  
  // ForexJoey requires at least 2 intelligence sources for any trading signal
  minIntelligenceSources: 2
};

export default apiConfig;
