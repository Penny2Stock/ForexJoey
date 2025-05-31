""" 
API Routes Module for ForexJoey

This module imports and organizes all API routers for the FastAPI application.
It follows ForexJoey's AI-first, forex-only autonomous agent architecture.
"""

from fastapi import APIRouter

# Import v1 API routers
from app.api.v1 import signals, market_data, trades, risk_management, auth

# Create API router that includes all endpoints
router = APIRouter()

# Include all version 1 routers
router.include_router(auth.router, prefix="/v1")
router.include_router(signals.router, prefix="/v1")
router.include_router(market_data.router, prefix="/v1")
router.include_router(trades.router, prefix="/v1")
router.include_router(risk_management.router, prefix="/v1")

# Export routers for main application
auth = auth.router
market = market_data.router
signals = signals.router
trading = trades.router
risk = risk_management.router
user = APIRouter()  # Placeholder for user router - would be implemented separately
sentiment = APIRouter()  # Placeholder for sentiment router - would be implemented separately
websocket = APIRouter()  # Placeholder for websocket router - would be implemented separately
