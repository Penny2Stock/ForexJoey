from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class Timeframe(str, Enum):
    M1 = "M1"
    M5 = "M5"
    M15 = "M15"
    M30 = "M30"
    H1 = "H1"
    H4 = "H4"
    D = "D"
    W = "W"
    M = "M"

class Candle(BaseModel):
    time: datetime
    open: float
    high: float
    low: float
    close: float
    volume: Optional[int] = None
    
    class Config:
        orm_mode = True

class MarketData(BaseModel):
    instrument: str
    granularity: Timeframe
    candles: List[Candle]
    
    class Config:
        orm_mode = True

class NewsItem(BaseModel):
    title: str
    source: str
    url: str
    published_at: datetime
    content: Optional[str] = None
    sentiment_score: Optional[float] = None  # -1.0 to 1.0
    relevance_score: Optional[float] = None  # 0.0 to 1.0
    currencies: List[str] = []
    
    class Config:
        orm_mode = True

class EconomicCalendarEvent(BaseModel):
    event_id: str
    title: str
    country: str
    currency: str
    impact: str  # "HIGH", "MEDIUM", "LOW"
    event_time: datetime
    forecast: Optional[str] = None
    previous: Optional[str] = None
    actual: Optional[str] = None
    unit: Optional[str] = None
    
    class Config:
        orm_mode = True

class TechnicalIndicator(BaseModel):
    name: str
    value: float
    parameters: Dict[str, Any] = {}
    interpretation: Optional[str] = None
    
    class Config:
        orm_mode = True

class MarketSentiment(BaseModel):
    instrument: str
    bullish_percentage: float
    bearish_percentage: float
    neutral_percentage: float
    source: str
    time: datetime
    
    class Config:
        orm_mode = True

class CurrencyStrength(BaseModel):
    currency: str
    strength_index: float  # -1.0 to 1.0
    time: datetime
    
    class Config:
        orm_mode = True
