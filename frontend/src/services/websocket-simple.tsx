'use client';

// This is a simplified WebSocket implementation for ForexJoey
// It's designed to be compatible with Vercel's build process

/**
 * Simplified WebSocket client service for ForexJoey
 * 
 * Provides real-time updates for:
 * - Market prices
 * - Trading signals
 * - Sentiment changes
 * - Economic events
 * 
 * This simplified version is designed for better compatibility with Vercel deployment
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Base WebSocket URL - would come from environment variables in production
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/ws';

// Message types
export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

// WebSocket connection states
type ConnectionState = 'disconnected' | 'connecting' | 'connected';

// Simple WebSocket client
class SimpleWebSocketClient {
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private messageHandlers: Record<string, ((data: any) => void)[]> = {
    market_update: [],
    signal_update: [],
    news: []
  };
  private connectionStateHandlers: ((state: ConnectionState) => void)[] = [];
  private reconnectTimer: any = null;
  private connectionState: ConnectionState = 'disconnected';

  // Connect to WebSocket server
  connect(token: string): void {
    if (typeof window === 'undefined') return;
    
    this.token = token;
    this.setConnectionState('connecting');
    
    try {
      this.socket = new WebSocket(`${WS_BASE_URL}?token=${token}`);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.setConnectionState('disconnected');
      this.scheduleReconnect();
    }
  }
  
  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.setConnectionState('disconnected');
  }
  
  // Subscribe to a specific market
  subscribeToMarket(currencyPair: string): void {
    if (this.isConnected()) {
      this.send({
        action: 'subscribe',
        channel: `market:${currencyPair}`
      });
    }
  }
  
  // Subscribe to news updates
  subscribeToNews(): void {
    if (this.isConnected()) {
      this.send({
        action: 'subscribe',
        channel: 'news'
      });
    }
  }
  
  // Add message handler
  addMessageHandler(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = [];
    }
    
    this.messageHandlers[type].push(handler);
  }
  
  // Remove message handler
  removeMessageHandler(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers[type]) return;
    
    this.messageHandlers[type] = this.messageHandlers[type].filter(h => h !== handler);
  }
  
  // Add connection state handler
  addConnectionStateHandler(handler: (state: ConnectionState) => void): void {
    this.connectionStateHandlers.push(handler);
    // Immediately notify with current state
    handler(this.connectionState);
  }
  
  // Remove connection state handler
  removeConnectionStateHandler(handler: (state: ConnectionState) => void): void {
    this.connectionStateHandlers = this.connectionStateHandlers.filter(h => h !== handler);
  }
  
  // Check if connected
  isConnected(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.socket) return false;
    return this.socket.readyState === WebSocket.OPEN;
  }
  
  // Private methods
  private handleOpen(): void {
    this.setConnectionState('connected');
  }
  
  private handleClose(): void {
    this.setConnectionState('disconnected');
    this.scheduleReconnect();
  }
  
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.setConnectionState('disconnected');
    this.scheduleReconnect();
  }
  
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      
      // Dispatch message to appropriate handlers
      if (message.type && this.messageHandlers[message.type]) {
        this.messageHandlers[message.type].forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error(`Error in ${message.type} handler:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }
  
  private send(data: any): void {
    if (this.isConnected()) {
      try {
        this.socket?.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    }
  }
  
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    
    // Notify all connection state handlers
    this.connectionStateHandlers.forEach(handler => {
      try {
        handler(state);
      } catch (error) {
        console.error('Error in connection state handler:', error);
      }
    });
  }
  
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.token) {
        this.connect(this.token);
      }
    }, 5000); // Reconnect after 5 seconds
  }
}

// Create singleton instance
export const webSocketClient = typeof window !== 'undefined' ? new SimpleWebSocketClient() : null;

// React context
type WebSocketContextType = {
  connectionState: ConnectionState;
  connect: (token: string) => void;
  disconnect: () => void;
  subscribeToMarket: (currencyPair: string) => void;
  subscribeToNews: () => void;
  addMessageHandler: (type: string, handler: (data: any) => void) => void;
  removeMessageHandler: (type: string, handler: (data: any) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Provider component
type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Safe access to localStorage with error handling
    let token = null;
    try {
      token = localStorage.getItem('access_token');
    } catch (e) {
      console.error('Error accessing localStorage in WebSocketProvider:', e);
    }
    
    if (token && webSocketClient) {
      webSocketClient.connect(token);
    }
    
    // Add connection state handler
    if (webSocketClient) {
      webSocketClient.addConnectionStateHandler(setConnectionState);
    }
    
    // Cleanup on unmount
    return () => {
      if (webSocketClient) {
        webSocketClient.removeConnectionStateHandler(setConnectionState);
      }
    };
  }, []);
  
  const contextValue: WebSocketContextType = {
    connectionState,
    connect: (token: string) => webSocketClient?.connect(token),
    disconnect: () => webSocketClient?.disconnect(),
    subscribeToMarket: (currencyPair: string) => webSocketClient?.subscribeToMarket(currencyPair),
    subscribeToNews: () => webSocketClient?.subscribeToNews(),
    addMessageHandler: (type: string, handler: (data: any) => void) => 
      webSocketClient?.addMessageHandler(type, handler),
    removeMessageHandler: (type: string, handler: (data: any) => void) => 
      webSocketClient?.removeMessageHandler(type, handler),
  };
  
  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook for using WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  
  return context;
};

// Hook for market updates
export const useMarketUpdates = (currencyPair: string) => {
  const { addMessageHandler, removeMessageHandler, subscribeToMarket, connectionState } = useWebSocket();
  const [marketData, setMarketData] = useState<any>(null);
  
  useEffect(() => {
    if (connectionState === 'connected') {
      subscribeToMarket(currencyPair);
    }
    
    const handleMarketUpdate = (message: WebSocketMessage) => {
      if (message.currency_pair === currencyPair || 
          (message.data && message.data.currency_pair === currencyPair)) {
        setMarketData(message.data || message);
      }
    };
    
    addMessageHandler('market_update', handleMarketUpdate);
    
    return () => {
      removeMessageHandler('market_update', handleMarketUpdate);
    };
  }, [addMessageHandler, removeMessageHandler, subscribeToMarket, currencyPair, connectionState]);
  
  return marketData;
};

// Hook for news updates
export const useNewsUpdates = () => {
  const { addMessageHandler, removeMessageHandler, subscribeToNews, connectionState } = useWebSocket();
  const [newsItems, setNewsItems] = useState<any[]>([]);
  
  useEffect(() => {
    if (connectionState === 'connected') {
      subscribeToNews();
    }
    
    const handleNewsUpdate = (message: WebSocketMessage) => {
      const newsItem = message.data || message;
      setNewsItems(prev => [newsItem, ...prev].slice(0, 10)); // Keep last 10 news items
    };
    
    addMessageHandler('news', handleNewsUpdate);
    
    return () => {
      removeMessageHandler('news', handleNewsUpdate);
    };
  }, [addMessageHandler, removeMessageHandler, subscribeToNews, connectionState]);
  
  return newsItems;
};

export default {
  WebSocketProvider,
  useWebSocket,
  useMarketUpdates,
  useNewsUpdates
};
