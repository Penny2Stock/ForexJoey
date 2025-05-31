from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from ...models.user import User
from ...models.signal import Signal, SignalCreate, SignalUpdate, SignalPerformance
from ...services.auth import get_current_user
from ...services.signals import (
    generate_signal,
    get_signals_for_user,
    get_signal_by_id,
    update_signal,
    get_user_performance
)

router = APIRouter()

@router.get("/", response_model=List[Signal])
async def read_signals(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    currency_pair: Optional[str] = None,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve signals for the current user.
    Optional filtering by status and currency pair.
    """
    signals = await get_signals_for_user(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        status=status,
        currency_pair=currency_pair
    )
    return signals

@router.post("/generate", response_model=Signal)
async def create_signal(
    currency_pair: str = Query(..., description="Currency pair (e.g., EUR/USD)"),
    timeframe: str = Query(..., description="Timeframe (M15, H1, H4, D1, W1)"),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Generate a new trading signal for the specified currency pair and timeframe.
    This endpoint triggers the AI analysis engine to create a comprehensive signal
    backed by multiple intelligence sources (TA, FA, Sentiment).
    """
    # Check if user has reached daily signal limit (for free tier)
    if not current_user.is_premium:
        today_signals = await get_signals_for_user(
            user_id=current_user.id,
            today_only=True
        )
        if len(today_signals) >= 3:  # Free tier limit
            raise HTTPException(
                status_code=403,
                detail="Free tier limited to 3 signals per day. Please upgrade to Premium."
            )
    
    signal = await generate_signal(
        user_id=current_user.id,
        currency_pair=currency_pair,
        timeframe=timeframe
    )
    return signal

@router.get("/{signal_id}", response_model=Signal)
async def read_signal(
    signal_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get a specific signal by ID.
    """
    signal = await get_signal_by_id(signal_id=signal_id, user_id=current_user.id)
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
    return signal

@router.put("/{signal_id}", response_model=Signal)
async def update_signal_status(
    signal_id: str,
    signal_update: SignalUpdate = Body(...),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update a signal (status, exit price, notes, etc.).
    """
    signal = await get_signal_by_id(signal_id=signal_id, user_id=current_user.id)
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
    
    updated_signal = await update_signal(
        signal_id=signal_id,
        user_id=current_user.id,
        signal_update=signal_update
    )
    return updated_signal

@router.get("/performance/stats", response_model=SignalPerformance)
async def get_performance(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get performance statistics for the user's signals.
    """
    performance = await get_user_performance(user_id=current_user.id)
    return performance
