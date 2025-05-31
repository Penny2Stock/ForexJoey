"""
Market Data API Module for ForexJoey

This module provides API endpoints for real-time and historical forex market data,
which is essential for ForexJoey's AI-first trading signal generation.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.services.supabase_service import SupabaseService
from app.api.deps import get_current_user

# Models
class MarketDataRequest(BaseModel):
    """Request model for market data"""
    currency_pair: str = Field(..., description="Currency pair (e.g., EUR/USD)")
    timeframe: str = Field(..., description="Timeframe (e.g., M5, H1, H4, D)")
    count: int = Field(100, description="Number of candles to retrieve")

class CandleData(BaseModel):
    """Model for a single candle"""
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: Optional[int]

class CurrentPrice(BaseModel):
    """Model for current price data"""
    instrument: str
    time: str
    bid: float
    ask: float
    mid: float

class MarketDataResponse(BaseModel):
    """Response model for market data"""
    currency_pair: str
    timeframe: str
    candles: List[CandleData]
    current_price: CurrentPrice

# Router
router = APIRouter(prefix="/market-data", tags=["market-data"])
supabase_service = SupabaseService()

@router.post("/", response_model=MarketDataResponse)
async def get_market_data(
    request: MarketDataRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Get real-time forex market data from OANDA
    
    This endpoint provides the essential live data required for ForexJoey's
    AI-first trading signal generation. Live data is non-negotiable for 
    accurate forex trading decisions.
    """
    try:
        # Get market data from Supabase edge function
        market_data = await supabase_service.get_market_data(
            currency_pair=request.currency_pair,
            timeframe=request.timeframe,
            count=request.count,
            auth_token=current_user["token"]
        )
        
        return market_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving market data: {str(e)}")

@router.get("/pairs", response_model=List[str])
async def get_available_pairs(
    current_user: dict = Depends(get_current_user)
):
    """
    Get list of available currency pairs for trading
    """
    # These are the most common forex pairs supported by most brokers
    forex_pairs = [
        "EUR/USD", "USD/JPY", "GBP/USD", "AUD/USD", "USD/CHF", 
        "NZD/USD", "USD/CAD", "EUR/GBP", "EUR/JPY", "EUR/CHF",
        "EUR/CAD", "EUR/AUD", "GBP/JPY", "GBP/CHF", "AUD/JPY",
        "CHF/JPY", "CAD/JPY", "AUD/CAD", "AUD/CHF", "AUD/NZD"
    ]
    
    return forex_pairs

@router.get("/timeframes", response_model=Dict[str, str])
async def get_available_timeframes(
    current_user: dict = Depends(get_current_user)
):
    """
    Get list of available timeframes with descriptions
    """
    timeframes = {
        "M1": "1 minute",
        "M5": "5 minutes",
        "M15": "15 minutes",
        "M30": "30 minutes",
        "H1": "1 hour",
        "H4": "4 hours",
        "D": "Daily",
        "W": "Weekly",
        "M": "Monthly"
    }
    
    return timeframes
