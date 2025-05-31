"""
WebSocket routes for real-time data delivery
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from pydantic import ValidationError

from app.core.config import settings
from app.core.security import get_current_user_ws
from app.models.user import User
from app.websockets.manager import manager
from app.services.oanda import get_live_price

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Main WebSocket endpoint
    """
    # Wait for connection message
    try:
        # Accept the connection
        await websocket.accept()
        
        # Get initial message
        data = await websocket.receive_json()
        
        # Check if token is provided
        if "token" not in data:
            await websocket.close(code=1008, reason="Missing authentication token")
            return
            
        # Validate token
        try:
            user = await get_current_user_ws(data["token"])
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            await websocket.close(code=1008, reason="Invalid authentication token")
            return
            
        # Connect to manager
        await manager.connect(websocket, str(user.id))
        
        # Handle messages
        try:
            while True:
                message = await websocket.receive_json()
                
                # Handle subscription messages
                if message.get("type") == "subscribe":
                    topic = message.get("topic")
                    
                    if topic == "market":
                        currency_pair = message.get("currency_pair")
                        if currency_pair:
                            await manager.subscribe_to_market(websocket, currency_pair)
                            
                            # Start sending price updates
                            asyncio.create_task(send_price_updates(websocket, currency_pair))
                    elif topic == "news":
                        await manager.subscribe_to_news(websocket)
                        
                # Handle unsubscription messages
                elif message.get("type") == "unsubscribe":
                    topic = message.get("topic")
                    
                    if topic == "market":
                        currency_pair = message.get("currency_pair")
                        if currency_pair:
                            await manager.unsubscribe_from_market(websocket, currency_pair)
                    elif topic == "news":
                        await manager.unsubscribe_from_news(websocket)
        except WebSocketDisconnect:
            await manager.disconnect(websocket)
        except Exception as e:
            logger.error(f"WebSocket error: {str(e)}")
            await manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"Connection error: {str(e)}")
        try:
            await websocket.close(code=1011, reason="Server error")
        except:
            pass

async def send_price_updates(websocket: WebSocket, currency_pair: str):
    """
    Send price updates to a client
    
    Args:
        websocket: WebSocket connection
        currency_pair: Currency pair
    """
    try:
        while True:
            # Check if still subscribed
            subscribed = False
            for pair, subscribers in manager.market_subscribers.items():
                if pair == currency_pair and websocket in subscribers:
                    subscribed = True
                    break
                    
            if not subscribed:
                break
                
            # Get price data
            try:
                price_data = await get_live_price(currency_pair)
                
                if price_data:
                    await manager.send_personal_message(
                        {
                            "type": "market_update",
                            "currency_pair": currency_pair,
                            "data": price_data,
                            "timestamp": datetime.now().isoformat()
                        },
                        websocket
                    )
            except Exception as e:
                logger.error(f"Error getting price data: {str(e)}")
                
            # Wait before next update
            await asyncio.sleep(1)  # Update every second
    except Exception as e:
        logger.error(f"Error sending price updates: {str(e)}")
        await manager.disconnect(websocket)

@router.post("/broadcast/signal")
async def broadcast_signal(
    user_id: str,
    signal_data: Dict[str, Any],
    current_user: User = Depends(get_current_user_ws)
):
    """
    Broadcast a signal update to a user
    
    Args:
        user_id: User ID
        signal_data: Signal data
        
    Returns:
        Success message
    """
    # Only admin users can broadcast signals to other users
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to broadcast signals to other users")
        
    await manager.broadcast_signal_update(user_id, signal_data)
    
    return {"status": "success", "message": "Signal broadcasted"}

@router.post("/broadcast/news")
async def broadcast_news(
    news_data: Dict[str, Any],
    current_user: User = Depends(get_current_user_ws)
):
    """
    Broadcast news to subscribers
    
    Args:
        news_data: News data
        
    Returns:
        Success message
    """
    # Only admin users can broadcast news
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to broadcast news")
        
    await manager.broadcast_news(news_data)
    
    return {"status": "success", "message": "News broadcasted"}
