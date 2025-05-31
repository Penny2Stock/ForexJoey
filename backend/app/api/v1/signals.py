"""
Trading Signals API Module for ForexJoey

This module provides API endpoints for trading signals, which are at the core of ForexJoey's AI-first approach.
All signals must be backed by at least 2 intelligence sources and include comprehensive risk management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field

from app.services.supabase_service import SupabaseService
from app.api.deps import get_current_user

# Models
class IntelligenceSource(BaseModel):
    """Intelligence source for a trading signal"""
    name: str = Field(..., description="Name of the intelligence source")
    confidence: float = Field(..., description="Confidence score (0-100)")
    reasoning: str = Field(..., description="Detailed reasoning for this source's analysis")

class SignalRequest(BaseModel):
    """Request model for generating a new trading signal"""
    currency_pair: str = Field(..., description="Currency pair (e.g., EUR/USD)")
    timeframe: str = Field(..., description="Timeframe (e.g., H1, H4, D)")
    sources: List[str] = Field(
        default=["technical", "fundamental", "sentiment", "economic"],
        description="Intelligence sources to use (minimum 2 required)"
    )

class SignalResponse(BaseModel):
    """Response model for a trading signal"""
    id: str
    currency_pair: str
    direction: str
    entry_price: float
    stop_loss: float
    take_profit: float
    timeframe: str
    confidence_score: float
    status: str
    signal_expiry: Optional[datetime]
    created_at: datetime
    technical_score: Optional[float]
    fundamental_score: Optional[float]
    sentiment_score: Optional[float]
    economic_score: Optional[float]
    risk_reward_ratio: Optional[float]
    ai_reasoning: str
    technical_reasoning: Optional[str]
    fundamental_reasoning: Optional[str]
    sentiment_reasoning: Optional[str]
    economic_reasoning: Optional[str]

# Router
router = APIRouter(prefix="/signals", tags=["signals"])
supabase_service = SupabaseService()

@router.get("/", response_model=List[SignalResponse])
async def get_signals(
    currency_pair: Optional[str] = None,
    timeframe: Optional[str] = None,
    status: Optional[str] = None,
    confidence_min: Optional[float] = None,
    limit: int = 10,
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """
    Get trading signals with optional filtering
    
    ForexJoey's AI-first approach ensures all signals have multiple intelligence sources
    and comprehensive risk management parameters.
    """
    try:
        params = {
            "currency_pair": currency_pair,
            "timeframe": timeframe,
            "status": status,
            "confidence_min": confidence_min,
            "limit": limit,
            "offset": offset
        }
        
        signals = await supabase_service.get_signals(
            params=params,
            auth_token=current_user["token"]
        )
        
        return signals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{signal_id}", response_model=SignalResponse)
async def get_signal(
    signal_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific trading signal by ID with detailed multi-source intelligence
    """
    try:
        signal = await supabase_service.get_signal_by_id(
            signal_id=signal_id,
            auth_token=current_user["token"]
        )
        
        if not signal:
            raise HTTPException(status_code=404, detail="Signal not found")
            
        return signal[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
async def create_signal(
    signal_request: SignalRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a new trading signal using ForexJoey's AI-first approach
    
    This endpoint leverages multiple intelligence sources to ensure high-accuracy
    trading signals with proper risk management.
    """
    try:
        # Validate that at least 2 intelligence sources are selected
        if len(signal_request.sources) < 2:
            raise HTTPException(
                status_code=400, 
                detail="At least 2 intelligence sources are required for signal generation"
            )
        
        signal_data = {
            "currencyPair": signal_request.currency_pair,
            "timeframe": signal_request.timeframe,
            "sources": signal_request.sources
        }
        
        signal_response = await supabase_service.create_signal(
            signal_data=signal_data,
            auth_token=current_user["token"]
        )
        
        return signal_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{signal_id}/reflect", response_model=dict)
async def reflect_on_signal(
    signal_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Trigger AI reflection on a signal to improve future accuracy
    
    ForexJoey continuously learns from signal performance to optimize its
    intelligence sources and improve prediction accuracy.
    """
    try:
        reflection = await supabase_service.reflect_on_trade(
            trade_id=None,
            auth_token=current_user["token"],
            signal_id=signal_id
        )
        
        return reflection
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
