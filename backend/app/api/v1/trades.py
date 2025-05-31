"""
Trades API Module for ForexJoey

This module provides API endpoints for trade management, execution, and reflection.
ForexJoey continuously learns from trade outcomes to optimize its intelligence models.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field, validator

from app.services.supabase_service import SupabaseService
from app.api.deps import get_current_user

# Models
class TradeBase(BaseModel):
    """Base model for trades"""
    signal_id: Optional[str] = Field(None, description="Associated signal ID if any")
    user_id: str = Field(..., description="User ID who owns this trade")
    currency_pair: str = Field(..., description="Currency pair (e.g., EUR/USD)")
    direction: str = Field(..., description="Buy or Sell")
    entry_price: float = Field(..., description="Entry price")
    stop_loss: float = Field(..., description="Stop loss price")
    take_profit: float = Field(..., description="Take profit price")
    lot_size: float = Field(..., description="Lot size")
    timeframe: str = Field(..., description="Timeframe (e.g., H1, H4, D)")
    
    @validator('direction')
    def validate_direction(cls, v):
        if v.lower() not in ['buy', 'sell']:
            raise ValueError('Direction must be either "buy" or "sell"')
        return v.lower()

class TradeCreate(TradeBase):
    """Model for creating a new trade"""
    leverage: Optional[float] = Field(None, description="Leverage used for this trade")
    entry_comment: Optional[str] = Field(None, description="Comment for entry")
    entry_sources: List[str] = Field(
        default=["technical", "fundamental"],
        description="Intelligence sources used for this entry"
    )

class TradeUpdate(BaseModel):
    """Model for updating an existing trade"""
    exit_price: Optional[float] = Field(None, description="Exit price")
    exit_time: Optional[datetime] = Field(None, description="Exit time")
    exit_comment: Optional[str] = Field(None, description="Comment for exit")
    status: Optional[str] = Field(None, description="Status of the trade")
    pnl_pips: Optional[float] = Field(None, description="Profit/loss in pips")
    pnl_amount: Optional[float] = Field(None, description="Profit/loss in account currency")
    pnl_percentage: Optional[float] = Field(None, description="Profit/loss as percentage of account")

class TradeResponse(TradeBase):
    """Response model for a trade"""
    id: str
    entry_time: datetime
    status: str
    exit_price: Optional[float] = None
    exit_time: Optional[datetime] = None
    pnl_pips: Optional[float] = None
    pnl_amount: Optional[float] = None
    pnl_percentage: Optional[float] = None
    risk_reward_ratio: Optional[float] = None
    risk_percentage: Optional[float] = None
    leverage: Optional[float] = None
    entry_comment: Optional[str] = None
    exit_comment: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

# Router
router = APIRouter(prefix="/trades", tags=["trades"])
supabase_service = SupabaseService()

@router.get("/", response_model=List[TradeResponse])
async def get_trades(
    currency_pair: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """
    Get trades for the current user with optional filtering
    
    This endpoint provides access to the user's trading history, which is essential for
    ForexJoey's continuous learning and reflection process.
    """
    try:
        # User ID will be extracted from the token in a production scenario
        user_id = "current-user-id" # This would be extracted from the token
        
        params = {
            "currency_pair": currency_pair,
            "status": status,
            "limit": limit,
            "offset": offset
        }
        
        trades = await supabase_service.get_trades(
            user_id=user_id, 
            params=params,
            auth_token=current_user["token"]
        )
        
        return trades
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{trade_id}", response_model=TradeResponse)
async def get_trade(
    trade_id: str = Path(..., description="Trade ID to retrieve"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific trade by ID
    """
    try:
        # In production, we would check that the trade belongs to the user
        trades = await supabase_service.get_trades(
            user_id="current-user-id", # This would be extracted from the token
            params={"id": trade_id},
            auth_token=current_user["token"]
        )
        
        if not trades:
            raise HTTPException(status_code=404, detail="Trade not found")
            
        return trades[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Dict)
async def create_trade(
    trade: TradeCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new trade
    
    This endpoint first validates the trade against the user's risk management rules,
    ensuring capital protection, before executing it.
    """
    try:
        # In production, we would set the user_id from the token
        # trade.user_id = current_user["user_id"]
        
        # Convert model to dict for Supabase
        trade_data = trade.dict()
        
        # Add entry time as now
        trade_data["entry_time"] = datetime.now().isoformat()
        trade_data["status"] = "open"
        
        # Validate trade against risk management rules and create it
        response = await supabase_service.create_trade(
            trade_data=trade_data,
            auth_token=current_user["token"]
        )
        
        # Check if there was an error with risk management
        if "error" in response:
            return response
        
        return {"message": "Trade created successfully", "trade_id": response.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{trade_id}", response_model=Dict)
async def update_trade(
    trade_id: str,
    trade_update: TradeUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing trade (typically to close it)
    
    After closing a trade, ForexJoey automatically triggers the reflection process
    to learn from the outcome and improve future predictions.
    """
    try:
        # In production, we would check that the trade belongs to the user
        
        # Convert model to dict for Supabase
        trade_data = trade_update.dict(exclude_unset=True)
        
        # If status is set to closed, ensure we have exit price and time
        if trade_data.get("status") == "closed" and not trade_data.get("exit_time"):
            trade_data["exit_time"] = datetime.now().isoformat()
        
        # Update the trade
        response = await supabase_service.update_trade(
            trade_id=trade_id,
            trade_data=trade_data,
            auth_token=current_user["token"]
        )
        
        # If trade was closed, trigger reflection
        if trade_data.get("status") == "closed":
            await supabase_service.reflect_on_trade(
                trade_id=trade_id,
                auth_token=current_user["token"]
            )
        
        return {"message": "Trade updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{trade_id}/reflect", response_model=Dict)
async def reflect_on_trade(
    trade_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Manually trigger AI reflection on a trade
    
    ForexJoey's continuous learning capabilities ensure that it improves over time
    by analyzing trade outcomes and adjusting its intelligence models.
    """
    try:
        # Trigger reflection through Supabase edge function
        reflection = await supabase_service.reflect_on_trade(
            trade_id=trade_id,
            auth_token=current_user["token"]
        )
        
        return reflection
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
