"""
Risk Management API Module for ForexJoey

This module provides API endpoints for managing risk parameters and evaluating trade risk.
Risk management is a critical component of ForexJoey's AI-first approach to forex trading.
"""

from fastapi import APIRouter, Depends, HTTPException, Path
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, validator

from app.services.supabase_service import SupabaseService
from app.api.deps import get_current_user

# Models
class RiskRuleBase(BaseModel):
    """Base model for risk management rules"""
    max_loss_per_trade_percentage: float = Field(..., description="Maximum loss allowed per trade as percentage of account")
    max_daily_loss_percentage: float = Field(..., description="Maximum daily loss allowed as percentage of account")
    max_weekly_loss_percentage: float = Field(..., description="Maximum weekly loss allowed as percentage of account")
    position_sizing_method: str = Field(..., description="Method for position sizing (fixed_lot, fixed_percentage, risk_percentage)")
    take_profit_risk_ratio: float = Field(..., description="Target reward to risk ratio")
    auto_close_losing_trades: bool = Field(False, description="Automatically close losing trades that exceed max loss")
    correlation_limit: float = Field(0.7, description="Maximum allowed correlation between open trades")
    
    @validator('max_loss_per_trade_percentage', 'max_daily_loss_percentage', 'max_weekly_loss_percentage')
    def validate_percentage(cls, v):
        if v <= 0 or v > 100:
            raise ValueError('Percentage must be between 0 and 100')
        return v
    
    @validator('position_sizing_method')
    def validate_sizing_method(cls, v):
        valid_methods = ['fixed_lot', 'fixed_percentage', 'risk_percentage']
        if v not in valid_methods:
            raise ValueError(f'Position sizing method must be one of: {", ".join(valid_methods)}')
        return v

class RiskRuleCreate(RiskRuleBase):
    """Model for creating new risk management rules"""
    user_id: str = Field(..., description="User ID who owns these rules")
    active: bool = Field(True, description="Whether these rules are active")

class RiskRuleUpdate(BaseModel):
    """Model for updating existing risk management rules"""
    max_loss_per_trade_percentage: Optional[float] = None
    max_daily_loss_percentage: Optional[float] = None
    max_weekly_loss_percentage: Optional[float] = None
    position_sizing_method: Optional[str] = None
    take_profit_risk_ratio: Optional[float] = None
    auto_close_losing_trades: Optional[bool] = None
    correlation_limit: Optional[float] = None
    active: Optional[bool] = None

class RiskRuleResponse(RiskRuleBase):
    """Response model for risk management rules"""
    id: str
    user_id: str
    active: bool
    created_at: str
    updated_at: Optional[str] = None

class TradeRiskRequest(BaseModel):
    """Request model for trade risk assessment"""
    currency_pair: str = Field(..., description="Currency pair (e.g., EUR/USD)")
    direction: str = Field(..., description="Buy or Sell")
    entry_price: float = Field(..., description="Entry price")
    stop_loss: float = Field(..., description="Stop loss price")
    take_profit: float = Field(..., description="Take profit price")
    lot_size: float = Field(..., description="Lot size")
    account_balance: Optional[float] = None

    @validator('direction')
    def validate_direction(cls, v):
        if v.lower() not in ['buy', 'sell']:
            raise ValueError('Direction must be either "buy" or "sell"')
        return v.lower()

class TradeRiskResponse(BaseModel):
    """Response model for trade risk assessment"""
    passed: bool = Field(..., description="Whether the trade passes risk assessment")
    risk_amount: float = Field(..., description="Amount at risk in account currency")
    risk_percentage: float = Field(..., description="Percentage of account at risk")
    reward_amount: float = Field(..., description="Potential reward amount in account currency")
    reward_percentage: float = Field(..., description="Potential reward as percentage of account")
    risk_reward_ratio: float = Field(..., description="Risk to reward ratio")
    warnings: List[str] = Field(default=[], description="Risk warnings if any")
    adjustments: Dict = Field(default={}, description="Suggested adjustments to make trade compliant")

# Router
router = APIRouter(prefix="/risk-management", tags=["risk-management"])
supabase_service = SupabaseService()

@router.get("/rules", response_model=RiskRuleResponse)
async def get_risk_rules(current_user: dict = Depends(get_current_user)):
    """
    Get the active risk management rules for the current user
    
    ForexJoey prioritizes capital protection through strict risk management rules
    that all trade decisions must adhere to.
    """
    try:
        # User ID would be extracted from token in a production scenario
        user_id = "current-user-id"  # This would be extracted from the token
        
        rules = await supabase_service.get_risk_rules(
            user_id=user_id,
            auth_token=current_user["token"]
        )
        
        if not rules:
            raise HTTPException(status_code=404, detail="Risk management rules not found")
        
        return rules[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/rules/{rule_id}", response_model=Dict)
async def update_risk_rules(
    rule_id: str = Path(..., description="ID of the risk management rule to update"),
    rules: RiskRuleUpdate = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Update risk management rules
    
    This allows users to customize their risk parameters while ForexJoey ensures
    that all trade decisions comply with these settings.
    """
    try:
        # In production, we would verify that the rule belongs to the user
        
        # Convert model to dict for Supabase
        rule_data = rules.dict(exclude_unset=True)
        
        await supabase_service.update_risk_rules(
            rule_id=rule_id,
            rule_data=rule_data,
            auth_token=current_user["token"]
        )
        
        return {"message": "Risk rules updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assess", response_model=TradeRiskResponse)
async def assess_trade_risk(
    trade: TradeRiskRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Assess the risk of a potential trade against the user's risk rules
    
    This endpoint uses ForexJoey's risk-management edge function to analyze
    trade risk and ensure it complies with the user's capital protection parameters.
    """
    try:
        # Call the risk-management edge function
        risk_assessment = await supabase_service._request(
            method="POST",
            endpoint="/functions/v1/risk-management",
            data={"tradeData": trade.dict()},
            auth_token=current_user["token"]
        )
        
        return risk_assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
