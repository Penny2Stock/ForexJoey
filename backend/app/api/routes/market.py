from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from ...models.user import User
from ...models.market import (
    MarketData, 
    NewsItem, 
    EconomicCalendarEvent, 
    MarketSentiment,
    CurrencyStrength,
    Timeframe
)
from ...services.auth import get_current_user
from ...services.market import (
    get_oanda_market_data,
    get_latest_news,
    get_economic_calendar,
    get_market_sentiment,
    get_currency_strength,
    get_multi_source_analysis
)

router = APIRouter()

@router.get("/price/{instrument}", response_model=MarketData)
async def get_market_data(
    instrument: str,
    granularity: Timeframe = Query(Timeframe.H1),
    count: int = Query(100, ge=1, le=5000),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get historical market data for a specific instrument.
    """
    try:
        data = await get_oanda_market_data(
            instrument=instrument,
            granularity=granularity,
            count=count
        )
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching market data: {str(e)}"
        )

@router.get("/news", response_model=List[NewsItem])
async def get_news(
    currencies: Optional[str] = Query(None, description="Comma-separated list of currencies (e.g., EUR,USD,JPY)"),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get latest forex news with sentiment analysis.
    Filter by specific currencies if needed.
    """
    currency_list = currencies.split(",") if currencies else None
    news = await get_latest_news(
        currencies=currency_list,
        limit=limit
    )
    return news

@router.get("/economic-calendar", response_model=List[EconomicCalendarEvent])
async def get_calendar(
    days_ahead: int = Query(7, ge=0, le=30),
    days_back: int = Query(1, ge=0, le=7),
    impact: Optional[str] = Query(None, description="Filter by impact (HIGH, MEDIUM, LOW)"),
    currencies: Optional[str] = Query(None, description="Comma-separated list of currencies"),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get economic calendar events.
    """
    currency_list = currencies.split(",") if currencies else None
    calendar = await get_economic_calendar(
        days_ahead=days_ahead,
        days_back=days_back,
        impact=impact,
        currencies=currency_list
    )
    return calendar

@router.get("/sentiment/{instrument}", response_model=MarketSentiment)
async def get_sentiment(
    instrument: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get market sentiment data for a specific instrument.
    Combines social media sentiment, positioning data, and news sentiment.
    """
    sentiment = await get_market_sentiment(instrument=instrument)
    return sentiment

@router.get("/currency-strength", response_model=List[CurrencyStrength])
async def get_strength(
    timeframe: Timeframe = Query(Timeframe.H4),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get relative strength index for major currencies.
    """
    strength = await get_currency_strength(timeframe=timeframe)
    return strength

@router.get("/analysis/{instrument}")
async def get_analysis(
    instrument: str,
    timeframe: Timeframe = Query(Timeframe.H1),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get comprehensive multi-source analysis for a currency pair.
    Combines technical, fundamental, and sentiment analysis to provide a high-confidence signal.
    Each signal is backed by at least 2 intelligence sources as per ForexJoey's AI-first approach.
    
    The analysis includes:
    - Technical indicators and price action
    - Economic calendar events and their impact
    - Market sentiment from various sources
    
    Returns a detailed breakdown with reasoning and confidence scores.
    """    
    analysis = await get_multi_source_analysis(
        instrument=instrument,
        timeframe=timeframe
    )
    return analysis
