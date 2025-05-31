import os
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import asyncio
import openai
from openai import AsyncOpenAI

# Local imports
from .technical import analyze_technical_data
from .fundamental import analyze_fundamental_data
from .sentiment_integration import analyze_sentiment_data
from .economic_calendar import analyze_economic_events

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_forex_pair(
    currency_pair: str,
    timeframe: str,
    technical_data: Dict[str, Any],
    fundamental_data: Dict[str, Any],
    sentiment_data: Dict[str, Any],
    economic_events: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Comprehensive analysis of a forex pair using multiple intelligence sources:
    1. Technical Analysis
    2. Fundamental Analysis
    3. Sentiment Analysis
    4. Economic Calendar Events
    
    Returns a complete analysis with a trading signal if confidence is high enough.
    """
    logger.info(f"Starting comprehensive analysis for {currency_pair} on {timeframe} timeframe")
    
    # Step 1: Analyze each intelligence source independently
    technical_analysis = await analyze_technical_data(technical_data, timeframe)
    fundamental_analysis = await analyze_fundamental_data(fundamental_data, currency_pair)
    sentiment_analysis = await analyze_sentiment_data(sentiment_data, currency_pair)
    economic_analysis = await analyze_economic_events(economic_events, currency_pair)
    
    # Step 2: Combine analyses using AI to get a holistic view
    combined_analysis = await combine_analyses(
        currency_pair=currency_pair,
        timeframe=timeframe,
        technical_analysis=technical_analysis,
        fundamental_analysis=fundamental_analysis,
        sentiment_analysis=sentiment_analysis,
        economic_analysis=economic_analysis
    )
    
    # Step 3: Generate trading signal if confidence is high enough
    if combined_analysis["confidence_score"] >= 0.65:  # Minimum threshold for signal generation
        signal = await generate_trading_signal(
            currency_pair=currency_pair,
            timeframe=timeframe,
            combined_analysis=combined_analysis,
            current_price=technical_data["current_price"]
        )
        combined_analysis["signal"] = signal
    else:
        combined_analysis["signal"] = {
            "generate": False,
            "reason": "Confidence score below threshold"
        }
    
    return combined_analysis

async def combine_analyses(
    currency_pair: str,
    timeframe: str,
    technical_analysis: Dict[str, Any],
    fundamental_analysis: Dict[str, Any],
    sentiment_analysis: Dict[str, Any],
    economic_analysis: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Use LLM to combine different analyses into a single coherent view
    """
    # Create prompt for the AI model
    system_prompt = """You are ForexJoey, an AI-first forex trading analyst specializing in high-accuracy decision making.
Your task is to analyze multiple intelligence sources (technical, fundamental, sentiment, economic) for a forex pair and provide a comprehensive analysis.
Your analysis must be evidence-based, never make unsupported predictions, and clearly explain your reasoning.
You'll assign a confidence score (0.0-1.0) and a directional bias (BUY, SELL, or NEUTRAL) based on the combined evidence.
Provide a concise summary that a forex trader can understand, focusing on the most important factors influencing your decision."""

    # Create a structured message with all analyses
    user_message = f"""
CURRENCY PAIR: {currency_pair}
TIMEFRAME: {timeframe}

TECHNICAL ANALYSIS:
{json.dumps(technical_analysis, indent=2)}

FUNDAMENTAL ANALYSIS:
{json.dumps(fundamental_analysis, indent=2)}

SENTIMENT ANALYSIS:
{json.dumps(sentiment_analysis, indent=2)}

ECONOMIC CALENDAR ANALYSIS:
{json.dumps(economic_analysis, indent=2)}

Provide a comprehensive analysis that combines all these intelligence sources.
Your response should be in JSON format with the following structure:
{{
  "direction": "BUY/SELL/NEUTRAL",
  "confidence_score": 0.0-1.0,
  "summary": "Brief summary of the analysis",
  "technical_factors": [list of important technical factors],
  "fundamental_factors": [list of important fundamental factors],
  "sentiment_factors": [list of important sentiment factors],
  "economic_factors": [list of important economic events],
  "reasoning": "Detailed reasoning behind the decision"
}}
"""

    try:
        # Call OpenAI API
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        analysis_text = response.choices[0].message.content
        analysis = json.loads(analysis_text)
        
        # Add metadata
        analysis["currency_pair"] = currency_pair
        analysis["timeframe"] = timeframe
        analysis["analysis_time"] = datetime.utcnow().isoformat()
        
        return analysis
    
    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}")
        # Fallback to a simple combination method
        return fallback_combine_analyses(
            currency_pair=currency_pair,
            timeframe=timeframe,
            technical_analysis=technical_analysis,
            fundamental_analysis=fundamental_analysis,
            sentiment_analysis=sentiment_analysis,
            economic_analysis=economic_analysis
        )

