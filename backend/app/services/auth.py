"""
Authentication services for ForexJoey backend
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import ValidationError

from app.core.config import settings
from app.models.user import User, UserCreate, UserInDB, Token
from app.db.supabase import Database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 password bearer for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hashed password
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a password
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    return pwd_context.hash(password)

async def authenticate_user(email: str, password: str) -> Optional[User]:
    """
    Authenticate a user
    
    Args:
        email: User email
        password: User password
        
    Returns:
        User object if authentication is successful, None otherwise
    """
    try:
        # Get user from database
        user_data = await Database.get_user_by_email(email)
        
        if not user_data:
            return None
            
        # Create UserInDB object
        user_in_db = UserInDB(**user_data)
        
        # Verify password
        if not verify_password(password, user_in_db.hashed_password):
            return None
            
        # Create User object (without hashed password)
        return User(**user_in_db.dict(exclude={"hashed_password"}))
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}")
        return None

async def register_user(user_in: UserCreate) -> User:
    """
    Register a new user
    
    Args:
        user_in: User registration data
        
    Returns:
        Created user
    """
    # Check if user already exists
    existing_user = await Database.get_user_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists"
        )
        
    # Hash password
    hashed_password = get_password_hash(user_in.password)
    
    # Create user data
    user_data = user_in.dict(exclude={"password"})
    user_data["hashed_password"] = hashed_password
    user_data["is_active"] = True
    
    # Insert user into database
    created_user = await Database.create_user(user_data)
    
    if not created_user:
        raise HTTPException(
            status_code=500,
            detail="Failed to create user"
        )
        
    # Create initial user settings
    initial_settings = {
        "user_id": created_user["id"],
        "theme": "dark",
        "currency_pairs": ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"],
        "notification_preferences": {
            "email": True,
            "push": False
        },
        "risk_profile": "moderate",
        "auto_trade": False,
        "max_risk_per_trade": 2.0
    }
    
    # Insert user settings into database (but don't fail if this fails)
    try:
        await Database.create_user_settings(initial_settings)
    except Exception as e:
        logger.error(f"Error creating initial user settings: {str(e)}")
    
    return User(**created_user)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Data to encode in the token
        expires_delta: Token expiration time
        
    Returns:
        JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
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
        
    return User(**user_data)

async def get_user_settings(user_id: str) -> Dict[str, Any]:
    """
    Get user settings
    
    Args:
        user_id: User ID
        
    Returns:
        User settings
    """
    settings_data = await Database.get_user_settings(user_id)
    
    if not settings_data:
        # Return default settings if not found
        return {
            "user_id": user_id,
            "theme": "dark",
            "currency_pairs": ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"],
            "notification_preferences": {
                "email": True,
                "push": False
            },
            "risk_profile": "moderate",
            "auto_trade": False,
            "max_risk_per_trade": 2.0
        }
        
    return settings_data
