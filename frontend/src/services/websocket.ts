/**
 * WebSocket client service for ForexJoey
 * 
 * Provides real-time updates for:
 * - Market prices
 * - Trading signals
 * - Sentiment changes
 * - Economic events
 */

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

// Base WebSocket URL - would come from environment variables in production
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000/api/ws';

// Define message types
export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

// Market update message type
export type MarketUpdateMessage = {
  type: 'market_update';
  currency_pair: string;
  data: {
    instrument: string;
    bid: number;
    ask: number;
    mid: number;
    spread: number;
    movement: number;
    time: string;
    formatted_instrument?: string;
  };
  timestamp: string;
};

// Signal update message type
export type SignalUpdateMessage = {
  type: 'signal_update';
  data: {
    id: string;
    currency_pair: string;
    direction: string;
    entry_price: number;
    stop_loss: number;
    take_profit: number;
    timeframe: string;
    confidence_score: number;
    status: string;
    created_at: string;
    [key: string]: any;
  };
  timestamp: string;
};

// News message type
export type NewsMessage = {
  type: 'news';
  data: {
    id: string;
    title: string;
    content: string;
    source: string;
    url: string;
    sentiment_score: number;
    currency_pairs: string[];
    published_at: string;
    [key: string]: any;
  };
  timestamp: string;
};

// WebSocket client class
class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageListeners: Map<string, Set<(message: any) => void>> = new Map();
  private connectionStateListeners: Set<(connected: boolean) => void> = new Set();
  private subscriptions: Set<string> = new Set();
  private isConnected = false;
  private token: string | null = null;

  constructor() {
    // Initialize message listener collections
    this.messageListeners.set('market_update', new Set());
    this.messageListeners.set('signal_update', new Set());
    this.messageListeners.set('news', new Set());
  }

  /**
   * Connect to the WebSocket server
   */
  public connect(token: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.token = token;
    this.socket = new WebSocket(WS_BASE_URL);

    // Connection opened
    this.socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Send authentication message
      this.socket.send(JSON.stringify({
        token
      }));
      
      // Resubscribe to previous subscriptions
      this.resubscribe();
      
      // Notify connection state listeners
      this.notifyConnectionStateListeners(true);
    });

    // Listen for messages
    this.socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Connection closed
    this.socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      
      // Notify connection state listeners
      this.notifyConnectionStateListeners(false);
      
      // Attempt to reconnect
      this.attemptReconnect();
    });

    // Connection error
    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
      
      // Notify connection state listeners
      this.notifyConnectionStateListeners(false);
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.isConnected = false;
    this.subscriptions.clear();
    
    // Notify connection state listeners
    this.notifyConnectionStateListeners(false);
  }

  /**
   * Check if the client is connected
   */
  public isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * Subscribe to market updates for a currency pair
   */
  public subscribeToMarket(currencyPair: string): void {
    if (!this.isConnected || !this.socket) {
      this.subscriptions.add(`market:${currencyPair}`);
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'subscribe',
      topic: 'market',
      currency_pair: currencyPair
    }));
    
    this.subscriptions.add(`market:${currencyPair}`);
  }

  /**
   * Unsubscribe from market updates for a currency pair
   */
  public unsubscribeFromMarket(currencyPair: string): void {
    if (!this.isConnected || !this.socket) {
      this.subscriptions.delete(`market:${currencyPair}`);
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'unsubscribe',
      topic: 'market',
      currency_pair: currencyPair
    }));
    
    this.subscriptions.delete(`market:${currencyPair}`);
  }

  /**
   * Subscribe to news updates
   */
  public subscribeToNews(): void {
    if (!this.isConnected || !this.socket) {
      this.subscriptions.add('news');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'subscribe',
      topic: 'news'
    }));
    
    this.subscriptions.add('news');
  }

  /**
   * Unsubscribe from news updates
   */
  public unsubscribeFromNews(): void {
    if (!this.isConnected || !this.socket) {
      this.subscriptions.delete('news');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'unsubscribe',
      topic: 'news'
    }));
    
    this.subscriptions.delete('news');
  }

  /**
   * Add a listener for a specific message type
   */
  public addMessageListener(type: string, listener: (message: any) => void): void {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, new Set());
    }
    
    this.messageListeners.get(type)?.add(listener);
  }

  /**
   * Remove a listener for a specific message type
   */
  public removeMessageListener(type: string, listener: (message: any) => void): void {
    this.messageListeners.get(type)?.delete(listener);
  }

  /**
   * Add a connection state listener
   */
  public addConnectionStateListener(listener: (connected: boolean) => void): void {
    this.connectionStateListeners.add(listener);
  }

  /**
   * Remove a connection state listener
   */
  public removeConnectionStateListener(listener: (connected: boolean) => void): void {
    this.connectionStateListeners.delete(listener);
  }

  /**
   * Handle a WebSocket message
   */
  private handleMessage(message: WebSocketMessage): void {
    const { type } = message;
    
    // Notify listeners
    this.messageListeners.get(type)?.forEach(listener => {
      listener(message);
    });
  }

  /**
   * Attempt to reconnect to the WebSocket server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, delay);
  }

  /**
   * Resubscribe to previous subscriptions
   */
  private resubscribe(): void {
    for (const subscription of this.subscriptions) {
      if (subscription.startsWith('market:')) {
        const currencyPair = subscription.split(':')[1];
        
        this.socket?.send(JSON.stringify({
          type: 'subscribe',
          topic: 'market',
          currency_pair: currencyPair
        }));
      } else if (subscription === 'news') {
        this.socket?.send(JSON.stringify({
          type: 'subscribe',
          topic: 'news'
        }));
      }
    }
  }

  /**
   * Notify connection state listeners
   */
  private notifyConnectionStateListeners(connected: boolean): void {
    this.connectionStateListeners.forEach(listener => {
      listener(connected);
    });
  }
}

