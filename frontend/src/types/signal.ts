// Types for forex trading signals

export interface Factor {
  factor: string;
  value: string;
  impact: number;
  interpretation: string;
}

export interface EconomicEvent {
  event: string;
  date: string;
  impact: number;
  interpretation: string;
}

export interface Article {
  title: string;
  source: string;
  sentiment_score: number;
  explanation: string;
}

export interface SentimentData {
  sentiment_score: number;
  confidence: number;
  direction: string;
  strength: string;
  news_count: number;
  top_articles: Article[];
  explanation: string;
}

export interface Signal {
  id: string;
  currency_pair: string;
  direction: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  risk_reward_ratio: number;
  confidence_score: number;
  status: string;
  created_at: string;
  timeframe: string;
  expected_duration: string;
  analysis_summary: string;
  ai_reasoning: string;
  technical_factors: Factor[];
  fundamental_factors: Factor[];
  economic_events: EconomicEvent[];
  sentiment_factors: Factor[];
  intelligence_sources: string[];
  current_price: number;
  profit_loss_pips: number;
  profit_loss_percentage: number;
}
