/**
 * Intelligence Sources Utility
 * 
 * This utility combines data from multiple intelligence sources to provide
 * comprehensive trading signals backed by at least 2 independent sources,
 * following ForexJoey's AI-first approach.
 */

import apiService from '../services/api';
import { SentimentData, EconomicEvent, Factor, Signal } from '../types/signal';

interface TechnicalData {
  signal: string;
  strength: number;
  key_levels: {
    support: number[];
    resistance: number[];
  };
  indicators: Record<string, any>;
}

interface EconomicData {
  events: EconomicEvent[];
  volatility_forecast: string;
  bias: string;
}

interface CombinedAnalysis {
  currency_pair: string;
  timeframe: string;
  timestamp: string;
  technical: {
    signal: string;
    strength: number;
    key_levels: {
      support: number[];
      resistance: number[];
    };
  };
  sentiment: {
    overall: number;
    label: string;
    analysis: string;
    news_count: number;
  };
  economic: {
    upcoming_events: EconomicEvent[];
    volatility_forecast: string;
    bias: string;
  };
  combined_signal: {
    direction: string;
    strength: number;
  };
  confidence_score: number;
  intelligence_sources: string[];
  reasoning: string;
}

/**
 * Get combined analysis from multiple intelligence sources
 * @param currencyPair Currency pair to analyze
 * @param timeframe Timeframe for analysis
 * @returns Combined analysis from multiple intelligence sources
 */
export async function getCombinedAnalysis(
  currencyPair: string,
  timeframe: string
): Promise<CombinedAnalysis> {
  try {
    // Fetch data from multiple intelligence sources in parallel
    const [technicalData, sentimentData, economicData] = await Promise.all([
      apiService.market.getTechnicalAnalysis(currencyPair, timeframe),
      apiService.sentiment.getSentimentForPair(currencyPair, timeframe),
      apiService.market.getEconomicCalendar(
        // Get events for the next 7 days
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        [currencyPair.split('/')[0], currencyPair.split('/')[1]]
      )
    ]);

    // Calculate combined signal
    const combinedSignal = calculateCombinedSignal(
      technicalData.signal,
      sentimentData.direction,
      economicData.bias
    );

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(
      technicalData.strength,
      Math.abs(sentimentData.sentiment_score),
      economicData.volatility_forecast
    );

    // Determine which intelligence sources were used
    const intelligenceSources = determineIntelligenceSources(
      technicalData,
      sentimentData,
      economicData
    );

    // Generate reasoning for the combined signal
    const reasoning = generateReasoning(
      currencyPair,
      timeframe,
      technicalData,
      sentimentData,
      economicData,
      combinedSignal
    );

    return {
      currency_pair: currencyPair,
      timeframe,
      timestamp: new Date().toISOString(),
      technical: {
        signal: technicalData.signal,
        strength: technicalData.strength,
        key_levels: technicalData.key_levels
      },
      sentiment: {
        overall: sentimentData.sentiment_score,
        label: sentimentData.direction,
        analysis: sentimentData.analysis || sentimentData.explanation,
        news_count: sentimentData.news_count
      },
      economic: {
        upcoming_events: economicData.events.slice(0, 5),
        volatility_forecast: economicData.volatility_forecast,
        bias: economicData.bias
      },
      combined_signal: combinedSignal,
      confidence_score: confidenceScore,
      intelligence_sources: intelligenceSources,
      reasoning
    };
  } catch (error) {
    console.error('Error getting combined analysis:', error);
    throw error;
  }
}

/**
 * Calculate a combined trading signal based on multiple intelligence sources
 * @param technicalSignal Technical analysis signal
 * @param sentimentLabel Sentiment analysis label
 * @param economicBias Economic calendar bias
 * @returns Combined signal with direction and strength
 */
function calculateCombinedSignal(
  technicalSignal: string,
  sentimentLabel: string,
  economicBias: string
): { direction: string, strength: number } {
  // Map signals to numeric values
  const signalMap: Record<string, number> = {
    'strong_buy': 2,
    'buy': 1,
    'neutral': 0,
    'sell': -1,
    'strong_sell': -2,
    'very_bullish': 2,
    'bullish': 1,
    'neutral': 0,
    'bearish': -1,
    'very_bearish': -2,
    'strongly_bullish': 2,
    'mildly_bullish': 1,
    'mildly_bearish': -1,
    'strongly_bearish': -2
  };
  
  // Calculate weighted average
  const technicalValue = signalMap[technicalSignal] || 0;
  const sentimentValue = signalMap[sentimentLabel] || 0;
  const economicValue = signalMap[economicBias] || 0;
  
  // Weight technical analysis higher
  const combinedValue = (technicalValue * 0.5) + (sentimentValue * 0.3) + (economicValue * 0.2);
  
  // Map back to signal
  let direction: string;
  const strength = Math.abs(combinedValue);
  
  if (combinedValue > 1.2) direction = 'strong_buy';
  else if (combinedValue > 0.3) direction = 'buy';
  else if (combinedValue < -1.2) direction = 'strong_sell';
  else if (combinedValue < -0.3) direction = 'sell';
  else direction = 'neutral';
  
  return { direction, strength: Math.min(1, strength / 2) };
}