// Create WebSocket client singleton
export const webSocketClient = new WebSocket() ? new WebSocketClient() : null;

// Context for using WebSocket in React components
type WebSocketContextType = {
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  subscribeToMarket: (currencyPair: string) => void;
  unsubscribeFromMarket: (currencyPair: string) => void;
  subscribeToNews: () => void;
  unsubscribeFromNews: () => void;
  addMessageListener: (type: string, listener: (message: any) => void) => void;
  removeMessageListener: (type: string, listener: (message: any) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// WebSocket provider component
type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Connect to WebSocket when token is available
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token && webSocketClient) {
      webSocketClient.connect(token);
    }
    
    // Add connection state listener
    if (webSocketClient) {
      webSocketClient.addConnectionStateListener(setIsConnected);
    }
    
    // Cleanup on unmount
    return () => {
      if (webSocketClient) {
        webSocketClient.removeConnectionStateListener(setIsConnected);
      }
    };
  }, []);
  
  const value = {
    isConnected,
    connect: (token: string) => webSocketClient?.connect(token),
    disconnect: () => webSocketClient?.disconnect(),
    subscribeToMarket: (currencyPair: string) => webSocketClient?.subscribeToMarket(currencyPair),
    unsubscribeFromMarket: (currencyPair: string) => webSocketClient?.unsubscribeFromMarket(currencyPair),
    subscribeToNews: () => webSocketClient?.subscribeToNews(),
    unsubscribeFromNews: () => webSocketClient?.unsubscribeFromNews(),
    addMessageListener: (type: string, listener: (message: any) => void) => webSocketClient?.addMessageListener(type, listener),
    removeMessageListener: (type: string, listener: (message: any) => void) => webSocketClient?.removeMessageListener(type, listener),
  };
  
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook for using WebSocket in components
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  
  return context;
};

// Hook for subscribing to market updates
export const useMarketUpdates = (currencyPair: string) => {
  const [priceData, setPriceData] = useState<MarketUpdateMessage['data'] | null>(null);
  const { addMessageListener, removeMessageListener, subscribeToMarket, unsubscribeFromMarket } = useWebSocket();
  
  useEffect(() => {
    // Subscribe to market updates
    subscribeToMarket(currencyPair);
    
    // Add message listener
    const handleMarketUpdate = (message: MarketUpdateMessage) => {
      if (message.currency_pair === currencyPair) {
        setPriceData(message.data);
      }
    };
    
    addMessageListener('market_update', handleMarketUpdate);
    
    // Cleanup on unmount
    return () => {
      unsubscribeFromMarket(currencyPair);
      removeMessageListener('market_update', handleMarketUpdate);
    };
  }, [currencyPair, addMessageListener, removeMessageListener, subscribeToMarket, unsubscribeFromMarket]);
  
  return priceData;
};

// Hook for subscribing to signal updates
export const useSignalUpdates = () => {
  const [signals, setSignals] = useState<SignalUpdateMessage['data'][]>([]);
  const { addMessageListener, removeMessageListener } = useWebSocket();
  
  useEffect(() => {
    // Add message listener
    const handleSignalUpdate = (message: SignalUpdateMessage) => {
      setSignals(prev => {
        // Check if signal already exists
        const exists = prev.some(signal => signal.id === message.data.id);
        
        if (exists) {
          // Update existing signal
          return prev.map(signal => 
            signal.id === message.data.id ? message.data : signal
          );
        } else {
          // Add new signal
          return [...prev, message.data];
        }
      });
    };
    
    addMessageListener('signal_update', handleSignalUpdate);
    
    // Cleanup on unmount
    return () => {
      removeMessageListener('signal_update', handleSignalUpdate);
    };
  }, [addMessageListener, removeMessageListener]);
  
  return signals;
};

// Hook for subscribing to news updates
export const useNewsUpdates = () => {
  const [news, setNews] = useState<NewsMessage['data'][]>([]);
  const { addMessageListener, removeMessageListener, subscribeToNews, unsubscribeFromNews } = useWebSocket();
  
  useEffect(() => {
    // Subscribe to news updates
    subscribeToNews();
    
    // Add message listener
    const handleNewsUpdate = (message: NewsMessage) => {
      setNews(prev => {
        // Check if news already exists
        const exists = prev.some(item => item.id === message.data.id);
        
        if (exists) {
          // Update existing news
          return prev.map(item => 
            item.id === message.data.id ? message.data : item
          );
        } else {
          // Add new news
          return [message.data, ...prev];
        }
      });
    };
    
    addMessageListener('news', handleNewsUpdate);
    
    // Cleanup on unmount
    return () => {
      unsubscribeFromNews();
      removeMessageListener('news', handleNewsUpdate);
    };
  }, [addMessageListener, removeMessageListener, subscribeToNews, unsubscribeFromNews]);
  
  return news;
};
