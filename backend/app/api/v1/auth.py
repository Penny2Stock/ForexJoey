"""
Authentication API Module for ForexJoey

This module provides API endpoints for user authentication using Supabase Auth.
It enables secure access to ForexJoey's AI-first forex trading capabilities.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import Dict, Optional

from app.services.supabase_service import SupabaseService
from app.api.deps import get_current_user

# Models
class UserCreate(BaseModel):
    """Model for user registration"""
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., description="User password")
    full_name: str = Field(..., description="User's full name")
    risk_profile: str = Field("conservative", description="User's risk tolerance (conservative, moderate, aggressive)")
    experience_level: str = Field("beginner", description="User's forex trading experience level")
    account_balance: Optional[float] = Field(10000, description="Initial account balance for simulation")
    max_drawdown_percentage: Optional[float] = Field(10, description="Maximum allowed drawdown percentage")
    max_position_size_percentage: Optional[float] = Field(2, description="Maximum position size as percentage of account")
    max_daily_trades: Optional[int] = Field(5, description="Maximum daily trades allowed")

class TokenResponse(BaseModel):
    """Response model for token"""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Token type")
    user_id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email")

class UserProfile(BaseModel):
    """Model for user profile response"""
    id: str
    email: str
    full_name: str
    risk_profile: str
    experience_level: str
    account_balance: float
    max_drawdown_percentage: float
    max_position_size_percentage: float
    max_daily_trades: int

# Router
router = APIRouter(tags=["auth"])
supabase_service = SupabaseService()

@router.post("/register", response_model=TokenResponse)
async def register_user(user: UserCreate):
    """
    Register a new user with ForexJoey
    
    Creates a user account in Supabase Auth and sets up user profile and default risk parameters.
    """
    try:
        # Register user with Supabase Auth
        user_data = {
            "full_name": user.full_name,
            "risk_profile": user.risk_profile,
            "experience_level": user.experience_level,
            "account_balance": user.account_balance,
            "max_drawdown_percentage": user.max_drawdown_percentage,
            "max_position_size_percentage": user.max_position_size_percentage,
            "max_daily_trades": user.max_daily_trades
        }
        
        response = await supabase_service.signup_user(
            email=user.email,
            password=user.password,
            user_data=user_data
        )
        
        if not response or "error" in response:
            raise HTTPException(
                status_code=400,
                detail=response.get("error", "Failed to register user")
            )
        
        # Extract token information from response
        access_token = response.get("access_token", "")
        user_id = response.get("user", {}).get("id", "")
        email = response.get("user", {}).get("email", "")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user_id,
            "email": email
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and return access token
    
    Uses Supabase Auth for secure authentication and returns a JWT token.
    """
    try:
        # Sign in user with Supabase Auth
        response = await supabase_service.signin_user(
            email=form_data.username,
            password=form_data.password
        )
        
        if not response or "error" in response:
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )
        
        # Extract token information from response
        access_token = response.get("access_token", "")
        user_id = response.get("user", {}).get("id", "")
        email = response.get("user", {}).get("email", "")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user_id,
            "email": email
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """
    Get the current user's profile
    
    Requires authentication via JWT token.
    """
    try:
        # Extract user ID from token (would be implemented properly in production)
        user_id = "current-user-id"  # This would be extracted from the token
        
        # Get user profile from Supabase
        profile = await supabase_service.get_user_profile(
            user_id=user_id,
            auth_token=current_user["token"]
        )
        
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )
            
        return profile[0]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve profile: {str(e)}"
        )
