import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import pandas as pd
import pandas_ta as ta
import numpy as np
from oandapyV20 import API
from oandapyV20.exceptions import V20Error
from oandapyV20.endpoints.instruments import InstrumentsCandles
from oandapyV20.endpoints.pricing import PricingStream, PricingInfo
from oandapyV20.endpoints.orders import OrderCreate, OrderDetails, OrdersPending
from oandapyV20.endpoints.trades import TradesList, TradeDetails, TradeClose
from oandapyV20.endpoints.positions import PositionList, PositionDetails
from oandapyV20.endpoints.accounts import AccountSummary, AccountDetails

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from ..core.config import settings
from ..models.market import Candle, MarketData, Timeframe

# Initialize OANDA API client
oanda_client = API(access_token=settings.OANDA_API_KEY, environment=settings.OANDA_ENVIRONMENT)

async def get_candles(
    instrument: str,
    granularity: str,
    count: int = 100,
    from_time: Optional[datetime] = None,
    to_time: Optional[datetime] = None
) -> List[Candle]:
    """
    Get historical candle data from OANDA
    """
    params = {
        "granularity": granularity,
        "count": count
    }
    
    if from_time:
        params["from"] = from_time.strftime("%Y-%m-%dT%H:%M:%SZ")
        del params["count"]
    
    if to_time:
        params["to"] = to_time.strftime("%Y-%m-%dT%H:%M:%SZ")
        del params["count"]
    
    try:
        r = InstrumentsCandles(instrument=instrument, params=params)
        response = await asyncio.to_thread(oanda_client.request, r)
        
        candles = []
        for candle_data in response["candles"]:
            if candle_data["complete"]:
                candle = Candle(
                    time=datetime.fromisoformat(candle_data["time"].replace("Z", "+00:00")),
                    open=float(candle_data["mid"]["o"]),
                    high=float(candle_data["mid"]["h"]),
                    low=float(candle_data["mid"]["l"]),
                    close=float(candle_data["mid"]["c"]),
                    volume=int(candle_data["volume"]) if "volume" in candle_data else None
                )
                candles.append(candle)
        
        return candles
    except V20Error as e:
        raise Exception(f"OANDA API error: {str(e)}")
    except Exception as e:
        raise Exception(f"Error fetching candles: {str(e)}")

async def get_market_data(
    instrument: str,
    granularity: Timeframe,
    count: int = 100
) -> MarketData:
    """
    Get market data with candles for a specific instrument
    """
    candles = await get_candles(
        instrument=instrument,
        granularity=granularity.value,
        count=count
    )
    
    return MarketData(
        instrument=instrument,
        granularity=granularity,
        candles=candles
    )

async def get_current_price(instrument: str) -> Dict[str, float]:
    """
    Get the current bid/ask price for an instrument
    """
    params = {"instruments": instrument}
    try:
        r = PricingInfo(accountID=settings.OANDA_ACCOUNT_ID, params=params)
        response = await asyncio.to_thread(oanda_client.request, r)
        
        prices = response["prices"][0]
        return {
            "instrument": instrument,
            "bid": float(prices["bids"][0]["price"]),
            "ask": float(prices["asks"][0]["price"]),
            "spread": float(prices["asks"][0]["price"]) - float(prices["bids"][0]["price"]),
            "time": datetime.fromisoformat(prices["time"].replace("Z", "+00:00"))
        }
    except Exception as e:
        logger.error(f"Error fetching current price: {str(e)}")
        raise Exception(f"Error fetching current price: {str(e)}")
        
