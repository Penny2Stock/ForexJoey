"""
Supabase client for ForexJoey backend
"""

import os
import logging
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from pydantic import BaseModel
from datetime import datetime

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase: Client = create_client(
    supabase_url=settings.SUPABASE_URL,
    supabase_key=settings.SUPABASE_KEY
)

class Database:
    """Database interface for Supabase"""

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """
        Get user by email
        
        Args:
            email: User email
            
        Returns:
            User data or None if not found
        """
        try:
            response = supabase.table("users").select("*").eq("email", email).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting user by email: {str(e)}")
            return None
            
    @staticmethod
    async def create_user(user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create a new user
        
        Args:
            user_data: User data to insert
            
        Returns:
            Created user data or None if failed
        """
        try:
            response = supabase.table("users").insert(user_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return None
            
    @staticmethod
    async def update_user(user_id: str, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update user data
        
        Args:
            user_id: User ID
            user_data: User data to update
            
        Returns:
            Updated user data or None if failed
        """
        try:
            response = supabase.table("users").update(user_data).eq("id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            return None
    
    @staticmethod
    async def get_signals(user_id: str, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
        """
        Get signals for a user
        
        Args:
            user_id: User ID
            limit: Maximum number of signals to return
            offset: Offset for pagination
            
        Returns:
            List of signals
        """
        try:
            response = supabase.table("signals") \
                .select("*") \
                .eq("user_id", user_id) \
                .order("created_at", desc=True) \
                .range(offset, offset + limit - 1) \
                .execute()
                
            return response.data
        except Exception as e:
            logger.error(f"Error getting signals: {str(e)}")
            return []
            
    @staticmethod
    async def get_signal_by_id(signal_id: str) -> Optional[Dict[str, Any]]:
        """
        Get signal by ID
        
        Args:
            signal_id: Signal ID
            
        Returns:
            Signal data or None if not found
        """
        try:
            response = supabase.table("signals").select("*").eq("id", signal_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting signal by ID: {str(e)}")
            return None
            
    @staticmethod
    async def create_signal(signal_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create a new signal
        
        Args:
            signal_data: Signal data to insert
            
        Returns:
            Created signal data or None if failed
        """
        try:
            response = supabase.table("signals").insert(signal_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating signal: {str(e)}")
            return None
            
    @staticmethod
    async def update_signal(signal_id: str, signal_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update signal data
        
        Args:
            signal_id: Signal ID
            signal_data: Signal data to update
            
        Returns:
            Updated signal data or None if failed
        """
        try:
            response = supabase.table("signals").update(signal_data).eq("id", signal_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error updating signal: {str(e)}")
            return None
            
    @staticmethod
    async def delete_signal(signal_id: str) -> bool:
        """
        Delete a signal
        
        Args:
            signal_id: Signal ID
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = supabase.table("signals").delete().eq("id", signal_id).execute()
            
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error deleting signal: {str(e)}")
            return False
            
    @staticmethod
    async def save_sentiment_data(sentiment_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Save sentiment data
        
        Args:
            sentiment_data: Sentiment data to save
            
        Returns:
            Saved sentiment data or None if failed
        """
        try:
            response = supabase.table("sentiment_data").insert(sentiment_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error saving sentiment data: {str(e)}")
            return None
            
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user by ID
        
        Args:
            user_id: User ID
            
        Returns:
            User data or None if not found
        """
        try:
            response = supabase.table("users").select("*").eq("id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            return None
            
    @staticmethod
    async def create_user_settings(settings_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create user settings
        
        Args:
            settings_data: Settings data to insert
            
        Returns:
            Created settings data or None if failed
        """
        try:
            response = supabase.table("user_settings").insert(settings_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating user settings: {str(e)}")
            return None
            
    @staticmethod
    async def get_user_settings(user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user settings
        
        Args:
            user_id: User ID
            
        Returns:
            User settings or None if not found
        """
        try:
            response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting user settings: {str(e)}")
            return None
            
    @staticmethod
    async def update_user_settings(user_id: str, settings_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update user settings
        
        Args:
            user_id: User ID
            settings_data: Settings data to update
            
        Returns:
            Updated settings data or None if failed
        """
        try:
            response = supabase.table("user_settings").update(settings_data).eq("user_id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error updating user settings: {str(e)}")
            return None
            
    @staticmethod
    async def create_user_session(session_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create user session for WebSocket connections
        
        Args:
            session_data: Session data to insert
            
        Returns:
            Created session data or None if failed
        """
        try:
            response = supabase.table("user_sessions").insert(session_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating user session: {str(e)}")
            return None
            
    @staticmethod
    async def get_user_session(session_token: str) -> Optional[Dict[str, Any]]:
        """
        Get user session by token
        
        Args:
            session_token: Session token
            
        Returns:
            Session data or None if not found
        """
        try:
            response = supabase.table("user_sessions").select("*").eq("session_token", session_token).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting user session: {str(e)}")
            return None
            
    @staticmethod
    async def update_session_last_active(session_token: str) -> bool:
        """
        Update session last active timestamp
        
        Args:
            session_token: Session token
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = supabase.table("user_sessions").update({"last_active": datetime.now().isoformat()}).eq("session_token", session_token).execute()
            
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error updating session last active: {str(e)}")
            return False
            
    @staticmethod
    async def delete_user_session(session_token: str) -> bool:
        """
        Delete user session
        
        Args:
            session_token: Session token
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = supabase.table("user_sessions").delete().eq("session_token", session_token).execute()
            
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error deleting user session: {str(e)}")
            return False
            
    @staticmethod
    async def save_signal_outcome(outcome_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Save signal outcome with AI reflection
        
        Args:
            outcome_data: Outcome data to save
            
        Returns:
            Saved outcome data or None if failed
        """
        try:
            response = supabase.table("signal_outcomes").insert(outcome_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error saving signal outcome: {str(e)}")
            return None
            
    @staticmethod
    async def get_signal_outcomes(signal_id: str) -> List[Dict[str, Any]]:
        """
        Get outcomes for a signal
        
        Args:
            signal_id: Signal ID
            
        Returns:
            List of outcomes
        """
        try:
            response = supabase.table("signal_outcomes").select("*").eq("signal_id", signal_id).order("created_at", desc=True).execute()
            
            return response.data
        except Exception as e:
            logger.error(f"Error getting signal outcomes: {str(e)}")
            return []
            
    @staticmethod
    async def get_performance_metrics(currency_pair: str, timeframe: str) -> Optional[Dict[str, Any]]:
        """
        Get AI performance metrics for currency pair and timeframe
        
        Args:
            currency_pair: Currency pair
            timeframe: Timeframe
            
        Returns:
            Performance metrics or None if not found
        """
        try:
            response = supabase.table("ai_performance_metrics").select("*").eq("currency_pair", currency_pair).eq("timeframe", timeframe).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting performance metrics: {str(e)}")
            return None
            
    @staticmethod
    async def save_performance_metrics(metrics_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Save AI performance metrics
        
        Args:
            metrics_data: Metrics data to save
            
        Returns:
            Saved metrics data or None if failed
        """
        try:
            # Check if metrics already exist
            existing = await Database.get_performance_metrics(
                metrics_data["currency_pair"],
                metrics_data["timeframe"]
            )
            
            if existing:
                # Update existing metrics
                response = supabase.table("ai_performance_metrics").update(metrics_data).eq("id", existing["id"]).execute()
            else:
                # Create new metrics
                response = supabase.table("ai_performance_metrics").insert(metrics_data).execute()
                
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error saving performance metrics: {str(e)}")
            return None
            
    @staticmethod
    async def create_user_notification(notification_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create user notification
        
        Args:
            notification_data: Notification data to insert
            
        Returns:
            Created notification data or None if failed
        """
        try:
            response = supabase.table("user_notifications").insert(notification_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating user notification: {str(e)}")
            return None
            
    @staticmethod
    async def get_user_notifications(user_id: str, unread_only: bool = False, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get notifications for a user
        
        Args:
            user_id: User ID
            unread_only: Only return unread notifications
            limit: Maximum number of notifications to return
            
        Returns:
            List of notifications
        """
        try:
            query = supabase.table("user_notifications").select("*").eq("user_id", user_id)
            
            if unread_only:
                query = query.eq("is_read", False)
                
            response = query.order("created_at", desc=True).limit(limit).execute()
            
            return response.data
        except Exception as e:
            logger.error(f"Error getting user notifications: {str(e)}")
            return []
            
    @staticmethod
    async def mark_notification_as_read(notification_id: str) -> bool:
        """
        Mark notification as read
        
        Args:
            notification_id: Notification ID
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = supabase.table("user_notifications").update({"is_read": True}).eq("id", notification_id).execute()
            
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error marking notification as read: {str(e)}")
            return False
        """
        Save sentiment data
        
        Args:
            sentiment_data: Sentiment data to save
            
        Returns:
            Saved sentiment data or None if failed
        """
        try:
            # Check if sentiment data for this currency pair exists today
            currency_pair = sentiment_data.get("currency_pair")
            today = datetime.now().date().isoformat()
            
            response = supabase.table("sentiment_data") \
                .select("*") \
                .eq("currency_pair", currency_pair) \
                .gte("created_at", today) \
                .execute()
                
            if response.data and len(response.data) > 0:
                # Update existing sentiment data
                sentiment_id = response.data[0]["id"]
                response = supabase.table("sentiment_data") \
                    .update(sentiment_data) \
                    .eq("id", sentiment_id) \
                    .execute()
            else:
                # Create new sentiment data
                response = supabase.table("sentiment_data") \
                    .insert(sentiment_data) \
                    .execute()
                    
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error saving sentiment data: {str(e)}")
            return None
            
    @staticmethod
    async def get_sentiment_data(currency_pair: str) -> Optional[Dict[str, Any]]:
        """
        Get sentiment data for a currency pair
        
        Args:
            currency_pair: Currency pair
            
        Returns:
            Sentiment data or None if not found
        """
        try:
            response = supabase.table("sentiment_data") \
                .select("*") \
                .eq("currency_pair", currency_pair) \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()
                
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting sentiment data: {str(e)}")
            return None
            
    @staticmethod
    async def save_signal_outcome(outcome_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Save signal outcome for reflection and learning
        
        Args:
            outcome_data: Outcome data to save
            
        Returns:
            Saved outcome data or None if failed
        """
        try:
            response = supabase.table("signal_outcomes").insert(outcome_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error saving signal outcome: {str(e)}")
            return None
            
    @staticmethod
    async def get_signal_outcomes(signal_id: str) -> List[Dict[str, Any]]:
        """
        Get outcomes for a signal
        
        Args:
            signal_id: Signal ID
            
        Returns:
            List of outcomes
        """
        try:
            response = supabase.table("signal_outcomes") \
                .select("*") \
                .eq("signal_id", signal_id) \
                .order("created_at", asc=True) \
                .execute()
                
            return response.data
        except Exception as e:
            logger.error(f"Error getting signal outcomes: {str(e)}")
            return []
