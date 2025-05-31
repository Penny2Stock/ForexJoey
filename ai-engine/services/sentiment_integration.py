"""
Integration layer for connecting our sentiment analysis service with the AI engine
"""

import logging
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from .sentiment import get_sentiment_analysis, analyze_news_sentiment

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def analyze_sentiment_data(sentiment_data: Dict[str, Any], currency_pair: str) -> Dict[str, Any]:
    """
    Analyze sentiment data for a currency pair
    
    Args:
        sentiment_data: Pre-fetched sentiment data or empty dict if not available
        currency_pair: The currency pair to analyze
        
    Returns:
        Sentiment analysis result with trading implications
    """
    try:
        # If sentiment data is already provided, use it
        if sentiment_data and sentiment_data.get("sentiment_score") is not None:
            logger.info(f"Using pre-fetched sentiment data for {currency_pair}")
            return format_sentiment_result(sentiment_data)
            
        # Otherwise, fetch and analyze new sentiment data
        logger.info(f"Fetching fresh sentiment data for {currency_pair}")
        sentiment = await analyze_news_sentiment(currency_pair)
        
        return format_sentiment_result(sentiment)
    except Exception as e:
        logger.error(f"Error in sentiment analysis for {currency_pair}: {str(e)}")
        # Return neutral sentiment if analysis fails
        return {
            "sentiment_score": 0,
            "confidence": 0,
            "direction": "neutral",
            "strength": "weak",
            "signal_weight": 0,
            "news_count": 0,
            "top_articles": [],
            "explanation": f"Sentiment analysis failed: {str(e)}"
        }
        
def format_sentiment_result(sentiment: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format sentiment result for use in the AI engine
    
    Args:
        sentiment: Raw sentiment analysis from the sentiment service
        
    Returns:
        Formatted sentiment result with trading implications
    """
    # Extract key metrics
    sentiment_score = sentiment.get("sentiment_score", 0)
    confidence = sentiment.get("confidence", 0)
    news_count = sentiment.get("news_count", 0)
    
    # Determine direction based on sentiment score
    if sentiment_score > 0.2:
        direction = "bullish"
    elif sentiment_score < -0.2:
        direction = "bearish"
    else:
        direction = "neutral"
        
    # Determine strength based on confidence and absolute score
    abs_score = abs(sentiment_score)
    if abs_score > 0.6 and confidence > 0.7:
        strength = "strong"
    elif abs_score > 0.3 and confidence > 0.5:
        strength = "moderate"
    else:
        strength = "weak"
        
    # Calculate signal weight (impact on overall decision)
    # Higher confidence and news count increase weight
    base_weight = abs_score * confidence
    news_factor = min(1.0, news_count / 10)  # Cap at 10 news articles
    signal_weight = base_weight * (0.7 + (0.3 * news_factor))
    
    # Cap weight at 0.7 as sentiment alone shouldn't determine trade
    signal_weight = min(0.7, signal_weight)
    
    # Extract top articles (most relevant/impactful)
    articles = sentiment.get("articles", [])
    top_articles = []
    
    if articles:
        # Sort by relevance * confidence
        sorted_articles = sorted(
            articles, 
            key=lambda x: (x.get("relevance", 0) * x.get("confidence", 0)),
            reverse=True
        )
        
        # Take top 3 articles
        top_articles = [
            {
                "title": a.get("title", ""),
                "source": a.get("source", ""),
                "sentiment_score": a.get("sentiment_score", 0),
                "explanation": a.get("explanation", "")
            }
            for a in sorted_articles[:3]
        ]
    
    # Return formatted result
    return {
        "sentiment_score": sentiment_score,
        "confidence": confidence,
        "direction": direction,
        "strength": strength,
        "signal_weight": signal_weight,
        "news_count": news_count,
        "top_articles": top_articles,
        "explanation": sentiment.get("explanation", "No explanation provided")
    }
