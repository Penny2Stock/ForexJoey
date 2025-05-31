"""
Market Service

This module provides market data services for ForexJoey, integrating various data sources
to provide comprehensive market intelligence.
"""

import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta

from ..models.market import (
    Candle, 
    MarketData, 
    NewsItem, 
    EconomicCalendarEvent, 
    MarketSentiment,
    CurrencyStrength,
    Timeframe
)
from .oanda import (
    get_candles,
    get_market_data as get_oanda_data,
    get_analyzed_market_data
)
from .economic_calendar import (
    get_economic_calendar as get_calendar_events,
    analyze_calendar_impact
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for market data to reduce API calls
_market_data_cache = {}
_cache_expiry = {}
CACHE_TTL = 300  # 5 minutes in seconds

async def get_oanda_market_data(
    instrument: str,
    granularity: Timeframe,
    count: int = 100
) -> MarketData:
    """
    Get market data from OANDA with caching.
    
    Args:
        instrument: The instrument code (e.g., "EUR_USD")
        granularity: The timeframe for candles
        count: Number of candles to retrieve
        
    Returns:
        MarketData object with candles
    """
    cache_key = f"market_{instrument}_{granularity}_{count}"
    
    # Check if we have a valid cached response
    current_time = datetime.now().timestamp()
    if cache_key in _market_data_cache and current_time < _cache_expiry.get(cache_key, 0):
        logger.info(f"Using cached market data for {cache_key}")
        return _market_data_cache[cache_key]
    
    # Get fresh data
    try:
        # For more comprehensive analysis, use analyzed_market_data which includes technical indicators
        market_data = await get_analyzed_market_data(
            instrument=instrument,
            granularity=granularity,
            count=count
        )
        
        # Update cache
        _market_data_cache[cache_key] = market_data
        _cache_expiry[cache_key] = current_time + CACHE_TTL
        
        return market_data
    except Exception as e:
        logger.error(f"Error fetching market data: {str(e)}")
        # Fallback to simpler data fetch if analysis fails
        return await get_oanda_data(instrument=instrument, granularity=granularity, count=count)

async def get_economic_calendar(
    days_ahead: int = 7,
    days_back: int = 1,
    impact: Optional[str] = None,
    currencies: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Get economic calendar events with optional filtering.
    
    Args:
        days_ahead: Number of days ahead to fetch events for
        days_back: Number of days back to fetch events for
        impact: Filter events by impact level (HIGH, MEDIUM, LOW)
        currencies: Filter events by currencies
        
    Returns:
        List of economic calendar events
    """
    # This is now a direct pass-through to our economic_calendar service
    return await get_calendar_events(
        days_ahead=days_ahead,
        days_back=days_back,
        impact=impact,
        currencies=currencies
    )

# Mock news data for now - will be replaced with actual news API
async def get_latest_news(
    currencies: Optional[List[str]] = None,
    limit: int = 10
) -> List[NewsItem]:
    """
    Get latest forex news with sentiment analysis.
    
    Args:
        currencies: Optional list of currencies to filter news by
        limit: Maximum number of news items to return
        
    Returns:
        List of NewsItem objects
    """
    # TODO: Implement actual news API integration
    # For now, return mock data
    mock_news = [
        NewsItem(
            title="Fed signals potential rate cuts in 2025",
            source="Financial Times",
            url="https://ft.com/markets/fed-signals-rate-cuts",
            published_at=datetime.now() - timedelta(hours=2),
            content="The Federal Reserve has signaled it may consider rate cuts in 2025 as inflation pressures ease.",
            sentiment_score=0.2,  # slightly positive
            relevance_score=0.9,
            currencies=["USD"]
        ),
        NewsItem(
            title="ECB holds rates steady amid economic uncertainty",
            source="Bloomberg",
            url="https://bloomberg.com/news/ecb-holds-rates",
            published_at=datetime.now() - timedelta(hours=4),
            content="The European Central Bank decided to maintain current interest rates as economic uncertainty persists.",
            sentiment_score=-0.1,  # slightly negative
            relevance_score=0.85,
            currencies=["EUR"]
        ),
        NewsItem(
            title="Bank of Japan intervenes to support weakening Yen",
            source="Reuters",
            url="https://reuters.com/markets/boj-intervenes",
            published_at=datetime.now() - timedelta(hours=6),
            content="The Bank of Japan has intervened in currency markets to support the weakening Yen against the dollar.",
            sentiment_score=0.3,  # positive for JPY
            relevance_score=0.95,
            currencies=["JPY", "USD"]
        )
    ]
    
    # Filter by currencies if specified
    if currencies:
        currencies = [c.upper() for c in currencies]
        filtered_news = []
        for news in mock_news:
            if any(currency in news.currencies for currency in currencies):
                filtered_news.append(news)
        return filtered_news[:limit]
    
    return mock_news[:limit]

async def get_market_sentiment(instrument: str) -> MarketSentiment:
    """
    Get market sentiment data for a specific instrument.
    
    Args:
        instrument: The instrument code (e.g., "EUR_USD")
        
    Returns:
        MarketSentiment object
    """
    # TODO: Implement actual sentiment analysis from social media, positioning data, etc.
    # For now, return mock data
    currencies = instrument.split("_")
    
    # Mock different sentiments for different currency pairs
    if instrument == "EUR_USD":
        bullish = 0.65
        bearish = 0.25
        neutral = 0.10
    elif instrument == "GBP_USD":
        bullish = 0.45
        bearish = 0.35
        neutral = 0.20
    elif instrument == "USD_JPY":
        bullish = 0.30
        bearish = 0.55
        neutral = 0.15
    else:
        # Default values
        bullish = 0.40
        bearish = 0.40
        neutral = 0.20
    
    return MarketSentiment(
        instrument=instrument,
        bullish_percentage=bullish,
        bearish_percentage=bearish,
        neutral_percentage=neutral,
        source="ForexJoey AI",
        time=datetime.now()
    )

async def get_currency_strength(timeframe: Timeframe = Timeframe.H4) -> List[CurrencyStrength]:
    """
    Get relative strength index for major currencies.
    
    Args:
        timeframe: The timeframe to analyze
        
    Returns:
        List of CurrencyStrength objects
    """
    # TODO: Implement actual currency strength calculation based on price action
    # For now, return mock data
    major_currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"]
    
    # Mock strength values
    strengths = {
        "USD": 0.85,
        "EUR": 0.62,
        "GBP": 0.58,
        "JPY": 0.70,
        "AUD": 0.45,
        "CAD": 0.52,
        "CHF": 0.67,
        "NZD": 0.48
    }
    
    return [
        CurrencyStrength(
            currency=currency,
            strength_index=strength,
            time=datetime.now()
        )
        for currency, strength in strengths.items()
    ]

async def get_multi_source_analysis(
    instrument: str,
    timeframe: Timeframe = Timeframe.H1
) -> Dict[str, Any]:
    """
    Get comprehensive multi-source analysis for a currency pair.
    Combines technical, fundamental, and sentiment analysis.
    
    Args:
        instrument: The instrument code (e.g., "EUR_USD")
        timeframe: The timeframe to analyze
        
    Returns:
        Dictionary with comprehensive analysis results
    """
    # Parse currency pair
    currencies = instrument.split("_")
    if len(currencies) != 2:
        raise ValueError(f"Invalid instrument format: {instrument}")
    
    base_currency, quote_currency = currencies
    
    # Get data from multiple sources in parallel
    # 1. Technical analysis
    technical_data = await get_oanda_market_data(
        instrument=instrument,
        granularity=timeframe,
        count=100
    )
    
    # 2. Economic calendar analysis
    economic_analysis = await analyze_calendar_impact(
        currency_pair=instrument,
        days_ahead=7,
        days_back=1
    )
    
    # 3. Sentiment analysis
    sentiment_data = await get_market_sentiment(instrument)
    
    # Combine the analyses
    # For now, use a simple averaging approach
    # In a more sophisticated system, this would use AI to weigh different factors
    
    # Determine technical direction based on recent price action
    candles = technical_data.candles[-5:]  # Last 5 candles
    if candles[-1].close > candles[0].open:
        technical_direction = "BULLISH"
        technical_confidence = min(0.9, (candles[-1].close - candles[0].open) / candles[0].open * 10)
    else:
        technical_direction = "BEARISH"
        technical_confidence = min(0.9, (candles[0].open - candles[-1].close) / candles[0].open * 10)
    
    # Extract economic direction and confidence
    economic_direction = economic_analysis.get("impact", "NEUTRAL")
    economic_confidence = economic_analysis.get("confidence", 0.5)
    
    # Extract sentiment direction and confidence
    if sentiment_data.bullish_percentage > sentiment_data.bearish_percentage:
        sentiment_direction = "BULLISH"
        sentiment_confidence = sentiment_data.bullish_percentage
    else:
        sentiment_direction = "BEARISH"
        sentiment_confidence = sentiment_data.bearish_percentage
    
    # Convert directions to numerical values for averaging
    direction_values = {
        "BULLISH": 1,
        "NEUTRAL": 0,
        "BEARISH": -1
    }
    
    # Calculate weighted average
    technical_weight = 0.5  # 50% weight on technical analysis
    economic_weight = 0.3   # 30% weight on economic analysis
    sentiment_weight = 0.2  # 20% weight on sentiment analysis
    
    weighted_direction = (
        direction_values.get(technical_direction, 0) * technical_weight +
        direction_values.get(economic_direction, 0) * economic_weight +
        direction_values.get(sentiment_direction, 0) * sentiment_weight
    )
    
    # Determine overall direction
    if weighted_direction > 0.2:
        overall_direction = "BULLISH"
    elif weighted_direction < -0.2:
        overall_direction = "BEARISH"
    else:
        overall_direction = "NEUTRAL"
    
    # Calculate overall confidence
    overall_confidence = (
        technical_confidence * technical_weight +
        economic_confidence * economic_weight +
        sentiment_confidence * sentiment_weight
    )
    
    # Create detailed reasoning
    reasoning = (
        f"Technical analysis ({technical_weight*100:.0f}%): {technical_direction} with {technical_confidence:.2f} confidence. "
        f"Economic calendar ({economic_weight*100:.0f}%): {economic_direction} with {economic_confidence:.2f} confidence. "
        f"Market sentiment ({sentiment_weight*100:.0f}%): {sentiment_direction} with {sentiment_confidence:.2f} confidence."
    )
    
    return {
        "instrument": instrument,
        "timeframe": timeframe,
        "direction": overall_direction,
        "confidence": overall_confidence,
        "reasoning": reasoning,
        "technical_analysis": {
            "direction": technical_direction,
            "confidence": technical_confidence
        },
        "economic_analysis": {
            "direction": economic_direction,
            "confidence": economic_confidence,
            "details": economic_analysis.get("reasoning", "")
        },
        "sentiment_analysis": {
            "direction": sentiment_direction,
            "confidence": sentiment_confidence,
            "bullish": sentiment_data.bullish_percentage,
            "bearish": sentiment_data.bearish_percentage,
            "neutral": sentiment_data.neutral_percentage
        },
        "timestamp": datetime.now().isoformat()
    }