/**
 * Calculate confidence score based on multiple factors
 * @param technicalStrength Technical analysis strength
 * @param sentimentStrength Sentiment analysis strength
 * @param volatilityForecast Economic volatility forecast
 * @returns Confidence score between 0 and 1
 */
function calculateConfidenceScore(
  technicalStrength: number,
  sentimentStrength: number,
  volatilityForecast: string
): number {
  // Convert volatility forecast to numeric value
  const volatilityMap: Record<string, number> = {
    'very_high': 0.6, // High volatility reduces confidence
    'high': 0.7,
    'moderate': 0.9,
    'low': 1.0,
    'very_low': 1.0
  };
  
  const volatilityFactor = volatilityMap[volatilityForecast] || 0.8;
  
  // Calculate base confidence from technical and sentiment strength
  const baseConfidence = (technicalStrength * 0.7) + (sentimentStrength * 0.3);
  
  // Apply volatility factor
  return Math.min(1, Math.max(0, baseConfidence * volatilityFactor));
}

/**
 * Determine which intelligence sources were used for the analysis
 * @param technicalData Technical analysis data
 * @param sentimentData Sentiment analysis data
 * @param economicData Economic calendar data
 * @returns Array of intelligence sources used
 */
function determineIntelligenceSources(
  technicalData: TechnicalData,
  sentimentData: SentimentData,
  economicData: EconomicData
): string[] {
  const sources: string[] = [];
  
  // Check if technical data is valid and non-neutral
  if (technicalData && technicalData.signal !== 'neutral' && technicalData.strength > 0.3) {
    sources.push('Technical');
  }
  
  // Check if sentiment data is valid and non-neutral
  if (sentimentData && sentimentData.direction !== 'neutral' && Math.abs(sentimentData.sentiment_score) > 0.2) {
    sources.push('Sentiment');
  }
  
  // Check if economic data is valid and non-neutral
  if (economicData && economicData.bias !== 'neutral' && economicData.events && economicData.events.length > 0) {
    sources.push('Economic');
  }
  
  return sources;
}

/**
 * Generate reasoning for the combined signal
 * @param currencyPair Currency pair
 * @param timeframe Timeframe
 * @param technicalData Technical analysis data
 * @param sentimentData Sentiment analysis data
 * @param economicData Economic calendar data
 * @param combinedSignal Combined signal
 * @returns Reasoning for the combined signal
 */
function generateReasoning(
  currencyPair: string,
  timeframe: string,
  technicalData: TechnicalData,
  sentimentData: SentimentData,
  economicData: EconomicData,
  combinedSignal: { direction: string, strength: number }
): string {
  const reasons: string[] = [];
  
  // Add technical analysis reasoning
  if (technicalData.signal !== 'neutral') {
    reasons.push(`Technical analysis shows a ${technicalData.signal.replace('_', ' ')} signal with ${Math.round(technicalData.strength * 100)}% strength.`);
  }
  
  // Add sentiment analysis reasoning
  if (sentimentData.direction !== 'neutral') {
    reasons.push(`Market sentiment is ${sentimentData.direction} based on analysis of ${sentimentData.news_count} news sources.`);
  }
  
  // Add economic calendar reasoning
  if (economicData.bias !== 'neutral') {
    const eventCount = economicData.events.length;
    reasons.push(`Economic calendar shows a ${economicData.bias} bias with ${eventCount} upcoming events and ${economicData.volatility_forecast} expected volatility.`);
  }
  
  // Combine reasons
  let reasoning = `${combinedSignal.direction.replace('_', ' ').toUpperCase()} signal on ${currencyPair} ${timeframe} timeframe. `;
  
  if (reasons.length > 0) {
    reasoning += reasons.join(' ');
  } else {
    reasoning += 'Insufficient data to provide detailed reasoning.';
  }
  
  return reasoning;
}

/**
 * Check if a signal meets ForexJoey's multi-source requirement
 * @param analysis Combined analysis
 * @returns Whether the signal meets the multi-source requirement
 */
export function meetsMultiSourceRequirement(analysis: CombinedAnalysis): boolean {
  // ForexJoey requires at least 2 intelligence sources
  return analysis.intelligence_sources.length >= 2;
}
