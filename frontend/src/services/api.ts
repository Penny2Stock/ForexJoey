import axios from 'axios';
import { API_BASE_URL, apiConfig } from './api.config';

// ForexJoey API service - uses centralized configuration
// This ensures consistent connection between frontend and backend

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage when in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service functions
const apiService = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Save token to localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return response.data;
    },
    
    register: async (userData: any) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    
    logout: () => {
      localStorage.removeItem('access_token');
    },
    
    getProfile: async () => {
      const response = await api.get('/user/me');
      return response.data;
    },
  },
  
  // Signals endpoints
  signals: {
    getSignals: async (params?: any) => {
      const response = await api.get('/signals', { params });
      return response.data;
    },
    
    getSignalById: async (id: string) => {
      const response = await api.get(`/signals/${id}`);
      return response.data;
    },
    
    generateSignal: async (data: any) => {
      const response = await api.post('/signals/generate', data);
      return response.data;
    },
    
    getSignalHistory: async (id: string) => {
      const response = await api.get(`/signals/${id}/history`);
      return response.data;
    },
  },
  
  // Market data endpoints
  market: {
    getPrices: async (instrument: string, granularity: string, count: number = 100) => {
      const response = await api.get('/market/prices', {
        params: { instrument, granularity, count },
      });
      return response.data;
    },
    
    getInstruments: async () => {
      const response = await api.get('/market/instruments');
      return response.data;
    },
    
    getEconomicCalendar: async (from?: string, to?: string) => {
      const response = await api.get('/market/economic-calendar', {
        params: { from, to },
      });
      return response.data;
    },
  },
  
  // Sentiment analysis endpoints
  sentiment: {
    getSentimentForPair: async (currencyPair: string, timeframe?: string) => {
      const response = await api.get(`/sentiment/currency/${currencyPair}`, {
        params: { timeframe },
      });
      return response.data;
    },
    
    getDashboardSentiment: async (timeframe?: string) => {
      const response = await api.get('/sentiment/dashboard', {
        params: { timeframe },
      });
      return response.data;
    },
    
    getNewsWithSentiment: async (currencyPair: string, limit: number = 10, timeframe?: string) => {
      const response = await api.get(`/sentiment/news/${currencyPair}`, {
        params: { limit, timeframe },
      });
      return response.data;
    },
  },
  
  // Trading execution endpoints
  trading: {
    executeOrder: async (orderData: any) => {
      const response = await api.post('/trading/orders', orderData);
      return response.data;
    },
    
    getOpenPositions: async () => {
      const response = await api.get('/trading/positions');
      return response.data;
    },
    
    closePosition: async (id: string) => {
      const response = await api.post(`/trading/positions/${id}/close`);
      return response.data;
    },
    
    getAccountSummary: async () => {
      const response = await api.get('/trading/account');
      return response.data;
    },
  },
  
  // User profile and settings endpoints
  user: {
    getProfile: async () => {
      const response = await api.get('/user/me');
      return response.data;
    },
    
    updateProfile: async (userData: any) => {
      const response = await api.put('/user/me', userData);
      return response.data;
    },
    
    getSettings: async () => {
      const response = await api.get('/user/settings');
      return response.data;
    },
    
    updateSettings: async (settings: any) => {
      const response = await api.put('/user/settings', settings);
      return response.data;
    },
    
    getNotifications: async (unreadOnly: boolean = false) => {
      const response = await api.get('/user/notifications', {
        params: { unread_only: unreadOnly }
      });
      return response.data;
    },
    
    markNotificationAsRead: async (id: string) => {
      const response = await api.post(`/user/notifications/${id}/read`);
      return response.data;
    },
  },
  
  // AI reflection endpoints
  reflection: {
    submitSignalOutcome: async (signalId: string, outcomeData: any) => {
      const response = await api.post(`/reflection/signal-outcome/${signalId}`, outcomeData);
      return response.data;
    },
    
    getSignalHistory: async (signalId: string) => {
      const response = await api.get(`/reflection/signal-history/${signalId}`);
      return response.data;
    },
    
    getPerformanceMetrics: async (currencyPair: string, timeframe: string) => {
      const response = await api.get(`/reflection/performance/${currencyPair}`, {
        params: { timeframe }
      });
      return response.data;
    },
    
    getAllPerformanceMetrics: async () => {
      const response = await api.get('/reflection/performance/all');
      return response.data;
    },
    
    getAiInsights: async (limit: number = 5) => {
      const response = await api.get('/reflection/insights', {
        params: { limit }
      });
      return response.data;
    },
  },
};

export default apiService;