def fallback_combine_analyses(
    currency_pair: str,
    timeframe: str,
    technical_analysis: Dict[str, Any],
    fundamental_analysis: Dict[str, Any],
    sentiment_analysis: Dict[str, Any],
    economic_analysis: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Fallback method if AI combination fails
    Uses weighted averaging of different signals
    """
    # Extract directional bias from each analysis
    tech_direction = technical_analysis.get("direction", "NEUTRAL")
    fund_direction = fundamental_analysis.get("direction", "NEUTRAL")
    sent_direction = sentiment_analysis.get("direction", "NEUTRAL")
    econ_direction = economic_analysis.get("direction", "NEUTRAL")
    
    # Convert to numeric values
    direction_map = {"BUY": 1, "NEUTRAL": 0, "SELL": -1}
    tech_value = direction_map.get(tech_direction, 0)
    fund_value = direction_map.get(fund_direction, 0)
    sent_value = direction_map.get(sent_direction, 0)
    econ_value = direction_map.get(econ_direction, 0)
    
    # Weighted average (technical has highest weight)
    weights = {"technical": 0.4, "fundamental": 0.3, "sentiment": 0.15, "economic": 0.15}
    combined_value = (
        tech_value * weights["technical"] +
        fund_value * weights["fundamental"] +
        sent_value * weights["sentiment"] +
        econ_value * weights["economic"]
    )
    
    # Determine direction based on combined value
    if combined_value > 0.2:
        direction = "BUY"
    elif combined_value < -0.2:
        direction = "SELL"
    else:
        direction = "NEUTRAL"
    
    # Calculate confidence based on agreement between analyses
    confidence_factors = []
    if tech_direction == direction:
        confidence_factors.append(technical_analysis.get("confidence_score", 0.5))
    if fund_direction == direction:
        confidence_factors.append(fundamental_analysis.get("confidence_score", 0.5))
    if sent_direction == direction:
        confidence_factors.append(sentiment_analysis.get("confidence_score", 0.5))
    if econ_direction == direction:
        confidence_factors.append(economic_analysis.get("confidence_score", 0.5))
    
    confidence_score = sum(confidence_factors) / len(confidence_factors) if confidence_factors else 0.5
    
    # Create summary and reasoning
    summary = f"{direction} signal for {currency_pair} on {timeframe} with {confidence_score:.2f} confidence"
    reasoning = f"Technical analysis indicates {tech_direction}, fundamental analysis indicates {fund_direction}, sentiment analysis indicates {sent_direction}, and economic calendar analysis indicates {econ_direction}."
    
    return {
        "currency_pair": currency_pair,
        "timeframe": timeframe,
        "direction": direction,
        "confidence_score": confidence_score,
        "summary": summary,
        "technical_factors": technical_analysis.get("factors", []),
        "fundamental_factors": fundamental_analysis.get("factors", []),
        "sentiment_factors": sentiment_analysis.get("factors", []),
        "economic_factors": economic_analysis.get("factors", []),
        "reasoning": reasoning,
        "analysis_time": datetime.utcnow().isoformat()
    }

async def generate_trading_signal(
    currency_pair: str,
    timeframe: str,
    combined_analysis: Dict[str, Any],
    current_price: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate a complete trading signal with entry, exit, and risk parameters
    """
    direction = combined_analysis["direction"]
    
    # Only generate signals for BUY or SELL directions with sufficient confidence
    if direction == "NEUTRAL" or combined_analysis["confidence_score"] < 0.65:
        return {
            "generate": False,
            "reason": f"Direction is {direction} or confidence too low ({combined_analysis['confidence_score']:.2f})"
        }
    
    # Current market price
    if direction == "BUY":
        entry_price = current_price["ask"]
    else:  # SELL
        entry_price = current_price["bid"]
    
    # Calculate stop loss and take profit based on ATR or recent swing points
    # This is a simplified version - would be more sophisticated in production
    if "atr" in combined_analysis.get("technical_factors", []):
        atr = next((f for f in combined_analysis["technical_factors"] if f.get("name") == "atr"), {}).get("value", 0)
        if not atr:
            atr = entry_price * 0.005  # Default to 0.5% if no ATR available
    else:
        atr = entry_price * 0.005  # Default to 0.5%
    
    # Set stop loss and take profit
    if direction == "BUY":
        stop_loss = entry_price - (atr * 1.5)
        take_profit = entry_price + (atr * 2.5)
    else:  # SELL
        stop_loss = entry_price + (atr * 1.5)
        take_profit = entry_price - (atr * 2.5)
    
    # Calculate risk-reward ratio
    risk = abs(entry_price - stop_loss)
    reward = abs(take_profit - entry_price)
    risk_reward_ratio = reward / risk if risk > 0 else 0
    
    # Determine expected duration based on timeframe
    timeframe_duration_map = {
        "M15": "2-8 hours",
        "H1": "1-2 days",
        "H4": "2-5 days",
        "D1": "1-3 weeks",
        "W1": "3-8 weeks"
    }
    expected_duration = timeframe_duration_map.get(timeframe, "Unknown")
    
    # Create signal with all required parameters
    signal = {
        "generate": True,
        "currency_pair": currency_pair,
        "direction": direction,
        "timeframe": timeframe,
        "entry_price": entry_price,
        "stop_loss": stop_loss,
        "take_profit": take_profit,
        "risk_reward_ratio": risk_reward_ratio,
        "confidence_score": combined_analysis["confidence_score"],
        "expected_duration": expected_duration,
        "analysis_summary": combined_analysis["summary"],
        "technical_factors": combined_analysis["technical_factors"],
        "fundamental_factors": combined_analysis["fundamental_factors"],
        "economic_events": combined_analysis["economic_factors"],
        "ai_reasoning": combined_analysis["reasoning"]
    }
    
    # Log the generated signal for learning and optimization
    logger.info(f"Generated {direction} signal for {currency_pair} with {signal['confidence_score']:.2f} confidence")
    
    return signal

async def reflect_on_signal_outcome(
    signal: Dict[str, Any],
    actual_outcome: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Reflect on signal outcomes to improve future predictions
    This is part of ForexJoey's autonomous learning capability
    """
    # Calculate performance metrics
    was_successful = False
    exit_price = actual_outcome.get("exit_price", 0)
    
    if signal["direction"] == "BUY":
        profit_loss_pips = (exit_price - signal["entry_price"]) * 10000  # For 4-digit pairs
        was_successful = exit_price >= signal["entry_price"]
    else:  # SELL
        profit_loss_pips = (signal["entry_price"] - exit_price) * 10000  # For 4-digit pairs
        was_successful = exit_price <= signal["entry_price"]
    
    # Create reflection with LLM
    system_prompt = """You are ForexJoey, an AI-first forex trading system that constantly learns from trade outcomes.
Your task is to analyze a completed trade signal and its actual outcome, then reflect on what went well, what went wrong, and how to improve future predictions.
Be specific, honest, and analytical. Focus on identifying patterns that can improve your decision-making process."""

    user_message = f"""
ORIGINAL SIGNAL:
{json.dumps(signal, indent=2)}

ACTUAL OUTCOME:
{json.dumps(actual_outcome, indent=2)}

PERFORMANCE SUMMARY:
- Direction: {signal['direction']}
- Was Successful: {was_successful}
- Profit/Loss (pips): {profit_loss_pips}
- Entry Price: {signal['entry_price']}
- Exit Price: {exit_price}
- Confidence Score: {signal['confidence_score']}

Reflect on this trade outcome, analyzing what went well, what went wrong, and how to improve future predictions.
Your response should be in JSON format with the following structure:
{
  "analysis": "Detailed analysis of the trade outcome",
  "lessons_learned": ["List of key lessons learned"],
  "improvement_suggestions": ["List of suggestions to improve future predictions"],
  "confidence_adjustment": 0.0 to 1.0 (how much to adjust confidence for similar setups in the future)
}
"""

    try:
        # Call OpenAI API
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        reflection_text = response.choices[0].message.content
        reflection = json.loads(reflection_text)
        
        # Add metadata
        reflection["signal_id"] = signal.get("id", "unknown")
        reflection["currency_pair"] = signal["currency_pair"]
        reflection["timeframe"] = signal["timeframe"]
        reflection["was_successful"] = was_successful
        reflection["profit_loss_pips"] = profit_loss_pips
        reflection["reflection_time"] = datetime.utcnow().isoformat()
        
        # Log the reflection for future learning
        logger.info(f"Reflection completed for {signal['currency_pair']} signal. Lessons learned: {len(reflection['lessons_learned'])}")
        
        return reflection
    
    except Exception as e:
        logger.error(f"Error in reflection: {str(e)}")
        # Simple fallback reflection
        return {
            "signal_id": signal.get("id", "unknown"),
            "currency_pair": signal["currency_pair"],
            "timeframe": signal["timeframe"],
            "was_successful": was_successful,
            "profit_loss_pips": profit_loss_pips,
            "analysis": "Automatic fallback reflection due to AI processing error",
            "lessons_learned": ["Error in reflection process"],
            "improvement_suggestions": ["Review signal generation process"],
            "confidence_adjustment": 0.0,
            "reflection_time": datetime.utcnow().isoformat()
        }