async def get_live_price(instrument: str) -> Dict[str, float]:
    """
    Get the most recent live price for an instrument.
    For WebSocket streaming.
    
    Args:
        instrument: Instrument code (e.g., "EUR_USD")
        
    Returns:
        Dict with price information
    """
    try:
        # Format the instrument to ensure it's in the correct format
        # OANDA uses EUR_USD format but our frontend uses EUR/USD
        formatted_instrument = instrument.replace("/", "_")
        
        # Get current price
        price_data = await get_current_price(formatted_instrument)
        
        # Add additional info for the frontend
        mid_price = (price_data["bid"] + price_data["ask"]) / 2
        price_data["mid"] = round(mid_price, 5)
        price_data["movement"] = 0  # Will be calculated by frontend based on previous price
        price_data["formatted_instrument"] = instrument  # Return the original format for frontend
        
        return price_data
    except Exception as e:
        logger.error(f"Error getting live price for {instrument}: {str(e)}")
        return {
            "instrument": instrument,
            "bid": 0,
            "ask": 0,
            "mid": 0,
            "spread": 0,
            "movement": 0,
            "error": str(e),
            "time": datetime.now().isoformat()
        }
        
# Dictionary to store price streams for different instruments
price_streams = {}

async def start_price_stream(instrument: str):
    """
    Start a price stream for an instrument
    
    Args:
        instrument: Instrument code (e.g., "EUR_USD")
    """
    if instrument in price_streams:
        return
        
    formatted_instrument = instrument.replace("/", "_")
    
    # Create stream task
    task = asyncio.create_task(_stream_prices(formatted_instrument))
    price_streams[instrument] = task
    logger.info(f"Started price stream for {instrument}")
    
async def stop_price_stream(instrument: str):
    """
    Stop a price stream for an instrument
    
    Args:
        instrument: Instrument code (e.g., "EUR_USD")
    """
    if instrument not in price_streams:
        return
        
    # Cancel stream task
    price_streams[instrument].cancel()
    del price_streams[instrument]
    logger.info(f"Stopped price stream for {instrument}")
    
async def _stream_prices(instrument: str):
    """
    Internal method to stream prices for an instrument
    
    Args:
        instrument: Instrument code in OANDA format (e.g., "EUR_USD")
    """
    params = {
        "instruments": instrument
    }
    
    try:
        r = PricingStream(accountID=settings.OANDA_ACCOUNT_ID, params=params)
        async for response in oanda_client.request(r):
            if "type" in response and response["type"] == "PRICE":
                # Process price update
                price_data = {
                    "instrument": instrument,
                    "bid": float(response["bids"][0]["price"]),
                    "ask": float(response["asks"][0]["price"]),
                    "spread": float(response["asks"][0]["price"]) - float(response["bids"][0]["price"]),
                    "time": datetime.fromisoformat(response["time"].replace("Z", "+00:00"))
                }
                
                # Broadcast to subscribers through WebSocket manager
                # This will be implemented in the next steps
                # await broadcast_price_update(instrument.replace("_", "/"), price_data)
    except asyncio.CancelledError:
        logger.info(f"Price stream for {instrument} was cancelled")
    except Exception as e:
        logger.error(f"Error in price stream for {instrument}: {str(e)}")
        # Try to restart the stream after a delay
        await asyncio.sleep(5)
        formatted_instrument = instrument.replace("/", "_")
        asyncio.create_task(_stream_prices(formatted_instrument))

async def create_market_order(
    instrument: str,
    units: float,
    stop_loss: Optional[float] = None,
    take_profit: Optional[float] = None
) -> Dict[str, Any]:
    """
    Create a market order
    Positive units for buy, negative for sell
    """
    data = {
        "order": {
            "type": "MARKET",
            "instrument": instrument,
            "units": str(units),
            "timeInForce": "FOK",
            "positionFill": "DEFAULT"
        }
    }
    
    if stop_loss:
        data["order"]["stopLossOnFill"] = {"price": str(stop_loss)}
    
    if take_profit:
        data["order"]["takeProfitOnFill"] = {"price": str(take_profit)}
    
    try:
        r = OrderCreate(accountID=settings.OANDA_ACCOUNT_ID, data=data)
        response = await asyncio.to_thread(oanda_client.request, r)
        return response
    except V20Error as e:
        raise Exception(f"OANDA API error: {str(e)}")
    except Exception as e:
        raise Exception(f"Error creating order: {str(e)}")

