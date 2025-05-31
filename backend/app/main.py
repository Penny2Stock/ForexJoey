import asyncio
import logging
from typing import Dict, List, Any, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api.routes import auth, signals, market, trading, user, sentiment, websocket
from .core.config import settings
from .services.oanda import start_price_stream, stop_price_stream
from .websockets.manager import manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Common currency pairs to monitor
DEFAULT_CURRENCY_PAIRS = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "AUD/USD",
    "USD/CAD",
    "USD/CHF",
    "NZD/USD",
    "EUR/GBP",
    "EUR/JPY",
    "GBP/JPY"
]

# Store active price streams
active_streams = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for the application"""
    # Startup: initialize price streams
    logger.info("Starting ForexJoey API and initializing price streams...")
    
    # Start price streams for default currency pairs
    for currency_pair in DEFAULT_CURRENCY_PAIRS:
        try:
            await start_price_stream(currency_pair)
            active_streams.add(currency_pair)
            logger.info(f"Started monitoring {currency_pair}")
        except Exception as e:
            logger.error(f"Failed to start price stream for {currency_pair}: {str(e)}")
    
    yield
    
    # Shutdown: cleanup price streams
    logger.info("Shutting down ForexJoey API and cleaning up price streams...")
    for currency_pair in active_streams.copy():
        try:
            await stop_price_stream(currency_pair)
            active_streams.remove(currency_pair)
            logger.info(f"Stopped monitoring {currency_pair}")
        except Exception as e:
            logger.error(f"Failed to stop price stream for {currency_pair}: {str(e)}")

app = FastAPI(
    title="ForexJoey API",
    description="AI-first, forex-only autonomous agent API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(signals.router, prefix="/api/signals", tags=["Trading Signals"])
app.include_router(market.router, prefix="/api/market", tags=["Market Data"])
app.include_router(trading.router, prefix="/api/trading", tags=["Trading Execution"])
app.include_router(user.router, prefix="/api/user", tags=["User Management"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment Analysis"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])

@app.get("/", tags=["Health Check"])
async def root():
    """
    Health check endpoint
    """
    return {
        "status": "online",
        "service": "ForexJoey AI Agent",
        "version": "1.0.0"
    }
