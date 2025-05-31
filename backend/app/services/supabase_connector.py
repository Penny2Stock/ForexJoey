"""
Supabase Edge Function Connector for ForexJoey

This module connects the backend API to Supabase Edge Functions
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseConnector:
    """Connector for Supabase Edge Functions"""
    
    def __init__(self):
        """Initialize the connector with environment variables"""
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase URL or key not found in environment variables")
            
    async def call_edge_function(self, function_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call a Supabase Edge Function
        
        Args:
            function_name: Name of the Edge Function to call
            payload: JSON payload to send to the function
            
        Returns:
            Response from the Edge Function
        """
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL or key not configured")
            
        url = f"{self.supabase_url}/functions/v1/{function_name}"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.supabase_key}"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error calling {function_name}: {e.response.status_code} {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error calling {function_name}: {str(e)}")
            raise
            
    async def get_sentiment_analysis(self, currency_pair: str, timeframe: Optional[str] = None) -> Dict[str, Any]:
        """
        Get sentiment analysis from the sentiment-analysis Edge Function
        
        Args:
            currency_pair: Currency pair to analyze (e.g., EUR/USD)
            timeframe: Optional timeframe for analysis
            
        Returns:
            Sentiment analysis results
        """
        payload = {
            "currency_pair": currency_pair
        }
        
        if timeframe:
            payload["timeframe"] = timeframe
            
        try:
            return await self.call_edge_function("sentiment-analysis", payload)
        except Exception as e:
            logger.error(f"Error getting sentiment analysis: {str(e)}")
            # Return a default response if the Edge Function fails
            return {
                "currency_pair": currency_pair,
                "base_currency": currency_pair.split('/')[0],
                "quote_currency": currency_pair.split('/')[1],
                "overall_sentiment": 0,
                "sentiment_label": "neutral",
                "news_items": [],
                "analysis": f"Unable to retrieve sentiment data: {str(e)}",
                "timestamp": ""
            }
            
    async def get_economic_calendar(self, 
                                   start_date: Optional[str] = None, 
                                   end_date: Optional[str] = None,
                                   currencies: Optional[list] = None,
                                   impact: Optional[str] = None) -> Dict[str, Any]:
        """
        Get economic calendar data from the economic-calendar Edge Function
        
        Args:
            start_date: Start date in ISO format
            end_date: End date in ISO format
            currencies: List of currencies to filter by
            impact: Impact level to filter by (high, medium, low)
            
        Returns:
            Economic calendar data
        """
        payload = {}
        
        if start_date:
            payload["start_date"] = start_date
            
        if end_date:
            payload["end_date"] = end_date
            
        if currencies:
            payload["currencies"] = currencies
            
        if impact:
            payload["impact"] = impact
            
        try:
            return await self.call_edge_function("economic-calendar", payload)
        except Exception as e:
            logger.error(f"Error getting economic calendar: {str(e)}")
            # Return a default response if the Edge Function fails
            return {
                "events": [],
                "analysis": {},
                "timestamp": ""
            }

# Create a singleton instance
supabase = SupabaseConnector()
