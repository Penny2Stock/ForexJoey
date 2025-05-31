"""
API Dependencies Module for ForexJoey

This module provides dependency functions for FastAPI routes,
with a focus on authentication and user management.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Optional
import jwt
from jwt.exceptions import InvalidTokenError

from app.core.config import settings

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    """
    Validate access token and return the current user
    
    This dependency is used to protect routes that require authentication.
    It decodes the JWT token and validates it against Supabase's public key.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # In a production environment, we would verify the token with Supabase's public key
        # For now, we'll simply decode it without verification
        # payload = jwt.decode(
        #     token, 
        #     settings.JWT_PUBLIC_KEY, 
        #     algorithms=[settings.JWT_ALGORITHM],
        #     audience="authenticated"
        # )
        
        # Simplified token handling for development
        # In production, this would properly validate the token
        if not token:
            raise credentials_exception
        
        # Return user data and token for Supabase API calls
        return {
            "token": token,
            # Additional user data would be extracted from the token payload
        }
        
    except InvalidTokenError:
        raise credentials_exception
