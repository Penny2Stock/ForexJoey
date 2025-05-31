"""
AI Reflection System for ForexJoey

This module enables the AI agent to:
1. Reflect on trade outcomes
2. Learn from successes and failures
3. Continuously optimize prediction accuracy
4. Maintain memory of performance by currency pair and timeframe
"""

import logging
from typing import Dict, List, Any, Optional
import json
from datetime import datetime, timedelta
import asyncio

from openai import AsyncOpenAI
from app.core.config import settings
from app.db.supabase import Database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

class ReflectionEngine:
    """
    AI Reflection Engine for continuous learning from trade outcomes
    """
    
    @staticmethod
    async def reflect_on_signal_outcome(signal_id: str, outcome_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Reflect on a signal outcome to improve future predictions
        
        Args:
            signal_id: ID of the signal
            outcome_data: Outcome data including price_at_close, profit_loss_pips, etc.
            
        Returns:
            Reflection data with analysis and lessons learned
        """
        try:
            # Get signal data
            signal = await Database.get_signal_by_id(signal_id)
            
            if not signal:
                logger.error(f"Signal not found for reflection: {signal_id}")
                return {
                    "signal_id": signal_id,
                    "ai_reflection": "Unable to reflect - signal not found",
                    "factors_analysis": {},
                    "lessons_learned": [],
                    "accuracy_score": 0.0
                }
                
            # Analyze outcome
            outcome_type = outcome_data.get("outcome_type")
            price_at_close = outcome_data.get("price_at_close")
            profit_loss_pips = outcome_data.get("profit_loss_pips", 0)
            
            # Determine if the signal was accurate
            was_accurate = False
            if signal["direction"] == "BUY" and profit_loss_pips > 0:
                was_accurate = True
            elif signal["direction"] == "SELL" and profit_loss_pips < 0:
                was_accurate = True
                
            # Generate reflection using AI
            reflection = await ReflectionEngine._generate_ai_reflection(signal, outcome_data, was_accurate)
            
            # Prepare reflection data
            reflection_data = {
                "signal_id": signal_id,
                "outcome_type": outcome_type,
                "price_at_close": price_at_close,
                "profit_loss_pips": profit_loss_pips,
                "profit_loss_percentage": outcome_data.get("profit_loss_percentage", 0),
                "duration_hours": outcome_data.get("duration_hours", 0),
                "ai_reflection": reflection.get("reflection", "No reflection generated"),
                "factors_analysis": reflection.get("factors_analysis", {}),
                "lessons_learned": reflection.get("lessons_learned", []),
                "accuracy_score": 1.0 if was_accurate else 0.0,
                "created_at": datetime.now().isoformat()
            }
            
            # Save reflection data
            await Database.save_signal_outcome(reflection_data)
            
            # Update performance metrics for this currency pair and timeframe
            await ReflectionEngine._update_performance_metrics(
                signal["currency_pair"],
                signal["timeframe"],
                was_accurate,
                reflection.get("factors_analysis", {})
            )
            
            return reflection_data
        except Exception as e:
            logger.error(f"Error reflecting on signal outcome: {str(e)}")
            return {
                "signal_id": signal_id,
                "ai_reflection": f"Reflection error: {str(e)}",
                "factors_analysis": {},
                "lessons_learned": [],
                "accuracy_score": 0.0
            }
            
    @staticmethod
    async def _generate_ai_reflection(
        signal: Dict[str, Any],
        outcome_data: Dict[str, Any],
        was_accurate: bool
    ) -> Dict[str, Any]:
        """
        Generate AI reflection on signal outcome
        
        Args:
            signal: Signal data
            outcome_data: Outcome data
            was_accurate: Whether the signal was accurate
            
        Returns:
            Reflection data with analysis and lessons learned
        """
        try:
            # Create prompt for GPT-4
            prompt = f"""
            You are ForexJoey, an AI forex trading assistant analyzing the outcome of a trading signal to learn and improve future predictions.
            
            SIGNAL DETAILS:
            - Currency Pair: {signal["currency_pair"]}
            - Direction: {signal["direction"]}
            - Timeframe: {signal["timeframe"]}
            - Entry Price: {signal["entry_price"]}
            - Stop Loss: {signal["stop_loss"]}
            - Take Profit: {signal["take_profit"]}
            - Confidence Score: {signal["confidence_score"]}
            - AI Reasoning: {signal["ai_reasoning"]}
            
            INTELLIGENCE SOURCES USED:
            {json.dumps(signal["intelligence_sources"], indent=2)}
            
            TECHNICAL FACTORS:
            {json.dumps(signal["technical_factors"], indent=2)}
            
            FUNDAMENTAL FACTORS:
            {json.dumps(signal["fundamental_factors"], indent=2)}
            
            SENTIMENT FACTORS:
            {json.dumps(signal["sentiment_factors"], indent=2)}
            
            ECONOMIC EVENTS:
            {json.dumps(signal["economic_events"], indent=2)}
            
            OUTCOME:
            - Type: {outcome_data.get("outcome_type")}
            - Price at Close: {outcome_data.get("price_at_close")}
            - Profit/Loss (pips): {outcome_data.get("profit_loss_pips")}
            - Accurate Prediction: {"Yes" if was_accurate else "No"}
            
            Based on the above information, please provide:
            1. A detailed reflection on why the prediction was {"accurate" if was_accurate else "inaccurate"}
            2. Analysis of which factors were most influential (technical, fundamental, sentiment, economic)
            3. What could be improved or adjusted for future predictions
            4. Specific lessons learned from this outcome
            
            Return your response in the following JSON format:
            {
                "reflection": "Detailed reflection on the signal outcome",
                "factors_analysis": {
                    "technical": {
                        "impact": float, // 0.0 to 1.0
                        "accuracy": float, // 0.0 to 1.0
                        "notes": "Analysis of technical factors"
                    },
                    "fundamental": {
                        "impact": float,
                        "accuracy": float,
                        "notes": "Analysis of fundamental factors"
                    },
                    "sentiment": {
                        "impact": float,
                        "accuracy": float,
                        "notes": "Analysis of sentiment factors"
                    },
                    "economic": {
                        "impact": float,
                        "accuracy": float,
                        "notes": "Analysis of economic events"
                    }
                },
                "lessons_learned": [
                    "Lesson 1",
                    "Lesson 2",
                    "Lesson 3"
                ]
            }
            """
            
            # Generate reflection using GPT-4
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are ForexJoey, an AI forex trading assistant focused on continuous learning and improvement."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            # Parse reflection
            reflection = json.loads(response.choices[0].message.content)
            
            return reflection
        except Exception as e:
            logger.error(f"Error generating AI reflection: {str(e)}")
            return {
                "reflection": f"Error generating reflection: {str(e)}",
                "factors_analysis": {
                    "technical": {"impact": 0.0, "accuracy": 0.0, "notes": "Error in analysis"},
                    "fundamental": {"impact": 0.0, "accuracy": 0.0, "notes": "Error in analysis"},
                    "sentiment": {"impact": 0.0, "accuracy": 0.0, "notes": "Error in analysis"},
                    "economic": {"impact": 0.0, "accuracy": 0.0, "notes": "Error in analysis"}
                },
                "lessons_learned": ["Error generating lessons learned"]
            }
            
    @staticmethod
    async def _update_performance_metrics(
        currency_pair: str,
        timeframe: str,
        was_accurate: bool,
        factors_analysis: Dict[str, Any]
    ) -> None:
        """
        Update performance metrics for currency pair and timeframe
        
        Args:
            currency_pair: Currency pair
            timeframe: Timeframe
            was_accurate: Whether the signal was accurate
            factors_analysis: Analysis of factors
        """
        try:
            # Get existing performance metrics
            performance = await Database.get_performance_metrics(currency_pair, timeframe)
            
            if not performance:
                # Create new performance metrics
                performance = {
                    "currency_pair": currency_pair,
                    "timeframe": timeframe,
                    "total_signals": 0,
                    "accurate_signals": 0,
                    "accuracy_rate": 0.0,
                    "factor_weights": {
                        "technical": 0.25,
                        "fundamental": 0.25,
                        "sentiment": 0.25,
                        "economic": 0.25
                    },
                    "factor_accuracy": {
                        "technical": 0.0,
                        "fundamental": 0.0,
                        "sentiment": 0.0,
                        "economic": 0.0
                    },
                    "recent_signals": []
                }
                
            # Update metrics
            performance["total_signals"] += 1
            
            if was_accurate:
                performance["accurate_signals"] += 1
                
            performance["accuracy_rate"] = performance["accurate_signals"] / performance["total_signals"]
            
            # Update factor weights and accuracy based on analysis
            for factor, analysis in factors_analysis.items():
                # Update factor accuracy
                current_accuracy = performance["factor_accuracy"].get(factor, 0.0)
                new_accuracy = analysis.get("accuracy", 0.0)
                
                # Weighted average of current and new accuracy
                updated_accuracy = (current_accuracy * (performance["total_signals"] - 1) + new_accuracy) / performance["total_signals"]
                performance["factor_accuracy"][factor] = updated_accuracy
                
                # Update factor weights based on impact and accuracy
                impact = analysis.get("impact", 0.0)
                performance["factor_weights"][factor] = (performance["factor_weights"].get(factor, 0.25) * 0.8) + (impact * 0.2)
                
            # Normalize factor weights
            total_weight = sum(performance["factor_weights"].values())
            for factor in performance["factor_weights"]:
                performance["factor_weights"][factor] /= total_weight
                
            # Add signal to recent signals (keep last 10)
            performance["recent_signals"].append({
                "timestamp": datetime.now().isoformat(),
                "was_accurate": was_accurate
            })
            
            if len(performance["recent_signals"]) > 10:
                performance["recent_signals"] = performance["recent_signals"][-10:]
                
            # Save updated performance metrics
            await Database.save_performance_metrics(performance)
        except Exception as e:
            logger.error(f"Error updating performance metrics: {str(e)}")
            
    @staticmethod
    async def get_signal_history(signal_id: str) -> List[Dict[str, Any]]:
        """
        Get signal history including outcomes and reflections
        
        Args:
            signal_id: Signal ID
            
        Returns:
            Signal history
        """
        try:
            # Get signal
            signal = await Database.get_signal_by_id(signal_id)
            
            if not signal:
                return []
                
            # Get outcomes
            outcomes = await Database.get_signal_outcomes(signal_id)
            
            return outcomes
        except Exception as e:
            logger.error(f"Error getting signal history: {str(e)}")
            return []
            
    @staticmethod
    async def get_performance_metrics(currency_pair: str, timeframe: str) -> Dict[str, Any]:
        """
        Get performance metrics for currency pair and timeframe
        
        Args:
            currency_pair: Currency pair
            timeframe: Timeframe
            
        Returns:
            Performance metrics
        """
        try:
            # Get performance metrics
            performance = await Database.get_performance_metrics(currency_pair, timeframe)
            
            if not performance:
                # Return default performance metrics
                return {
                    "currency_pair": currency_pair,
                    "timeframe": timeframe,
                    "total_signals": 0,
                    "accurate_signals": 0,
                    "accuracy_rate": 0.0,
                    "factor_weights": {
                        "technical": 0.25,
                        "fundamental": 0.25,
                        "sentiment": 0.25,
                        "economic": 0.25
                    },
                    "factor_accuracy": {
                        "technical": 0.0,
                        "fundamental": 0.0,
                        "sentiment": 0.0,
                        "economic": 0.0
                    },
                    "recent_signals": []
                }
                
            return performance
        except Exception as e:
            logger.error(f"Error getting performance metrics: {str(e)}")
            return {
                "currency_pair": currency_pair,
                "timeframe": timeframe,
                "error": str(e)
            }
