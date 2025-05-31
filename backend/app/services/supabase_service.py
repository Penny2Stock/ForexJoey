"""
Supabase Service Module for ForexJoey Backend

This module provides integration between FastAPI and Supabase for:
1. User authentication and profile management
2. Trading signals storage and retrieval
3. Risk management parameter synchronization
4. AI reflection data access

ForexJoey follows an AI-first approach requiring multiple intelligence sources for all trading signals.
"""

import os
import json
import httpx
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta

# Configuration - In production, these would be in environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://frmnaifkkepkmsukpjes.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybW5haWZra2Vwa21zdWtwamVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5MzgyMzgsImV4cCI6MjAzNzUxNDIzOH0.w-gLMQ-y8EWE8jbESsZAIRpTuHF95Yq8y2_UkCrFwvw")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")  # For admin operations


class SupabaseService:
    """
    Service for interacting with Supabase from the FastAPI backend
    Provides methods for user management, signals, trades, and reflection
    """
    
    def __init__(self):
        self.url = SUPABASE_URL
        self.key = SUPABASE_KEY
        self.service_key = SUPABASE_SERVICE_KEY
        self.headers = {
            "apikey": self.key,
            "Content-Type": "application/json"
        }
        self.service_headers = {
            "apikey": self.service_key,
            "Content-Type": "application/json"
        }
    
    async def _request(self, method: str, endpoint: str, data: dict = None, params: dict = None, 
                       auth_token: str = None, use_service_role: bool = False) -> Dict:
        """Make an HTTP request to Supabase REST API"""
        headers = self.service_headers if use_service_role else self.headers.copy()
        
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        url = f"{self.url}{endpoint}"
        
        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(url, headers=headers, params=params)
            elif method == "POST":
                response = await client.post(url, headers=headers, json=data)
            elif method == "PUT":
                response = await client.put(url, headers=headers, json=data)
            elif method == "PATCH":
                response = await client.patch(url, headers=headers, json=data)
            elif method == "DELETE":
                response = await client.delete(url, headers=headers, params=params)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response_data = response.json()
            
            if response.status_code >= 400:
                error_msg = response_data.get("error", "Unknown error")
                raise Exception(f"Supabase API error: {error_msg}")
            
            return response_data
    
    # ==================== User Management ====================
    
    async def signup_user(self, email: str, password: str, user_data: dict) -> Dict:
        """Create a new user in Supabase Auth and set up their profile"""
        # First, create the user in Supabase Auth
        auth_data = {
            "email": email,
            "password": password,
        }
        auth_response = await self._request("POST", "/auth/v1/signup", data=auth_data)
        
        # Extract the user ID from the auth response
        user_id = auth_response.get("user", {}).get("id")
        if not user_id:
            raise Exception("Failed to create user")
        
        # Create user profile in the users table
        profile_data = {
            "id": user_id,
            "email": email,
            "full_name": user_data.get("full_name", ""),
            "risk_profile": user_data.get("risk_profile", "conservative"),
            "account_balance": user_data.get("account_balance", 10000),
            "max_drawdown_percentage": user_data.get("max_drawdown_percentage", 10),
            "max_position_size_percentage": user_data.get("max_position_size_percentage", 2),
            "max_daily_trades": user_data.get("max_daily_trades", 5),
            "experience_level": user_data.get("experience_level", "beginner")
        }
        
        # Use service role to bypass RLS and create the profile
        await self._request("POST", "/rest/v1/users", data=profile_data, use_service_role=True)
        
        # Create default risk management rules
        risk_rules_data = {
            "user_id": user_id,
            "max_loss_per_trade_percentage": 1.0,
            "max_daily_loss_percentage": 3.0,
            "max_weekly_loss_percentage": 5.0,
            "position_sizing_method": "fixed_percentage",
            "take_profit_risk_ratio": 2.0,
            "auto_close_losing_trades": False,
            "correlation_limit": 0.7,
            "active": True
        }
        
        # Use service role to bypass RLS and create risk rules
        await self._request("POST", "/rest/v1/risk_management_rules", data=risk_rules_data, use_service_role=True)
        
        return auth_response
    
    async def signin_user(self, email: str, password: str) -> Dict:
        """Sign in a user with email and password"""
        auth_data = {
            "email": email,
            "password": password,
        }
        return await self._request("POST", "/auth/v1/token?grant_type=password", data=auth_data)
    
    async def get_user_profile(self, user_id: str, auth_token: str) -> Dict:
        """Get a user's profile data"""
        return await self._request(
            "GET", 
            f"/rest/v1/users?id=eq.{user_id}&select=*",
            auth_token=auth_token
        )
    
    async def update_user_profile(self, user_id: str, auth_token: str, profile_data: dict) -> Dict:
        """Update a user's profile data"""
        return await self._request(
            "PATCH", 
            f"/rest/v1/users?id=eq.{user_id}",
            data=profile_data,
            auth_token=auth_token
        )
    
    # ==================== Risk Management ====================
    
    async def get_risk_rules(self, user_id: str, auth_token: str) -> Dict:
        """Get a user's active risk management rules"""
        return await self._request(
            "GET", 
            f"/rest/v1/risk_management_rules?user_id=eq.{user_id}&active=eq.true&select=*",
            auth_token=auth_token
        )
    
    async def update_risk_rules(self, rule_id: str, auth_token: str, rule_data: dict) -> Dict:
        """Update a user's risk management rules"""
        return await self._request(
            "PATCH", 
            f"/rest/v1/risk_management_rules?id=eq.{rule_id}",
            data=rule_data,
            auth_token=auth_token
        )
    
    # ==================== Trading Signals ====================
    
    async def get_signals(self, params: dict = None, auth_token: str = None) -> List[Dict]:
        """Get trading signals with optional filtering"""
        query_params = {}
        
        # Build query parameters
        if params:
            if params.get("currency_pair"):
                query_params["currency_pair"] = f"eq.{params['currency_pair']}"
            if params.get("timeframe"):
                query_params["timeframe"] = f"eq.{params['timeframe']}"
            if params.get("status"):
                query_params["status"] = f"eq.{params['status']}"
            if params.get("confidence_min"):
                query_params["confidence_score"] = f"gte.{params['confidence_min']}"
            if params.get("limit"):
                query_params["limit"] = params["limit"]
            if params.get("offset"):
                query_params["offset"] = params["offset"]
        
        # Add order by created_at desc to get newest signals first
        query_params["order"] = "created_at.desc"
        
        # Add select=* to get all fields
        query_params["select"] = "*"
        
        return await self._request("GET", "/rest/v1/signals", params=query_params, auth_token=auth_token)
    
    async def get_signal_by_id(self, signal_id: str, auth_token: str = None) -> Dict:
        """Get a specific trading signal by ID"""
        return await self._request(
            "GET", 
            f"/rest/v1/signals?id=eq.{signal_id}&select=*",
            auth_token=auth_token
        )
    
    async def create_signal(self, signal_data: dict, auth_token: str) -> Dict:
        """Create a new trading signal by calling the edge function"""
        return await self._request(
            "POST", 
            "/functions/v1/signal-generation",
            data=signal_data,
            auth_token=auth_token
        )
    
    # ==================== Trades ====================
    
    async def get_trades(self, user_id: str, params: dict = None, auth_token: str = None) -> List[Dict]:
        """Get trades for a user with optional filtering"""
        query_params = {"user_id": f"eq.{user_id}"}
        
        # Build query parameters
        if params:
            if params.get("currency_pair"):
                query_params["currency_pair"] = f"eq.{params['currency_pair']}"
            if params.get("status"):
                query_params["status"] = f"eq.{params['status']}"
            if params.get("limit"):
                query_params["limit"] = params["limit"]
            if params.get("offset"):
                query_params["offset"] = params["offset"]
        
        # Add order by entry_time desc to get newest trades first
        query_params["order"] = "entry_time.desc"
        
        # Add select=* to get all fields
        query_params["select"] = "*"
        
        return await self._request("GET", "/rest/v1/trades", params=query_params, auth_token=auth_token)
    
    async def create_trade(self, trade_data: dict, auth_token: str) -> Dict:
        """Create a new trade"""
        # First, run the risk assessment edge function
        risk_assessment = await self._request(
            "POST", 
            "/functions/v1/risk-management",
            data={"tradeData": trade_data},
            auth_token=auth_token
        )
        
        # Check if trade passes risk management
        if not risk_assessment.get("passed", False):
            return {
                "error": "Trade does not pass risk management rules",
                "warnings": risk_assessment.get("warnings", []),
                "adjustments": risk_assessment.get("adjustments", {})
            }
        
        # If trade passes, create it
        return await self._request("POST", "/rest/v1/trades", data=trade_data, auth_token=auth_token)
    
    async def update_trade(self, trade_id: str, trade_data: dict, auth_token: str) -> Dict:
        """Update an existing trade (e.g., to close it)"""
        return await self._request(
            "PATCH", 
            f"/rest/v1/trades?id=eq.{trade_id}",
            data=trade_data,
            auth_token=auth_token
        )
    
    # ==================== AI Reflection ====================
    
    async def reflect_on_trade(self, trade_id: str, auth_token: str) -> Dict:
        """Trigger AI reflection on a completed trade"""
        return await self._request(
            "POST", 
            "/functions/v1/ai-reflection",
            data={"tradeId": trade_id},
            auth_token=auth_token
        )
    
    async def get_learning_journal(self, params: dict = None, auth_token: str = None) -> List[Dict]:
        """Get AI learning journal entries with optional filtering"""
        query_params = {}
        
        # Build query parameters
        if params:
            if params.get("currency_pair"):
                query_params["currency_pair"] = f"eq.{params['currency_pair']}"
            if params.get("timeframe"):
                query_params["timeframe"] = f"eq.{params['timeframe']}"
            if params.get("limit"):
                query_params["limit"] = params["limit"]
            if params.get("offset"):
                query_params["offset"] = params["offset"]
        
        # Add order by created_at desc to get newest entries first
        query_params["order"] = "created_at.desc"
        
        # Add select=* to get all fields
        query_params["select"] = "*"
        
        return await self._request("GET", "/rest/v1/learning_journal", params=query_params, auth_token=auth_token)
    
    # ==================== Market Data ====================
    
    async def get_market_data(self, currency_pair: str, timeframe: str, count: int = 100, auth_token: str = None) -> Dict:
        """Get market data for a currency pair and timeframe"""
        return await self._request(
            "POST", 
            "/functions/v1/market-data",
            data={
                "currencyPair": currency_pair,
                "timeframe": timeframe,
                "count": count
            },
            auth_token=auth_token
        )
    
    # ==================== Educational Content ====================
    
    async def get_educational_content(self, params: dict = None, auth_token: str = None) -> List[Dict]:
        """Get educational content with optional filtering"""
        query_params = {}
        
        # Build query parameters
        if params:
            if params.get("content_type"):
                query_params["content_type"] = f"eq.{params['content_type']}"
            if params.get("category"):
                query_params["category"] = f"eq.{params['category']}"
            if params.get("difficulty"):
                query_params["difficulty"] = f"eq.{params['difficulty']}"
            if params.get("limit"):
                query_params["limit"] = params["limit"]
            if params.get("offset"):
                query_params["offset"] = params["offset"]
        
        # Add select=* to get all fields
        query_params["select"] = "*"
        
        return await self._request("GET", "/rest/v1/educational_content", params=query_params, auth_token=auth_token)
    
    async def get_user_progress(self, user_id: str, auth_token: str) -> List[Dict]:
        """Get a user's progress on educational content"""
        return await self._request(
            "GET", 
            f"/rest/v1/user_progress?user_id=eq.{user_id}&select=*",
            auth_token=auth_token
        )
    
    async def update_user_progress(self, progress_id: str, progress_data: dict, auth_token: str) -> Dict:
        """Update a user's progress on educational content"""
        return await self._request(
            "PATCH", 
            f"/rest/v1/user_progress?id=eq.{progress_id}",
            data=progress_data,
            auth_token=auth_token
        )
