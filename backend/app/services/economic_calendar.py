"""
Economic Calendar Service

This module provides functionality to fetch, process, and analyze economic calendar data.
It serves as a bridge between the AI engine's economic calendar analysis and the backend API.
"""

import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import httpx
import asyncio
import os
import sys
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add ai-engine to path to import its modules
# This assumes the ai-engine is in the same parent directory as the backend
sys.path.append(str(Path(__file__).parent.parent.parent.parent / "ai-engine"))

# Import the AI engine's economic calendar functionality
try:
    from services.economic_calendar import (
        fetch_economic_calendar as ai_fetch_calendar,
        analyze_economic_events,
        analyze_events_with_ai
    )
    logger.info("Successfully imported AI engine economic calendar services")
except ImportError as e:
    logger.error(f"Failed to import AI engine economic calendar services: {e}")
    # Define fallback functions if imports fail
    async def ai_fetch_calendar(days_ahead=7, days_back=1):
        return []
    
    async def analyze_economic_events(events, currency_pair):
        return {"impact": "NEUTRAL", "confidence": 0.5, "reasoning": "AI engine unavailable"}
    
    async def analyze_events_with_ai(events, currency_pair, base, quote):
        return {"impact": "NEUTRAL", "confidence": 0.5, "reasoning": "AI engine unavailable"}

# Cache for economic calendar data to reduce API calls
_calendar_cache = {}
_cache_expiry = {}
CACHE_TTL = 3600  # 1 hour in seconds

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
    cache_key = f"calendar_{days_ahead}_{days_back}"
    
    # Check if we have a valid cached response
    current_time = datetime.now().timestamp()
    if cache_key in _calendar_cache and current_time < _cache_expiry.get(cache_key, 0):
        logger.info(f"Using cached economic calendar data for {cache_key}")
        events = _calendar_cache[cache_key]
    else:
        # Fetch new data from the AI engine's calendar service
        try:
            events = await ai_fetch_calendar(days_ahead=days_ahead, days_back=days_back)
            
            # Update the cache
            _calendar_cache[cache_key] = events
            _cache_expiry[cache_key] = current_time + CACHE_TTL
            
            logger.info(f"Fetched {len(events)} economic calendar events")
        except Exception as e:
            logger.error(f"Error fetching economic calendar: {str(e)}")
            events = []
    
    # Apply filters if specified
    if impact:
        events = [event for event in events if event.get("impact", "").upper() == impact.upper()]
    
    if currencies:
        currencies = [c.upper() for c in currencies]
        events = [event for event in events if event.get("currency", "").upper() in currencies]
    
    # Format events to match the EconomicCalendarEvent model
    formatted_events = []
    for event in events:
        formatted_event = {
            "event_id": event.get("id", str(hash(json.dumps(event)))),
            "title": event.get("title", ""),
            "country": event.get("country", ""),
            "currency": event.get("currency", ""),
            "impact": event.get("impact", "MEDIUM"),  # Default to MEDIUM if not specified
            "event_time": event.get("date", datetime.now().isoformat()),
            "forecast": event.get("forecast", None),
            "previous": event.get("previous", None),
            "actual": event.get("actual", None),
            "unit": event.get("unit", None)
        }
        formatted_events.append(formatted_event)
    
    # Sort events by time
    formatted_events.sort(key=lambda x: x["event_time"])
    
    return formatted_events

async def analyze_calendar_impact(
    currency_pair: str,
    days_ahead: int = 7,
    days_back: int = 1
) -> Dict[str, Any]:
    """
    Analyze the impact of economic calendar events on a specific currency pair.
    
    Args:
        currency_pair: Currency pair in format "EUR_USD"
        days_ahead: Number of days ahead to analyze
        days_back: Number of days back to analyze
        
    Returns:
        Dictionary with analysis results
    """
    # Split the currency pair
    currencies = currency_pair.split("_")
    if len(currencies) != 2:
        return {
            "impact": "NEUTRAL",
            "confidence": 0.0,
            "reasoning": f"Invalid currency pair format: {currency_pair}"
        }
    
    base_currency, quote_currency = currencies
    
    # Get calendar events for these currencies
    events = await get_economic_calendar(
        days_ahead=days_ahead,
        days_back=days_back,
        currencies=[base_currency, quote_currency]
    )
    
    if not events:
        return {
            "impact": "NEUTRAL",
            "confidence": 0.0,
            "reasoning": "No significant economic events found for this currency pair"
        }
    
    try:
        # Try to use the AI-powered analysis
        analysis = await analyze_events_with_ai(
            events=events,
            currency_pair=currency_pair,
            base_currency=base_currency,
            quote_currency=quote_currency
        )
        return analysis
    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}. Falling back to rule-based analysis.")
        # Fallback to simpler analysis
        return await analyze_economic_events(events, currency_pair)
