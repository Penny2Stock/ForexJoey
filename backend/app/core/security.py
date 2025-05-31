from datetime import datetime, timedelta
from typing import Any, Optional, Union, Dict
import logging

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, WebSocket
from fastapi.security import OAuth2PasswordBearer

from .config import settings
from app.db.supabase import Database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OAuth2 password bearer for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a password
    """
    return pwd_context.hash(password)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get the current user from the token
    
    Args:
        token: JWT token
        
    Returns:
        Current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Get user from database
    user_data = await Database.get_user_by_id(user_id)
    
    if user_data is None:
        raise credentials_exception
        
    return user_data

async def get_current_user_ws(token: str):
    """
    Get the current user from the token for WebSocket connections
    
    Args:
        token: JWT token
        
    Returns:
        Current user
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise ValueError("Invalid token")
            
        # Get user from database
        user_data = await Database.get_user_by_id(user_id)
        
        if user_data is None:
            raise ValueError("User not found")
            
        return user_data
    except Exception as e:
        logger.error(f"Error authenticating WebSocket user: {str(e)}")
        raise ValueError("Authentication failed")
