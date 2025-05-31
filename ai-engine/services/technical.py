import logging
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def analyze_technical_data(
    technical_data: Dict[str, Any],
    timeframe: str
) -> Dict[str, Any]:
    """
    Perform technical analysis on market data
    Returns a directional bias (BUY, SELL, NEUTRAL) with confidence score and factors
    """
    logger.info(f"Analyzing technical data for {technical_data['instrument']} on {timeframe} timeframe")
    
    try:
        # Extract data from input
        instrument = technical_data["instrument"]
        indicators = pd.DataFrame(technical_data["indicators"])
        
        # Ensure we have enough data
        if len(indicators) < 50:
            return {
                "direction": "NEUTRAL",
                "confidence_score": 0.0,
                "factors": [{"name": "insufficient_data", "value": len(indicators), "interpretation": "Not enough data for analysis"}],
                "error": "Insufficient data points for reliable analysis"
            }
        
        # Focus on most recent data (last 30 candles)
        recent_data = indicators.tail(30).copy()
        
        # Initialize analysis results
        analysis_factors = []
        buy_signals = 0
        sell_signals = 0
        neutral_signals = 0
        total_signals = 0
        
        # 1. Trend Analysis - Moving Averages
        try:
            # Price relative to moving averages
            last_close = recent_data["close"].iloc[-1]
            last_sma_20 = recent_data["sma_20"].iloc[-1]
            last_sma_50 = recent_data["sma_50"].iloc[-1]
            last_sma_200 = recent_data["sma_200"].iloc[-1]
            
            # Price vs SMA 20
            if last_close > last_sma_20:
                analysis_factors.append({
                    "name": "price_above_sma_20",
                    "value": last_close / last_sma_20,
                    "interpretation": "Price above 20-period SMA, bullish"
                })
                buy_signals += 1
            elif last_close < last_sma_20:
                analysis_factors.append({
                    "name": "price_below_sma_20",
                    "value": last_sma_20 / last_close,
                    "interpretation": "Price below 20-period SMA, bearish"
                })
                sell_signals += 1
            
            # Price vs SMA 50
            if last_close > last_sma_50:
                analysis_factors.append({
                    "name": "price_above_sma_50",
                    "value": last_close / last_sma_50,
                    "interpretation": "Price above 50-period SMA, bullish"
                })
                buy_signals += 1
            elif last_close < last_sma_50:
                analysis_factors.append({
                    "name": "price_below_sma_50",
                    "value": last_sma_50 / last_close,
                    "interpretation": "Price below 50-period SMA, bearish"
                })
                sell_signals += 1
            
            # Price vs SMA 200
            if last_close > last_sma_200:
                analysis_factors.append({
                    "name": "price_above_sma_200",
                    "value": last_close / last_sma_200,
                    "interpretation": "Price above 200-period SMA, bullish (major trend)"
                })
                buy_signals += 2  # Higher weight for long-term trend
            elif last_close < last_sma_200:
                analysis_factors.append({
                    "name": "price_below_sma_200",
                    "value": last_sma_200 / last_close,
                    "interpretation": "Price below 200-period SMA, bearish (major trend)"
                })
                sell_signals += 2  # Higher weight for long-term trend
            
            # Moving Average crossovers
            # EMA 12 vs EMA 26
            last_ema_12 = recent_data["ema_12"].iloc[-1]
            last_ema_26 = recent_data["ema_26"].iloc[-1]
            prev_ema_12 = recent_data["ema_12"].iloc[-2]
            prev_ema_26 = recent_data["ema_26"].iloc[-2]
            
            if last_ema_12 > last_ema_26 and prev_ema_12 <= prev_ema_26:
                analysis_factors.append({
                    "name": "ema_12_26_bullish_crossover",
                    "value": last_ema_12 / last_ema_26,
                    "interpretation": "EMA 12 crossed above EMA 26, bullish signal"
                })
                buy_signals += 2
            elif last_ema_12 < last_ema_26 and prev_ema_12 >= prev_ema_26:
                analysis_factors.append({
                    "name": "ema_12_26_bearish_crossover",
                    "value": last_ema_26 / last_ema_12,
                    "interpretation": "EMA 12 crossed below EMA 26, bearish signal"
                })
                sell_signals += 2
            
            total_signals += 7  # Total possible trend signals
        except Exception as e:
            logger.error(f"Error in trend analysis: {str(e)}")
        
        # 2. Momentum Analysis - MACD, RSI, Stochastic
        try:
            # MACD
            if "MACD_12_26_9" in recent_data.columns and "MACDs_12_26_9" in recent_data.columns:
                last_macd = recent_data["MACD_12_26_9"].iloc[-1]
                last_macd_signal = recent_data["MACDs_12_26_9"].iloc[-1]
                prev_macd = recent_data["MACD_12_26_9"].iloc[-2]
                prev_macd_signal = recent_data["MACDs_12_26_9"].iloc[-2]
                
                if last_macd > last_macd_signal and prev_macd <= prev_macd_signal:
                    analysis_factors.append({
                        "name": "macd_bullish_crossover",
                        "value": last_macd - last_macd_signal,
                        "interpretation": "MACD crossed above signal line, bullish momentum"
                    })
                    buy_signals += 2
                elif last_macd < last_macd_signal and prev_macd >= prev_macd_signal:
                    analysis_factors.append({
                        "name": "macd_bearish_crossover",
                        "value": last_macd_signal - last_macd,
                        "interpretation": "MACD crossed below signal line, bearish momentum"
                    })
                    sell_signals += 2
                
                if last_macd > 0:
                    analysis_factors.append({
                        "name": "macd_positive",
                        "value": last_macd,
                        "interpretation": "MACD is positive, bullish momentum"
                    })
                    buy_signals += 1
                elif last_macd < 0:
                    analysis_factors.append({
                        "name": "macd_negative",
                        "value": last_macd,
                        "interpretation": "MACD is negative, bearish momentum"
                    })
                    sell_signals += 1
            
            # RSI
            last_rsi = recent_data["rsi_14"].iloc[-1]
            if last_rsi > 70:
                analysis_factors.append({
                    "name": "rsi_overbought",
                    "value": last_rsi,
                    "interpretation": "RSI above 70, overbought condition (potential reversal)"
                })
                sell_signals += 1
            elif last_rsi < 30:
                analysis_factors.append({
                    "name": "rsi_oversold",
                    "value": last_rsi,
                    "interpretation": "RSI below 30, oversold condition (potential reversal)"
                })
                buy_signals += 1
            elif last_rsi > 50:
                analysis_factors.append({
                    "name": "rsi_bullish",
                    "value": last_rsi,
                    "interpretation": "RSI above 50, bullish momentum"
                })
                buy_signals += 0.5
            elif last_rsi < 50:
                analysis_factors.append({
                    "name": "rsi_bearish",
                    "value": last_rsi,
                    "interpretation": "RSI below 50, bearish momentum"
                })
                sell_signals += 0.5
            
            # Stochastic
            if "STOCHk_14_3_3" in recent_data.columns and "STOCHd_14_3_3" in recent_data.columns:
                last_stoch_k = recent_data["STOCHk_14_3_3"].iloc[-1]
                last_stoch_d = recent_data["STOCHd_14_3_3"].iloc[-1]
                prev_stoch_k = recent_data["STOCHk_14_3_3"].iloc[-2]
                prev_stoch_d = recent_data["STOCHd_14_3_3"].iloc[-2]
                
                if last_stoch_k > last_stoch_d and prev_stoch_k <= prev_stoch_d:
                    analysis_factors.append({
                        "name": "stoch_bullish_crossover",
                        "value": last_stoch_k - last_stoch_d,
                        "interpretation": "Stochastic %K crossed above %D, bullish signal"
                    })
                    buy_signals += 1
                elif last_stoch_k < last_stoch_d and prev_stoch_k >= prev_stoch_d:
                    analysis_factors.append({
                        "name": "stoch_bearish_crossover",
                        "value": last_stoch_d - last_stoch_k,
                        "interpretation": "Stochastic %K crossed below %D, bearish signal"
                    })
                    sell_signals += 1
                
                if last_stoch_k > 80 and last_stoch_d > 80:
                    analysis_factors.append({
                        "name": "stoch_overbought",
                        "value": last_stoch_k,
                        "interpretation": "Stochastic overbought, potential reversal"
                    })
                    sell_signals += 1
                elif last_stoch_k < 20 and last_stoch_d < 20:
                    analysis_factors.append({
                        "name": "stoch_oversold",
                        "value": last_stoch_k,
                        "interpretation": "Stochastic oversold, potential reversal"
                    })
                    buy_signals += 1
            
            total_signals += 8  # Total possible momentum signals
        except Exception as e:
            logger.error(f"Error in momentum analysis: {str(e)}")
        
        # 3. Volatility Analysis - Bollinger Bands, ATR
        try:
            # Bollinger Bands
            if "BBL_20_2.0" in recent_data.columns and "BBM_20_2.0" in recent_data.columns and "BBU_20_2.0" in recent_data.columns:
                last_close = recent_data["close"].iloc[-1]
                last_bbl = recent_data["BBL_20_2.0"].iloc[-1]
                last_bbm = recent_data["BBM_20_2.0"].iloc[-1]
                last_bbu = recent_data["BBU_20_2.0"].iloc[-1]
                
                bb_width = (last_bbu - last_bbl) / last_bbm
                analysis_factors.append({
                    "name": "bollinger_band_width",
                    "value": bb_width,
                    "interpretation": f"Bollinger Band width: {bb_width:.4f}"
                })
                
                if last_close < last_bbl:
                    analysis_factors.append({
                        "name": "price_below_lower_bb",
                        "value": last_bbl / last_close,
                        "interpretation": "Price below lower Bollinger Band, potential oversold condition"
                    })
                    buy_signals += 1
                elif last_close > last_bbu:
                    analysis_factors.append({
                        "name": "price_above_upper_bb",
                        "value": last_close / last_bbu,
                        "interpretation": "Price above upper Bollinger Band, potential overbought condition"
                    })
                    sell_signals += 1
            
            # ATR (Average True Range) for volatility measurement
            # Calculate ATR if not available
            highs = recent_data["high"].values
            lows = recent_data["low"].values
            closes = recent_data["close"].values
            
            true_ranges = []
            for i in range(1, len(closes)):
                true_range = max(
                    highs[i] - lows[i],  # Current high - current low
                    abs(highs[i] - closes[i-1]),  # Current high - previous close
                    abs(lows[i] - closes[i-1])  # Current low - previous close
                )
                true_ranges.append(true_range)
            
            atr = sum(true_ranges[-14:]) / 14 if len(true_ranges) >= 14 else None
            
            if atr:
                # ATR as percentage of price
                atr_percentage = (atr / last_close) * 100
                analysis_factors.append({
                    "name": "atr",
                    "value": atr,
                    "interpretation": f"ATR: {atr:.5f} ({atr_percentage:.2f}% of price)"
                })
                
                # High volatility might favor trend continuation
                if atr_percentage > 1.0:  # High volatility for forex
                    analysis_factors.append({
                        "name": "high_volatility",
                        "value": atr_percentage,
                        "interpretation": "High volatility, trend continuation more likely"
                    })
                elif atr_percentage < 0.3:  # Low volatility for forex
                    analysis_factors.append({
                        "name": "low_volatility",
                        "value": atr_percentage,
                        "interpretation": "Low volatility, potential breakout imminent"
                    })
            
            total_signals += 3  # Total possible volatility signals
        except Exception as e:
            logger.error(f"Error in volatility analysis: {str(e)}")
        
        # 4. Support/Resistance Analysis
        try:
            # Identify recent swing highs and lows
            window = 5  # Look for swing points in 5-period windows
            swing_highs = []
            swing_lows = []
            
            for i in range(window, len(recent_data) - window):
                # Check for swing high
                if all(recent_data["high"].iloc[i] > recent_data["high"].iloc[i-j] for j in range(1, window+1)) and \
                   all(recent_data["high"].iloc[i] > recent_data["high"].iloc[i+j] for j in range(1, window+1)):
                    swing_highs.append((recent_data.index[i], recent_data["high"].iloc[i]))
                
                # Check for swing low
                if all(recent_data["low"].iloc[i] < recent_data["low"].iloc[i-j] for j in range(1, window+1)) and \
                   all(recent_data["low"].iloc[i] < recent_data["low"].iloc[i+j] for j in range(1, window+1)):
                    swing_lows.append((recent_data.index[i], recent_data["low"].iloc[i]))
            
            # Find closest support and resistance
            last_close = recent_data["close"].iloc[-1]
            
            # Sort swing levels
            resistances = [level for _, level in swing_highs if level > last_close]
            supports = [level for _, level in swing_lows if level < last_close]
            
            resistances.sort()
            supports.sort(reverse=True)
            
            # Nearest levels
            nearest_resistance = resistances[0] if resistances else None
            nearest_support = supports[0] if supports else None
            
            if nearest_resistance:
                resistance_distance = (nearest_resistance - last_close) / last_close * 100
                analysis_factors.append({
                    "name": "nearest_resistance",
                    "value": nearest_resistance,
                    "interpretation": f"Nearest resistance at {nearest_resistance:.5f} ({resistance_distance:.2f}% away)"
                })
                
                if resistance_distance < 0.5:  # Very close to resistance
                    analysis_factors.append({
                        "name": "close_to_resistance",
                        "value": resistance_distance,
                        "interpretation": "Price very close to resistance, potential reversal point"
                    })
                    sell_signals += 1
            
            if nearest_support:
                support_distance = (last_close - nearest_support) / last_close * 100
                analysis_factors.append({
                    "name": "nearest_support",
                    "value": nearest_support,
                    "interpretation": f"Nearest support at {nearest_support:.5f} ({support_distance:.2f}% away)"
                })
                
                if support_distance < 0.5:  # Very close to support
                    analysis_factors.append({
                        "name": "close_to_support",
                        "value": support_distance,
                        "interpretation": "Price very close to support, potential reversal point"
                    })
                    buy_signals += 1
            
            # Risk-reward based on support/resistance
            if nearest_support and nearest_resistance:
                risk = (last_close - nearest_support) / last_close
                reward = (nearest_resistance - last_close) / last_close
                rr_ratio = reward / risk if risk > 0 else 0
                
                analysis_factors.append({
                    "name": "risk_reward_ratio",
                    "value": rr_ratio,
                    "interpretation": f"Risk-reward ratio: {rr_ratio:.2f}"
                })
                
                if rr_ratio > 2.0:
                    analysis_factors.append({
                        "name": "favorable_risk_reward_long",
                        "value": rr_ratio,
                        "interpretation": "Favorable risk-reward for long position"
                    })
                    buy_signals += 1
                elif rr_ratio < 0.5:
                    analysis_factors.append({
                        "name": "unfavorable_risk_reward_long",
                        "value": rr_ratio,
                        "interpretation": "Unfavorable risk-reward for long position"
                    })
                    sell_signals += 1
            
            total_signals += 3  # Total possible support/resistance signals
        except Exception as e:
            logger.error(f"Error in support/resistance analysis: {str(e)}")
        
        # Determine direction and confidence
        buy_score = buy_signals / total_signals if total_signals > 0 else 0
        sell_score = sell_signals / total_signals if total_signals > 0 else 0
        neutral_score = 1 - (buy_score + sell_score)
        
        # Calculate confidence score (0.5-1.0 scale)
        if buy_score > sell_score:
            direction = "BUY"
            # Scale confidence from 0.5 (barely stronger) to 1.0 (overwhelmingly stronger)
            confidence_score = 0.5 + min(0.5, (buy_score - sell_score) * 2)
        elif sell_score > buy_score:
            direction = "SELL"
            confidence_score = 0.5 + min(0.5, (sell_score - buy_score) * 2)
        else:
            direction = "NEUTRAL"
            confidence_score = 0.5
        
        # Add summary factor
        analysis_factors.append({
            "name": "signal_summary",
            "value": {
                "buy_signals": buy_signals,
                "sell_signals": sell_signals,
                "total_signals": total_signals,
                "buy_score": buy_score,
                "sell_score": sell_score
            },
            "interpretation": f"Technical analysis summary: {direction} with {confidence_score:.2f} confidence"
        })
        
        return {
            "direction": direction,
            "confidence_score": confidence_score,
            "factors": analysis_factors
        }
    
    except Exception as e:
        logger.error(f"Error in technical analysis: {str(e)}")
        return {
            "direction": "NEUTRAL",
            "confidence_score": 0.0,
            "factors": [{"name": "error", "value": str(e), "interpretation": "Error in technical analysis"}],
            "error": str(e)
        }
