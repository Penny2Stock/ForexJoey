import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface SentimentRequest {
  currency_pair: string;
  timeframe?: string;
  sources?: string[];
}

export interface NewsItem {
  id?: string;
  title: string;
  description: string;
  source: string;
  url: string;
  published_at: string;
  currencies: string[];
  sentiment_score?: number;
  sentiment_label?: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  relevance_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SentimentResponse {
  currency_pair: string;
  timeframe?: string;
  base_currency: string;
  quote_currency: string;
  overall_sentiment: number; // -1 to 1 scale
  sentiment_label: 'very_bearish' | 'bearish' | 'neutral' | 'bullish' | 'very_bullish';
  news_items: NewsItem[];
  social_sentiment?: {
    reddit?: number;
    twitter?: number;
    stocktwits?: number;
  };
  analysis: string;
  timestamp: string;
}

export class SentimentAnalyzer {
  private supabase;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Get sentiment analysis for a currency pair
   * @param currencyPair The currency pair in format BASE/QUOTE (e.g., EUR/USD)
   * @param timeframe Optional timeframe for the analysis
   * @param forceRefresh Force refresh the sentiment data even if cached
   * @returns Sentiment analysis response
   */
  async getSentiment(currencyPair: string, timeframe?: string, forceRefresh = false): Promise<SentimentResponse> {
    // Validate currency pair
    if (!currencyPair.includes('/')) {
      throw new Error('Invalid currency pair format. Expected format: BASE/QUOTE (e.g., EUR/USD)');
    }
    
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedSentiment = await this.getCachedSentiment(currencyPair, timeframe);
      if (cachedSentiment) {
        return cachedSentiment;
      }
    }
    
    // Call the sentiment-analysis Edge Function
    const response = await fetch(`${this.supabase.supabaseUrl}/functions/v1/sentiment-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.supabase.supabaseKey}`
      },
      body: JSON.stringify({
        currency_pair: currencyPair,
        timeframe
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sentiment data: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Get cached sentiment data if available and fresh
   * @param currencyPair The currency pair
   * @param timeframe Optional timeframe
   * @returns Cached sentiment data or null if not available/fresh
   */
  private async getCachedSentiment(currencyPair: string, timeframe?: string): Promise<SentimentResponse | null> {
    const cacheKey = `sentiment:${currencyPair}:${timeframe || 'default'}`;
    
    const { data, error } = await this.supabase
      .from('sentiment_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Check if data is fresh (less than 1 hour old)
    const dataAge = Date.now() - new Date(data.updated_at).getTime();
    const oneHourInMs = 60 * 60 * 1000;
    
    if (dataAge < oneHourInMs) {
      return data.data as SentimentResponse;
    }
    
    return null;
  }
  
  /**
   * Get recent news items for a currency or currency pair
   * @param currency Currency code or currency pair
   * @param limit Maximum number of news items to return
   * @returns Array of news items
   */
  async getRecentNews(currency: string, limit = 10): Promise<NewsItem[]> {
    // Handle both currency codes and currency pairs
    const currencies = currency.includes('/') 
      ? currency.split('/') 
      : [currency];
    
    const { data, error } = await this.supabase
      .from('news_items')
      .select('*')
      .or(currencies.map(c => `currencies.cs.{${c}}`).join(','))
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch news items: ${error.message}`);
    }
    
    return data || [];
  }
  
  /**
   * Get sentiment trend for a currency pair over time
   * @param currencyPair The currency pair
   * @param days Number of days to look back
   * @returns Array of sentiment data points
   */
  async getSentimentTrend(currencyPair: string, days = 7): Promise<any[]> {
    // This would typically query a time series of sentiment data
    // For now, we'll return a simulated trend
    const trend = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate a somewhat realistic trend with some randomness
      // but maintaining some continuity between days
      const baseValue = Math.sin(i / (days / Math.PI)) * 0.5;
      const randomFactor = Math.random() * 0.4 - 0.2;
      const sentiment = Math.max(-1, Math.min(1, baseValue + randomFactor));
      
      trend.push({
        date: date.toISOString().split('T')[0],
        sentiment: sentiment,
        volume: Math.floor(Math.random() * 100) + 50
      });
    }
    
    return trend;
  }
  
  /**
   * Combine sentiment analysis with technical and economic data
   * @param currencyPair The currency pair
   * @param technicalData Technical analysis data
   * @param economicData Economic calendar data
   * @returns Combined analysis
   */
  async getCombinedAnalysis(currencyPair: string, technicalData: any, economicData: any): Promise<any> {
    // Get sentiment data
    const sentimentData = await this.getSentiment(currencyPair);
    
    // Combine the different intelligence sources
    return {
      currency_pair: currencyPair,
      timestamp: new Date().toISOString(),
      technical: {
        signal: technicalData.signal,
        strength: technicalData.strength,
        key_levels: technicalData.key_levels
      },
      sentiment: {
        overall: sentimentData.overall_sentiment,
        label: sentimentData.sentiment_label,
        analysis: sentimentData.analysis
      },
      economic: {
        upcoming_events: economicData.upcoming_events,
        volatility_forecast: economicData.volatility_forecast,
        bias: economicData.bias
      },
      combined_signal: this.calculateCombinedSignal(
        technicalData.signal,
        sentimentData.sentiment_label,
        economicData.bias
      ),
      confidence_score: this.calculateConfidenceScore(
        technicalData.strength,
        Math.abs(sentimentData.overall_sentiment),
        economicData.volatility_forecast
      )
    };
  }
  
  /**
   * Calculate a combined trading signal based on multiple intelligence sources
   * @param technicalSignal Technical analysis signal
   * @param sentimentLabel Sentiment analysis label
   * @param economicBias Economic calendar bias
   * @returns Combined signal with direction and strength
   */
  private calculateCombinedSignal(
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
  private calculateConfidenceScore(
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
}