async def close_trade(trade_id: str) -> Dict[str, Any]:
    """
    Close a specific trade
    """
    data = {"units": "ALL"}
    try:
        r = TradeClose(accountID=settings.OANDA_ACCOUNT_ID, tradeID=trade_id, data=data)
        response = await asyncio.to_thread(oanda_client.request, r)
        return response
    except Exception as e:
        raise Exception(f"Error closing trade: {str(e)}")

async def get_account_summary() -> Dict[str, Any]:
    """
    Get account summary
    """
    try:
        r = AccountSummary(accountID=settings.OANDA_ACCOUNT_ID)
        response = await asyncio.to_thread(oanda_client.request, r)
        return response
    except Exception as e:
        raise Exception(f"Error fetching account summary: {str(e)}")

async def get_open_trades() -> List[Dict[str, Any]]:
    """
    Get all open trades
    """
    try:
        r = TradesList(accountID=settings.OANDA_ACCOUNT_ID, params={"state": "OPEN"})
        response = await asyncio.to_thread(oanda_client.request, r)
        return response["trades"]
    except Exception as e:
        raise Exception(f"Error fetching open trades: {str(e)}")

async def get_open_positions() -> List[Dict[str, Any]]:
    """
    Get all open positions
    """
    try:
        r = PositionList(accountID=settings.OANDA_ACCOUNT_ID)
        response = await asyncio.to_thread(oanda_client.request, r)
        positions = []
        for position in response["positions"]:
            if int(position["long"]["units"]) != 0 or int(position["short"]["units"]) != 0:
                positions.append(position)
        return positions
    except Exception as e:
        raise Exception(f"Error fetching open positions: {str(e)}")

def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate common technical indicators for a dataframe of OHLCV data
    """
    # Moving Averages
    df["sma_20"] = ta.sma(df["close"], length=20)
    df["sma_50"] = ta.sma(df["close"], length=50)
    df["sma_200"] = ta.sma(df["close"], length=200)
    df["ema_12"] = ta.ema(df["close"], length=12)
    df["ema_26"] = ta.ema(df["close"], length=26)
    
    # MACD
    macd = ta.macd(df["close"], fast=12, slow=26, signal=9)
    df = pd.concat([df, macd], axis=1)
    
    # RSI
    df["rsi_14"] = ta.rsi(df["close"], length=14)
    
    # Bollinger Bands
    bbands = ta.bbands(df["close"], length=20, std=2)
    df = pd.concat([df, bbands], axis=1)
    
    # Stochastic Oscillator
    stoch = ta.stoch(df["high"], df["low"], df["close"], k=14, d=3, smooth_k=3)
    df = pd.concat([df, stoch], axis=1)
    
    # Average Directional Index
    adx = ta.adx(df["high"], df["low"], df["close"], length=14)
    df = pd.concat([df, adx], axis=1)
    
    return df

async def get_analyzed_market_data(
    instrument: str,
    granularity: Timeframe,
    count: int = 100
) -> Dict[str, Any]:
    """
    Get market data with calculated technical indicators
    """
    candles = await get_candles(
        instrument=instrument,
        granularity=granularity.value,
        count=count
    )
    
    # Convert to dataframe for analysis
    data = {
        "time": [c.time for c in candles],
        "open": [c.open for c in candles],
        "high": [c.high for c in candles],
        "low": [c.low for c in candles],
        "close": [c.close for c in candles],
        "volume": [c.volume if c.volume else 0 for c in candles]
    }
    
    df = pd.DataFrame(data)
    df = calculate_technical_indicators(df)
    
    # Clean up NaN values for JSON serialization
    df = df.replace({np.nan: None})
    
    # Get current price
    current_price = await get_current_price(instrument)
    
    return {
        "instrument": instrument,
        "granularity": granularity,
        "current_price": current_price,
        "candles": candles,
        "indicators": df.to_dict(orient="records")
    }
