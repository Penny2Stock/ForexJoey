import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import aiohttp
import asyncio
import openai
from openai import AsyncOpenAI
import os

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def fetch_economic_calendar(days_ahead: int = 7, days_back: int = 1) -> List[Dict[str, Any]]:
    """
    Fetch economic calendar data from Forex Factory API
    """
    try:
        # Calculate date range
        today = datetime.utcnow().date()
        start_date = (today - timedelta(days=days_back)).strftime("%Y-%m-%d")
        end_date = (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")
        
        # Forex Factory calendar URL (free and reliable)
        url = f"https://forexfactory.com/api/calendar?range={start_date},{end_date}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("calendar", [])
                else:
                    logger.error(f"Error fetching economic calendar: {response.status}")
                    return []
    except Exception as e:
        logger.error(f"Error in fetch_economic_calendar: {str(e)}")
        return []

async def analyze_economic_events(
    events: List[Dict[str, Any]],
    currency_pair: str
) -> Dict[str, Any]:
    """
    Analyze economic calendar events for their impact on a specific currency pair
    """
    logger.info(f"Analyzing economic events for {currency_pair}")
    
    try:
        # Extract the two currencies from the pair
        currencies = currency_pair.split('/')
        if len(currencies) != 2:
            currencies = [currency_pair[:3], currency_pair[3:]]
        
        base_currency = currencies[0]
        quote_currency = currencies[1]
        
        # Filter events for the currencies in the pair
        relevant_events = [
            event for event in events 
            if event.get("currency") in [base_currency, quote_currency]
        ]
        
        # Sort by impact (high impact first) and time (upcoming first)
        relevant_events.sort(
            key=lambda e: (
                -["LOW", "MEDIUM", "HIGH"].index(e.get("impact", "LOW")), 
                abs((datetime.fromisoformat(e.get("date", datetime.utcnow().isoformat())) - datetime.utcnow()).total_seconds())
            )
        )
        
        # Get top events (max 5)
        top_events = relevant_events[:5]
        
        if not top_events:
            return {
                "direction": "NEUTRAL",
                "confidence_score": 0.0,
                "factors": [],
                "events": []
            }
        
        # Format events for AI analysis
        formatted_events = []
        for event in top_events:
            event_time = datetime.fromisoformat(event.get("date", datetime.utcnow().isoformat()))
            time_until = (event_time - datetime.utcnow()).total_seconds() / 3600  # hours
            
            formatted_events.append({
                "name": event.get("title", "Unknown Event"),
                "currency": event.get("currency", ""),
                "impact": event.get("impact", "LOW"),
                "forecast": event.get("forecast", "N/A"),
                "previous": event.get("previous", "N/A"),
                "time": event_time.isoformat(),
                "time_until_hours": round(time_until, 1),
                "is_past": time_until < 0
            })
        
        # Use AI to analyze the impact of these events
        analysis = await analyze_events_with_ai(
            events=formatted_events,
            currency_pair=currency_pair,
            base_currency=base_currency,
            quote_currency=quote_currency
        )
        
        return analysis
    
    except Exception as e:
        logger.error(f"Error in analyze_economic_events: {str(e)}")
        return {
            "direction": "NEUTRAL",
            "confidence_score": 0.0,
            "factors": [{"name": "error", "value": str(e), "interpretation": "Error in economic event analysis"}],
            "events": []
        }

async def analyze_events_with_ai(
    events: List[Dict[str, Any]],
    currency_pair: str,
    base_currency: str,
    quote_currency: str
) -> Dict[str, Any]:
    """
    Use AI to analyze the impact of economic events on a currency pair
    """
    if not events:
        return {
            "direction": "NEUTRAL",
            "confidence_score": 0.0,
            "factors": [],
            "events": []
        }
    
    # Create prompt for the AI model
    system_prompt = """You are ForexJoey, an AI forex analyst specializing in economic calendar analysis.
Your task is to analyze upcoming and recent economic events for a specific currency pair and determine their likely impact.
Focus on high-impact events, unexpected results compared to forecasts, and the relative importance of events for each currency.
Your analysis should be evidence-based, considering historical patterns of how similar events have affected the currency pair.
Provide a directional bias (BUY, SELL, or NEUTRAL) with a confidence score and detailed reasoning."""

    # Create event details for the prompt
    events_text = ""
    for i, event in enumerate(events):
        events_text += f"""
Event {i+1}:
- Name: {event['name']}
- Currency: {event['currency']}
- Impact Level: {event['impact']}
- Forecast: {event['forecast']}
- Previous: {event['previous']}
- Time: {event['time']}
- Time Until/Since: {abs(event['time_until_hours'])} hours {'ago' if event['is_past'] else 'from now'}
"""

    user_message = f"""
CURRENCY PAIR: {currency_pair}
BASE CURRENCY: {base_currency}
QUOTE CURRENCY: {quote_currency}

ECONOMIC EVENTS:
{events_text}

Analyze these economic events and their potential impact on {currency_pair}.
Consider:
1. Which currency will be strengthened or weakened by each event
2. The relative importance of events for each currency
3. Timing of events (upcoming vs. recent)
4. Historical patterns of how similar events affect the pair
5. Any unexpected results compared to forecasts for past events

Your response should be in JSON format with the following structure:
{{
  "direction": "BUY/SELL/NEUTRAL",
  "confidence_score": 0.0-1.0,
  "factors": [
    {{
      "event_name": "Event name",
      "currency": "Currency code",
      "impact": "Expected impact on currency pair",
      "interpretation": "Detailed explanation"
    }}
  ],
  "summary": "Brief summary of the analysis"
}}

Note:
- "BUY" means {base_currency} is expected to strengthen against {quote_currency}
- "SELL" means {base_currency} is expected to weaken against {quote_currency}
- "NEUTRAL" means no clear directional bias from economic events
"""

    try:
        # Call OpenAI API
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        analysis_text = response.choices[0].message.content
        analysis = json.loads(analysis_text)
        
        # Add events to the response
        analysis["events"] = events
        
        return analysis
    
    except Exception as e:
        logger.error(f"Error in AI analysis of economic events: {str(e)}")
        # Fallback to a simple analysis
        return create_fallback_economic_analysis(events, currency_pair, base_currency, quote_currency)

def create_fallback_economic_analysis(
    events: List[Dict[str, Any]],
    currency_pair: str,
    base_currency: str,
    quote_currency: str
) -> Dict[str, Any]:
    """
    Create a simple analysis when AI analysis fails
    """
    factors = []
    base_score = 0
    quote_score = 0
    
    for event in events:
        currency = event.get("currency", "")
        impact_level = event.get("impact", "LOW")
        
        # Convert impact to numeric value
        impact_value = {"LOW": 0.2, "MEDIUM": 0.5, "HIGH": 1.0}.get(impact_level, 0.2)
        
        # Add to appropriate currency score
        if currency == base_currency:
            base_score += impact_value
            factors.append({
                "event_name": event.get("name", "Unknown Event"),
                "currency": currency,
                "impact": f"{impact_level} impact on {currency_pair}",
                "interpretation": f"{impact_level} impact event for {currency}"
            })
        elif currency == quote_currency:
            quote_score += impact_value
            factors.append({
                "event_name": event.get("name", "Unknown Event"),
                "currency": currency,
                "impact": f"{impact_level} impact on {currency_pair}",
                "interpretation": f"{impact_level} impact event for {currency}"
            })
    
    # Determine direction
    if base_score > quote_score + 0.3:
        direction = "BUY"
        confidence_score = min(0.7, 0.5 + (base_score - quote_score) * 0.2)
    elif quote_score > base_score + 0.3:
        direction = "SELL"
        confidence_score = min(0.7, 0.5 + (quote_score - base_score) * 0.2)
    else:
        direction = "NEUTRAL"
        confidence_score = 0.5
    
    summary = f"Economic calendar analysis: {direction} bias for {currency_pair} with {confidence_score:.2f} confidence based on upcoming events"
    
    return {
        "direction": direction,
        "confidence_score": confidence_score,
        "factors": factors,
        "events": events,
        "summary": summary
    }
