"""
WebSocket Manager for ForexJoey

Provides real-time updates for:
1. Market prices
2. Trading signals
3. Sentiment changes
4. Economic events
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Set
from datetime import datetime
import uuid

from fastapi import WebSocket, WebSocketDisconnect
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    """WebSocket connection manager"""
    
    def __init__(self):
        # All active connections
        self.active_connections: List[WebSocket] = []
        
        # Connections mapped by user_id
        self.user_connections: Dict[str, List[WebSocket]] = {}
        
        # Connections mapped by subscription type
        self.market_subscribers: Dict[str, Set[WebSocket]] = {}  # currency_pair -> connections
        self.signal_subscribers: Dict[str, Set[WebSocket]] = {}  # user_id -> connections
        self.news_subscribers: Set[WebSocket] = set()
        
    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        """
        Connect a client websocket
        
        Args:
            websocket: WebSocket connection
            user_id: User ID
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        
        # Add to user connections
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)
        
        # Add to signal subscribers
        if user_id not in self.signal_subscribers:
            self.signal_subscribers[user_id] = set()
        self.signal_subscribers[user_id].add(websocket)
        
        # Send welcome message
        await self.send_personal_message(
            {
                "type": "connection",
                "status": "connected",
                "user_id": user_id,
                "timestamp": datetime.now().isoformat()
            },
            websocket
        )
        
    async def disconnect(self, websocket: WebSocket) -> None:
        """
        Disconnect a client websocket
        
        Args:
            websocket: WebSocket connection
        """
        # Remove from active connections
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            
        # Remove from user connections
        for user_id, connections in self.user_connections.items():
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.user_connections[user_id]
                break
                
        # Remove from market subscribers
        for currency_pair, connections in self.market_subscribers.items():
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.market_subscribers[currency_pair]
                    
        # Remove from signal subscribers
        for user_id, connections in self.signal_subscribers.items():
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.signal_subscribers[user_id]
                    
        # Remove from news subscribers
        if websocket in self.news_subscribers:
            self.news_subscribers.remove(websocket)
    
    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket) -> None:
        """
        Send a message to a specific client
        
        Args:
            message: Message to send
            websocket: WebSocket connection
        """
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {str(e)}")
            await self.disconnect(websocket)
            
    async def broadcast(self, message: Dict[str, Any]) -> None:
        """
        Broadcast a message to all connected clients
        
        Args:
            message: Message to broadcast
        """
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {str(e)}")
                disconnected.append(connection)
                
        # Clean up disconnected clients
        for connection in disconnected:
            await self.disconnect(connection)
            
    async def broadcast_to_user(self, user_id: str, message: Dict[str, Any]) -> None:
        """
        Broadcast a message to all connections for a specific user
        
        Args:
            user_id: User ID
            message: Message to broadcast
        """
        if user_id not in self.user_connections:
            return
            
        disconnected = []
        for connection in self.user_connections[user_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to user: {str(e)}")
                disconnected.append(connection)
                
        # Clean up disconnected clients
        for connection in disconnected:
            await self.disconnect(connection)
            
    async def broadcast_market_update(self, currency_pair: str, price_data: Dict[str, Any]) -> None:
        """
        Broadcast a market price update to subscribers
        
        Args:
            currency_pair: Currency pair
            price_data: Price data
        """
        if currency_pair not in self.market_subscribers:
            return
            
        message = {
            "type": "market_update",
            "currency_pair": currency_pair,
            "data": price_data,
            "timestamp": datetime.now().isoformat()
        }
        
        disconnected = []
        for connection in self.market_subscribers[currency_pair]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting market update: {str(e)}")
                disconnected.append(connection)
                
        # Clean up disconnected clients
        for connection in disconnected:
            await self.disconnect(connection)
            
    async def broadcast_signal_update(self, user_id: str, signal_data: Dict[str, Any]) -> None:
        """
        Broadcast a signal update to a user
        
        Args:
            user_id: User ID
            signal_data: Signal data
        """
        if user_id not in self.signal_subscribers:
            return
            
        message = {
            "type": "signal_update",
            "data": signal_data,
            "timestamp": datetime.now().isoformat()
        }
        
        disconnected = []
        for connection in self.signal_subscribers[user_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting signal update: {str(e)}")
                disconnected.append(connection)
                
        # Clean up disconnected clients
        for connection in disconnected:
            await self.disconnect(connection)
            
    async def broadcast_news(self, news_data: Dict[str, Any]) -> None:
        """
        Broadcast news to subscribers
        
        Args:
            news_data: News data
        """
        if not self.news_subscribers:
            return
            
        message = {
            "type": "news",
            "data": news_data,
            "timestamp": datetime.now().isoformat()
        }
        
        disconnected = []
        for connection in self.news_subscribers:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting news: {str(e)}")
                disconnected.append(connection)
                
        # Clean up disconnected clients
        for connection in disconnected:
            await self.disconnect(connection)
            
    async def subscribe_to_market(self, websocket: WebSocket, currency_pair: str) -> None:
        """
        Subscribe a client to market updates for a currency pair
        
        Args:
            websocket: WebSocket connection
            currency_pair: Currency pair
        """
        if currency_pair not in self.market_subscribers:
            self.market_subscribers[currency_pair] = set()
            
        self.market_subscribers[currency_pair].add(websocket)
        
        await self.send_personal_message(
            {
                "type": "subscription",
                "status": "subscribed",
                "topic": "market",
                "currency_pair": currency_pair,
                "timestamp": datetime.now().isoformat()
            },
            websocket
        )
        
    async def subscribe_to_news(self, websocket: WebSocket) -> None:
        """
        Subscribe a client to news updates
        
        Args:
            websocket: WebSocket connection
        """
        self.news_subscribers.add(websocket)
        
        await self.send_personal_message(
            {
                "type": "subscription",
                "status": "subscribed",
                "topic": "news",
                "timestamp": datetime.now().isoformat()
            },
            websocket
        )
        
    async def unsubscribe_from_market(self, websocket: WebSocket, currency_pair: str) -> None:
        """
        Unsubscribe a client from market updates for a currency pair
        
        Args:
            websocket: WebSocket connection
            currency_pair: Currency pair
        """
        if currency_pair in self.market_subscribers and websocket in self.market_subscribers[currency_pair]:
            self.market_subscribers[currency_pair].remove(websocket)
            
            if not self.market_subscribers[currency_pair]:
                del self.market_subscribers[currency_pair]
                
            await self.send_personal_message(
                {
                    "type": "subscription",
                    "status": "unsubscribed",
                    "topic": "market",
                    "currency_pair": currency_pair,
                    "timestamp": datetime.now().isoformat()
                },
                websocket
            )
            
    async def unsubscribe_from_news(self, websocket: WebSocket) -> None:
        """
        Unsubscribe a client from news updates
        
        Args:
            websocket: WebSocket connection
        """
        if websocket in self.news_subscribers:
            self.news_subscribers.remove(websocket)
            
            await self.send_personal_message(
                {
                    "type": "subscription",
                    "status": "unsubscribed",
                    "topic": "news",
                    "timestamp": datetime.now().isoformat()
                },
                websocket
            )

# Create a global connection manager
manager = ConnectionManager()
