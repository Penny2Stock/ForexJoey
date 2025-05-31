from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class SignalDirection(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    NEUTRAL = "NEUTRAL"

class SignalTimeframe(str, Enum):
    M15 = "M15"
    H1 = "H1"
    H4 = "H4"
    D1 = "D1"
    W1 = "W1"

class AnalysisType(str, Enum):
    TECHNICAL = "TECHNICAL"
    FUNDAMENTAL = "FUNDAMENTAL"
    SENTIMENT = "SENTIMENT"
    ECONOMIC = "ECONOMIC"
    COMBINED = "COMBINED"

class SignalStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELED = "CANCELED"
    EXPIRED = "EXPIRED"

class TechnicalFactor(BaseModel):
    indicator: str
    value: float
    interpretation: str
    impact: float = Field(..., ge=-1.0, le=1.0)  # Impact on decision (-1 to 1)

class FundamentalFactor(BaseModel):
    factor: str
    source: str
    interpretation: str
    impact: float = Field(..., ge=-1.0, le=1.0)  # Impact on decision (-1 to 1)

class EconomicEvent(BaseModel):
    event_name: str
    currency: str
    expected: Optional[float] = None
    actual: Optional[float] = None
    previous: Optional[float] = None
    impact: str  # "HIGH", "MEDIUM", "LOW"
    interpretation: str
    event_time: datetime

class SignalBase(BaseModel):
    currency_pair: str
    direction: SignalDirection
    timeframe: SignalTimeframe
    entry_price: float
    stop_loss: float
    take_profit: float
    risk_reward_ratio: float
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    expected_duration: str  # e.g., "2-3 days"
    analysis_summary: str

class SignalCreate(SignalBase):
    user_id: str
    technical_factors: List[TechnicalFactor]
    fundamental_factors: List[FundamentalFactor]
    economic_events: List[EconomicEvent] = []
    ai_reasoning: str
    chart_image_url: Optional[str] = None
    status: SignalStatus = SignalStatus.ACTIVE

class SignalUpdate(BaseModel):
    status: Optional[SignalStatus] = None
    exit_price: Optional[float] = None
    exit_time: Optional[datetime] = None
    profit_loss_pips: Optional[float] = None
    profit_loss_percentage: Optional[float] = None
    user_notes: Optional[str] = None

class SignalInDB(SignalBase):
    id: str
    user_id: str
    technical_factors: List[TechnicalFactor]
    fundamental_factors: List[FundamentalFactor]
    economic_events: List[EconomicEvent] = []
    ai_reasoning: str
    chart_image_url: Optional[str] = None
    status: SignalStatus
    created_at: datetime
    updated_at: datetime
    exit_price: Optional[float] = None
    exit_time: Optional[datetime] = None
    profit_loss_pips: Optional[float] = None
    profit_loss_percentage: Optional[float] = None
    user_notes: Optional[str] = None
    
    class Config:
        orm_mode = True

class Signal(SignalInDB):
    pass

class SignalPerformance(BaseModel):
    total_signals: int
    successful_signals: int
    failed_signals: int
    success_rate: float
    average_profit_pips: float
    average_loss_pips: float
    total_profit_pips: float
    best_currency_pair: Optional[str] = None
    worst_currency_pair: Optional[str] = None
    best_timeframe: Optional[SignalTimeframe] = None
    average_risk_reward: float
