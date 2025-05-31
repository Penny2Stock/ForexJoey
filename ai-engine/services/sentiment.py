"""
Sentiment Analysis Service for ForexJoey

This module is responsible for:
1. Fetching forex news from reliable sources
2. Analyzing sentiment using FinBERT or OpenAI
3. Correlating sentiment to specific currency pairs
4. Calculating sentiment scores and impact assessments
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple

import aiohttp
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from openai import AsyncOpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# News API endpoints
NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything"
TRADING_ECONOMICS_API = "https://api.tradingeconomics.com/news"

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Currency pairs and related keywords
FOREX_PAIRS = {
    "EUR/USD": ["euro", "eur", "eurozone", "ecb", "european central bank", "euro dollar"],
    "GBP/USD": ["pound", "gbp", "sterling", "boe", "bank of england", "cable", "british pound"],
    "USD/JPY": ["yen", "jpy", "boj", "bank of japan", "japanese yen"],
    "AUD/USD": ["aussie", "aud", "rba", "reserve bank of australia", "australian dollar"],
    "USD/CAD": ["loonie", "cad", "boc", "bank of canada", "canadian dollar"],
    "USD/CHF": ["swissie", "chf", "snb", "swiss national bank", "swiss franc"],
    "NZD/USD": ["kiwi", "nzd", "rbnz", "reserve bank of new zealand", "new zealand dollar"]
}

# Path to pretrained FinBERT model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "finbert")

# Check if the model exists locally, otherwise use the remote model
if os.path.exists(MODEL_PATH):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
else:
    # Fall back to remote model if local model doesn't exist
    tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
    model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")

class SentimentAnalyzer:
    """Sentiment analysis for forex news using FinBERT and/or OpenAI"""
    
    def __init__(self, use_openai: bool = True, use_finbert: bool = True):
        """
        Initialize the sentiment analyzer
        
        Args:
            use_openai: Whether to use OpenAI for sentiment analysis
            use_finbert: Whether to use FinBERT for sentiment analysis
        """
        self.use_openai = use_openai
        self.use_finbert = use_finbert
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        if self.use_finbert:
            model.to(self.device)
        
    async def analyze_with_finbert(self, text: str) -> Dict[str, Any]:
        """
        Analyze sentiment using FinBERT
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment score and label
        """
        try:
            inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = model(**inputs)
                
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
            probabilities = probabilities.cpu().numpy()[0]
            
            # FinBERT labels: positive, negative, neutral
            labels = ["positive", "negative", "neutral"]
            scores = {label: float(prob) for label, prob in zip(labels, probabilities)}
            
            # Get the label with the highest probability
            sentiment = max(scores.items(), key=lambda x: x[1])
            
            # Map scores to a single value between -1 and 1
            composite_score = scores["positive"] - scores["negative"]
            
            return {
                "sentiment": sentiment[0],
                "confidence": sentiment[1],
                "scores": scores,
                "composite_score": composite_score
            }
        except Exception as e:
            logger.error(f"FinBERT analysis error: {e}")
            return {
                "sentiment": "neutral",
                "confidence": 0.33,
                "scores": {"positive": 0.33, "negative": 0.33, "neutral": 0.33},
                "composite_score": 0.0
            }
            
    async def analyze_with_openai(self, text: str, currency_pair: str) -> Dict[str, Any]:
        """
        Analyze sentiment using OpenAI
        
        Args:
            text: Text to analyze
            currency_pair: The currency pair to analyze for
            
        Returns:
            Dictionary with sentiment score and analysis
        """
        try:
            prompt = f"""
            Analyze the following news article for sentiment specifically regarding the {currency_pair} forex pair.
            
            Article: {text}
            
            Provide a sentiment analysis with:
            1. A score from -1.0 (extremely bearish) to 1.0 (extremely bullish), with 0 being neutral
            2. A confidence score from 0.0 to 1.0
            3. A brief explanation of why this news would impact {currency_pair}
            4. The likely timeframe of impact (immediate, short-term, medium-term, or long-term)
            
            Format your response as a JSON object with the following structure:
            {
                "sentiment_score": float,
                "confidence": float,
                "explanation": string,
                "timeframe": string,
                "relevance": float
            }
            
            Return ONLY the JSON object, nothing else.
            """
            
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial analyst specializing in forex markets."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            analysis = json.loads(response.choices[0].message.content)
            return analysis
        except Exception as e:
            logger.error(f"OpenAI analysis error: {e}")
            return {
                "sentiment_score": 0.0,
                "confidence": 0.0,
                "explanation": f"Error analyzing sentiment: {str(e)}",
                "timeframe": "unknown",
                "relevance": 0.0
            }
            
    async def analyze_text(self, text: str, currency_pair: str) -> Dict[str, Any]:
        """
        Analyze text using both FinBERT and OpenAI
        
        Args:
            text: Text to analyze
            currency_pair: Currency pair to analyze for
            
        Returns:
            Combined sentiment analysis
        """
        results = {}
        
        if self.use_finbert:
            finbert_result = await self.analyze_with_finbert(text)
            results["finbert"] = finbert_result
            
        if self.use_openai:
            openai_result = await self.analyze_with_openai(text, currency_pair)
            results["openai"] = openai_result
            
        # Combine results
        if self.use_finbert and self.use_openai:
            # Convert FinBERT's composite score to same scale as OpenAI
            finbert_score = results["finbert"]["composite_score"]
            openai_score = results["openai"]["sentiment_score"]
            
            # Weight by confidence
            finbert_weight = results["finbert"]["confidence"]
            openai_weight = results["openai"]["confidence"]
            total_weight = finbert_weight + openai_weight
            
            if total_weight > 0:
                weighted_score = (finbert_score * finbert_weight + openai_score * openai_weight) / total_weight
            else:
                weighted_score = 0.0
                
            results["combined"] = {
                "sentiment_score": weighted_score,
                "confidence": max(finbert_weight, openai_weight),
                "explanation": results["openai"].get("explanation", "No explanation provided"),
                "timeframe": results["openai"].get("timeframe", "unknown"),
                "relevance": results["openai"].get("relevance", 0.5)
            }
        elif self.use_finbert:
            results["combined"] = {
                "sentiment_score": results["finbert"]["composite_score"],
                "confidence": results["finbert"]["confidence"],
                "explanation": "Analysis based on FinBERT model only",
                "timeframe": "unknown",
                "relevance": 0.5
            }
        elif self.use_openai:
            results["combined"] = results["openai"]
        else:
            results["combined"] = {
                "sentiment_score": 0.0,
                "confidence": 0.0,
                "explanation": "No sentiment analysis performed",
                "timeframe": "unknown",
                "relevance": 0.0
            }
            
        return results
    
    def detect_currency_pairs(self, text: str) -> List[str]:
        """
        Detect which currency pairs are mentioned in the text
        
        Args:
            text: Text to analyze
            
        Returns:
            List of currency pairs mentioned in the text
        """
        text = text.lower()
        mentioned_pairs = []
        
        # Check direct mentions of currency pairs
        for pair in FOREX_PAIRS:
            if pair.lower() in text or pair.lower().replace("/", "") in text:
                mentioned_pairs.append(pair)
                
        # Check for keyword mentions
        for pair, keywords in FOREX_PAIRS.items():
            if pair not in mentioned_pairs:
                for keyword in keywords:
                    if keyword in text:
                        mentioned_pairs.append(pair)
                        break
                        
        return mentioned_pairs

async def fetch_news_from_newsapi(currency_pair: str, days: int = 1) -> List[Dict[str, Any]]:
    """
    Fetch news related to a currency pair from News API
    
    Args:
        currency_pair: Currency pair to fetch news for
        days: Number of days to look back
        
    Returns:
        List of news articles
    """
    keywords = FOREX_PAIRS.get(currency_pair, [])
    keywords.append(currency_pair.replace("/", ""))
    
    query = " OR ".join(keywords)
    from_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                NEWS_API_ENDPOINT,
                params={
                    "q": f"({query}) AND (forex OR currency OR exchange rate OR central bank)",
                    "from": from_date,
                    "sortBy": "relevancy",
                    "language": "en",
                    "apiKey": os.getenv("NEWSAPI_KEY")
                }
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("articles", [])
                else:
                    logger.error(f"News API error: {response.status}")
                    return []
    except Exception as e:
        logger.error(f"Error fetching news from News API: {e}")
        return []

async def fetch_news_from_trading_economics(currency_pair: str) -> List[Dict[str, Any]]:
    """
    Fetch news from Trading Economics API
    
    Args:
        currency_pair: Currency pair to fetch news for
        
    Returns:
        List of news articles
    """
    try:
        # Extract the currencies from the pair
        currencies = currency_pair.split("/")
        query = " OR ".join(currencies)
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                TRADING_ECONOMICS_API,
                params={
                    "category": "forex",
                    "q": query,
                    "client": os.getenv("TRADING_ECONOMICS_CLIENT"),
                    "key": os.getenv("TRADING_ECONOMICS_KEY")
                }
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data
                else:
                    logger.error(f"Trading Economics API error: {response.status}")
                    return []
    except Exception as e:
        logger.error(f"Error fetching news from Trading Economics: {e}")
        return []
        
async def aggregate_news(currency_pair: str, days: int = 2) -> List[Dict[str, Any]]:
    """
    Aggregate news from multiple sources
    
    Args:
        currency_pair: Currency pair to fetch news for
        days: Number of days to look back
        
    Returns:
        List of aggregated news articles
    """
    try:
        # Fetch news from multiple sources in parallel
        news_api_task = fetch_news_from_newsapi(currency_pair, days)
        trading_economics_task = fetch_news_from_trading_economics(currency_pair)
        
        news_api_results, trading_economics_results = await asyncio.gather(
            news_api_task,
            trading_economics_task
        )
        
        # Process News API results
        processed_news = []
        for article in news_api_results:
            processed_news.append({
                "source": article.get("source", {}).get("name", "News API"),
                "title": article.get("title", ""),
                "content": article.get("content", article.get("description", "")),
                "url": article.get("url", ""),
                "published_at": article.get("publishedAt", ""),
                "source_type": "news_api"
            })
            
        # Process Trading Economics results
        for article in trading_economics_results:
            processed_news.append({
                "source": "Trading Economics",
                "title": article.get("title", ""),
                "content": article.get("description", ""),
                "url": article.get("url", ""),
                "published_at": article.get("date", ""),
                "source_type": "trading_economics"
            })
            
        # Sort by publication date (newest first)
        processed_news.sort(
            key=lambda x: datetime.fromisoformat(x["published_at"].replace("Z", "+00:00")) 
            if x["published_at"] else datetime.now(),
            reverse=True
        )
        
        return processed_news
    except Exception as e:
        logger.error(f"Error aggregating news: {e}")
        return []

async def analyze_news_sentiment(currency_pair: str, days: int = 2) -> Dict[str, Any]:
    """
    Analyze sentiment for news related to a currency pair
    
    Args:
        currency_pair: Currency pair to analyze
        days: Number of days to look back
        
    Returns:
        Sentiment analysis results
    """
    # Initialize sentiment analyzer
    analyzer = SentimentAnalyzer(use_openai=True, use_finbert=True)
    
    # Fetch news
    news = await aggregate_news(currency_pair, days)
    
    if not news:
        return {
            "currency_pair": currency_pair,
            "sentiment_score": 0.0,
            "confidence": 0.0,
            "news_count": 0,
            "overall_sentiment": "neutral",
            "timeframe": "unknown",
            "articles": [],
            "explanation": "No relevant news found"
        }
    
    # Analyze each article
    analyzed_articles = []
    total_score = 0.0
    total_confidence = 0.0
    total_weight = 0.0
    
    for article in news[:10]:  # Limit to 10 most recent articles for efficiency
        # Skip articles with very little content
        if len(article["content"]) < 50:
            continue
            
        # Analyze sentiment
        sentiment = await analyzer.analyze_text(article["content"], currency_pair)
        
        # Calculate relevance based on presence of keywords
        text = (article["title"] + " " + article["content"]).lower()
        keywords_count = sum(1 for keyword in FOREX_PAIRS[currency_pair] if keyword in text)
        relevance = min(1.0, keywords_count / 3)  # Normalize to 0-1
        
        # Only include if OpenAI thinks it's relevant or if keywords are present
        if sentiment["combined"]["relevance"] > 0.3 or relevance > 0:
            article_result = {
                "title": article["title"],
                "source": article["source"],
                "url": article["url"],
                "published_at": article["published_at"],
                "sentiment_score": sentiment["combined"]["sentiment_score"],
                "confidence": sentiment["combined"]["confidence"],
                "explanation": sentiment["combined"]["explanation"],
                "timeframe": sentiment["combined"]["timeframe"],
                "relevance": max(sentiment["combined"]["relevance"], relevance)
            }
            
            analyzed_articles.append(article_result)
            
            # Weight by both confidence and relevance
            weight = article_result["confidence"] * article_result["relevance"]
            total_score += article_result["sentiment_score"] * weight
            total_confidence += article_result["confidence"]
            total_weight += weight
    
    # Calculate weighted average
    if total_weight > 0 and analyzed_articles:
        avg_sentiment = total_score / total_weight
        avg_confidence = total_confidence / len(analyzed_articles)
        
        # Determine overall sentiment label
        if avg_sentiment > 0.2:
            overall_sentiment = "bullish"
        elif avg_sentiment < -0.2:
            overall_sentiment = "bearish"
        else:
            overall_sentiment = "neutral"
            
        # Determine primary timeframe
        timeframes = [a["timeframe"] for a in analyzed_articles if a["timeframe"] != "unknown"]
        primary_timeframe = max(set(timeframes), key=timeframes.count) if timeframes else "unknown"
            
        return {
            "currency_pair": currency_pair,
            "sentiment_score": avg_sentiment,
            "confidence": avg_confidence,
            "news_count": len(analyzed_articles),
            "overall_sentiment": overall_sentiment,
            "timeframe": primary_timeframe,
            "articles": analyzed_articles,
            "explanation": f"Analysis based on {len(analyzed_articles)} news articles"
        }
    else:
        return {
            "currency_pair": currency_pair,
            "sentiment_score": 0.0,
            "confidence": 0.0,
            "news_count": 0,
            "overall_sentiment": "neutral",
            "timeframe": "unknown", 
            "articles": [],
            "explanation": "No relevant news found or analysis failed"
        }

# Main function to get sentiment for a currency pair
async def get_sentiment_analysis(currency_pair: str, timeframe: Optional[str] = None) -> Dict[str, Any]:
    """
    Get sentiment analysis for a currency pair
    
    Args:
        currency_pair: Currency pair to analyze
        timeframe: Optional timeframe for analysis
        
    Returns:
        Sentiment analysis results
    """
    try:
        # Check if we have Supabase connector available
        try:
            from app.services.supabase_connector import supabase
            
            # Try to use the Supabase Edge Function first
            try:
                logger.info(f"Getting sentiment from Supabase Edge Function for {currency_pair}")
                sentiment_data = await supabase.get_sentiment_analysis(currency_pair, timeframe)
                
                # Transform the Edge Function response to match our expected format
                articles = []
                for news_item in sentiment_data.get("news_items", []):
                    articles.append({
                        "title": news_item.get("title", ""),
                        "source": news_item.get("source", ""),
                        "url": news_item.get("url", ""),
                        "published_at": news_item.get("published_at", ""),
                        "sentiment_score": news_item.get("sentiment_score", 0),
                        "sentiment": news_item.get("sentiment_label", "neutral"),
                        "explanation": news_item.get("description", "")
                    })
                
                # Map sentiment label to direction and strength
                sentiment_label = sentiment_data.get("sentiment_label", "neutral")
                direction = "neutral"
                strength = "moderate"
                
                if sentiment_label == "very_bullish":
                    direction = "bullish"
                    strength = "strong"
                elif sentiment_label == "bullish":
                    direction = "bullish"
                    strength = "moderate"
                elif sentiment_label == "bearish":
                    direction = "bearish"
                    strength = "moderate"
                elif sentiment_label == "very_bearish":
                    direction = "bearish"
                    strength = "strong"
                
                return {
                    "currency_pair": currency_pair,
                    "sentiment_score": sentiment_data.get("overall_sentiment", 0),
                    "confidence": 0.8,  # Edge Function has high confidence
                    "direction": direction,
                    "strength": strength,
                    "overall_sentiment": sentiment_label,
                    "news_count": len(articles),
                    "articles": articles,
                    "explanation": sentiment_data.get("analysis", "")
                }
            except Exception as edge_error:
                logger.warning(f"Edge Function error, falling back to local analysis: {edge_error}")
                # Fall back to local analysis if Edge Function fails
                return await analyze_news_sentiment(currency_pair)
        except ImportError:
            # If Supabase connector is not available, use local analysis
            logger.info(f"Supabase connector not available, using local analysis for {currency_pair}")
            return await analyze_news_sentiment(currency_pair)
    except Exception as e:
        logger.error(f"Error in get_sentiment_analysis: {e}")
        raise
