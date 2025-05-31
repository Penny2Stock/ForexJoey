"""
API routes for sentiment analysis
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, Any, List, Optional
import sys
import os
import logging
from datetime import datetime, timedelta

# Add ai-engine to path so we can import modules from it
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "ai-engine"))

from services.sentiment import get_sentiment_analysis
from app.core.security import get_current_user
from app.models.user import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/currency/{currency_pair}", response_model=Dict[str, Any])
async def get_sentiment_for_pair(
    currency_pair: str,
    timeframe: Optional[str] = Query(None, description="Timeframe for analysis (e.g., 1h, 4h, 1d)"),
    current_user: User = Depends(get_current_user)
):
    """
    Get sentiment analysis for a specific currency pair
    
    Parameters:
    - currency_pair: The currency pair to analyze (e.g., EUR/USD)
    - timeframe: Optional timeframe for analysis (e.g., 1h, 4h, 1d)
    
    Returns:
    - Sentiment analysis results including score, confidence, and news articles
    """
    try:
        # Validate currency pair format
        if "/" not in currency_pair:
            raise HTTPException(status_code=400, detail="Invalid currency pair format. Use format like EUR/USD")
            
        # Get sentiment analysis
        sentiment = await get_sentiment_analysis(currency_pair, timeframe)
        
        return sentiment
    except Exception as e:
        logger.error(f"Error getting sentiment for {currency_pair}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}")

@router.get("/dashboard", response_model=List[Dict[str, Any]])
async def get_dashboard_sentiment(
    timeframe: Optional[str] = Query(None, description="Timeframe for analysis (e.g., 1h, 4h, 1d)"),
    current_user: User = Depends(get_current_user)
):
    """
    Get sentiment analysis for major currency pairs for the dashboard
    
    Parameters:
    - timeframe: Optional timeframe for analysis (e.g., 1h, 4h, 1d)
    
    Returns:
    - List of sentiment analyses for major currency pairs
    """
    try:
        # Major pairs to analyze
        major_pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"]
        
        # Get sentiment analysis for each pair
        results = []
        for pair in major_pairs:
            try:
                sentiment = await get_sentiment_analysis(pair, timeframe)
                # Include only necessary fields for dashboard
                results.append({
                    "currency_pair": pair,
                    "sentiment_score": sentiment["sentiment_score"],
                    "confidence": sentiment["confidence"],
                    "overall_sentiment": sentiment["overall_sentiment"],
                    "news_count": sentiment["news_count"],
                    "direction": sentiment.get("direction", "neutral"),
                    "strength": sentiment.get("strength", "moderate"),
                    "analysis": sentiment.get("explanation", "")[:100] + "..." if len(sentiment.get("explanation", "")) > 100 else sentiment.get("explanation", "")
                })
            except Exception as e:
                logger.error(f"Error getting sentiment for {pair}: {str(e)}")
                results.append({
                    "currency_pair": pair,
                    "sentiment_score": 0.0,
                    "confidence": 0.0,
                    "overall_sentiment": "neutral",
                    "news_count": 0,
                    "direction": "neutral",
                    "strength": "moderate",
                    "analysis": f"Unable to retrieve sentiment data: {str(e)}"
                })
                
        return results
    except Exception as e:
        logger.error(f"Error getting dashboard sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting dashboard sentiment: {str(e)}")

@router.get("/news/{currency_pair}", response_model=Dict[str, Any])
async def get_news_with_sentiment(
    currency_pair: str,
    limit: Optional[int] = Query(10, ge=1, le=50),
    timeframe: Optional[str] = Query(None, description="Timeframe for analysis (e.g., 1h, 4h, 1d)"),
    current_user: User = Depends(get_current_user)
):
    """
    Get news articles with sentiment analysis for a specific currency pair
    
    Parameters:
    - currency_pair: The currency pair to get news for (e.g., EUR/USD)
    - limit: Maximum number of news articles to return
    - timeframe: Optional timeframe for analysis (e.g., 1h, 4h, 1d)
    
    Returns:
    - News articles with sentiment analysis
    """
    try:
        # Validate currency pair format
        if "/" not in currency_pair:
            raise HTTPException(status_code=400, detail="Invalid currency pair format. Use format like EUR/USD")
            
        # Get sentiment analysis
        sentiment = await get_sentiment_analysis(currency_pair, timeframe)
        
        # Return only the articles with their sentiment
        return {
            "currency_pair": currency_pair,
            "timeframe": timeframe,
            "articles": sentiment["articles"][:limit],
            "sentiment_score": sentiment["sentiment_score"],
            "direction": sentiment.get("direction", "neutral"),
            "strength": sentiment.get("strength", "moderate"),
            "analysis": sentiment.get("explanation", "")
        }
    except Exception as e:
        logger.error(f"Error getting news for {currency_pair}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting news: {str(e)}")
