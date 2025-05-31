"""
Reflection API routes for ForexJoey

These routes enable:
1. Submitting signal outcomes for AI reflection
2. Retrieving AI performance metrics
3. Getting reflection history for a signal
"""

from typing import Dict, List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body

from app.models.user import User
from app.core.security import get_current_user
from app.db.reflection import ReflectionEngine
from app.db.supabase import Database

router = APIRouter()

@router.post("/signal-outcome/{signal_id}")
async def reflect_on_signal_outcome(
    signal_id: str,
    outcome_data: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user)
):
    """
    Submit a signal outcome for AI reflection
    
    Args:
        signal_id: Signal ID
        outcome_data: Outcome data including price_at_close, profit_loss_pips, etc.
        
    Returns:
        Reflection data
    """
    # Verify signal belongs to user
    signal = await Database.get_signal_by_id(signal_id)
    
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
        
    if signal.get("user_id") != str(current_user.id) and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this signal")
        
    # Generate reflection
    reflection = await ReflectionEngine.reflect_on_signal_outcome(signal_id, outcome_data)
    
    # Create notification for user
    direction = signal.get("direction", "").upper()
    pair = signal.get("currency_pair", "")
    outcome_type = outcome_data.get("outcome_type", "")
    profit_loss = outcome_data.get("profit_loss_pips", 0)
    
    notification_data = {
        "user_id": signal.get("user_id"),
        "title": f"{direction} {pair} Signal {outcome_type}",
        "message": f"Your {direction} signal for {pair} has {outcome_type.lower()} with {profit_loss} pips. AI has analyzed this outcome to improve future predictions.",
        "type": "signal_outcome",
        "link": f"/dashboard/signals/{signal_id}",
        "is_read": False
    }
    
    await Database.create_user_notification(notification_data)
    
    return reflection

@router.get("/signal-history/{signal_id}")
async def get_signal_history(
    signal_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get reflection history for a signal
    
    Args:
        signal_id: Signal ID
        
    Returns:
        List of reflections
    """
    # Verify signal belongs to user
    signal = await Database.get_signal_by_id(signal_id)
    
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
        
    if signal.get("user_id") != str(current_user.id) and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this signal")
        
    # Get history
    history = await ReflectionEngine.get_signal_history(signal_id)
    
    return history

@router.get("/performance/{currency_pair}")
async def get_performance_metrics(
    currency_pair: str,
    timeframe: str = Query(..., description="Timeframe for metrics"),
    current_user: User = Depends(get_current_user)
):
    """
    Get AI performance metrics for a currency pair and timeframe
    
    Args:
        currency_pair: Currency pair
        timeframe: Timeframe
        
    Returns:
        Performance metrics
    """
    metrics = await ReflectionEngine.get_performance_metrics(currency_pair, timeframe)
    
    return metrics

@router.get("/performance/all")
async def get_all_performance_metrics(
    current_user: User = Depends(get_current_user)
):
    """
    Get all AI performance metrics
    
    Returns:
        List of performance metrics
    """
    try:
        response = await Database.supabase.table("ai_performance_metrics").select("*").execute()
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching performance metrics: {str(e)}")

@router.get("/insights")
async def get_ai_insights(
    limit: int = Query(5, description="Number of insights to return"),
    current_user: User = Depends(get_current_user)
):
    """
    Get top AI insights from reflections
    
    Returns:
        List of insights
    """
    try:
        # Get most recent reflections with lessons learned
        response = await Database.supabase.table("signal_outcomes") \
            .select("signal_id, ai_reflection, lessons_learned, created_at") \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
            
        insights = []
        for outcome in response.data:
            if "lessons_learned" in outcome and outcome["lessons_learned"]:
                # Get signal information
                signal = await Database.get_signal_by_id(outcome["signal_id"])
                
                if signal:
                    insights.append({
                        "signal_id": outcome["signal_id"],
                        "currency_pair": signal.get("currency_pair"),
                        "direction": signal.get("direction"),
                        "timeframe": signal.get("timeframe"),
                        "lessons_learned": outcome["lessons_learned"],
                        "created_at": outcome["created_at"]
                    })
                    
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching AI insights: {str(e)}")
