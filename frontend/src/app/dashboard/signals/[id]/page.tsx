"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiArrowLeftLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiInformationLine,
  RiBarChartGroupedLine,
  RiNewspaperLine,
  RiCalendarEventLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiPieChartLine,
  RiLineChartLine,
  RiExchangeDollarLine,
  RiRobot2Line,
  RiArrowRightUpLine,
  RiArrowRightDownLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

import SentimentPanel from "@/components/sentiment/SentimentPanel";
import RiskAssessment from "@/components/risk-management/RiskAssessment";
import apiService from "@/services/api";
import { Signal, SentimentData } from "@/types/signal";

// Placeholder chart component - in production would be a real chart library
const PlaceholderChart: React.FC<{ direction: string }> = ({ direction }) => (
  <div className={`h-[300px] w-full rounded-md ${direction === "BUY" ? "bg-positive/10" : "bg-negative/10"} flex items-center justify-center`}>
    <div className="text-sm text-foreground/50">Price Chart with Entry/Exit Points</div>
  </div>
);

export default function SignalDetailPage() {
  const params = useParams();
  const signalId = params.id as string;
  const [activeTab, setActiveTab] = useState("analysis");
  const [sentimentExpanded, setSentimentExpanded] = useState(true);
  const [technicalExpanded, setTechnicalExpanded] = useState(true);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // This would be fetched from API in production
  const signal: Signal = {
    id: "sig123",
    currency_pair: "EUR/USD",
    direction: "BUY",
    entry_price: 1.0876,
    stop_loss: 1.0845,
    take_profit: 1.0945,
    risk_reward_ratio: 2.2,
    confidence_score: 0.87,
    status: "ACTIVE",
    created_at: "2025-05-30T10:23:45Z",
    timeframe: "H4",
    expected_duration: "2-3 days",
    analysis_summary: "Bullish momentum with supportive economic data and positive sentiment",
    ai_reasoning: "The technical setup shows a clear bullish trend with price breaking above the 200 EMA and MACD showing positive momentum. Fundamentally, while the strong NFP report supports USD, the ECB's hawkish stance provides stronger support for EUR in this pair. The combination suggests a high-probability bullish move with potential for 60-80 pips upside.",
    technical_factors: [
      {
        factor: "MACD",
        value: "Bullish Crossover",
        impact: 0.75,
        interpretation: "Strong bullish momentum"
      },
      {
        factor: "RSI",
        value: "58.5",
        impact: 0.6,
        interpretation: "Bullish momentum without being overbought"
      },
      {
        factor: "Moving Averages",
        value: "Price above 50 and 200 EMA",
        impact: 0.8,
        interpretation: "Strong uptrend confirmation"
      }
    ],
    fundamental_factors: [
      {
        factor: "ECB Stance",
        value: "Hawkish",
        impact: 0.7,
        interpretation: "ECB's reluctance to cut rates supports EUR"
      },
      {
        factor: "Economic Data",
        value: "Eurozone PMI improved",
        impact: 0.5,
        interpretation: "Shows economic resilience in Eurozone"
      }
    ],
    economic_events: [
      {
        event: "ECB Meeting Minutes",
        date: "2025-05-28T13:00:00Z",
        impact: 0.65,
        interpretation: "Revealed continued concern about inflation"
      }
    ],
    sentiment_factors: [
      {
        factor: "News Sentiment",
        value: "Positive",
        impact: 0.6,
        interpretation: "Media coverage tilts positive for EUR"
      }
    ],
    intelligence_sources: [
      "Technical Analysis",
      "Fundamental Analysis",
      "Economic Calendar",
      "Sentiment Analysis"
    ],
    current_price: 1.0879,
    profit_loss_pips: 3,
    profit_loss_percentage: 0.03
  };
  
  // Mock sentiment data for display purposes
  const mockSentimentData: SentimentData = {
    sentiment_score: 0.65,
    confidence: 0.78,
    direction: "bullish",
    strength: "moderate",
    news_count: 12,
    top_articles: [
      {
        title: "ECB Officials Signal Higher-For-Longer Rates Despite Market Pressure",
        source: "Financial Times",
        sentiment_score: 0.72,
        explanation: "The article suggests the ECB will maintain higher rates than markets expect, supporting EUR against USD."
      },
      {
        title: "Eurozone Economy Shows Resilience Despite Manufacturing Slump",
        source: "Bloomberg",
        sentiment_score: 0.58,
        explanation: "Data indicates the Eurozone economy is performing better than expected, providing support for the Euro."
      },
      {
        title: "Federal Reserve Minutes Hint at Dovish Shift in Coming Months",
        source: "Wall Street Journal",
        sentiment_score: 0.63,
        explanation: "Fed members discussing potential rate cuts later this year could weaken USD against EUR."
      }
    ],
    explanation: "Recent news sentiment for EUR/USD is predominantly bullish with high confidence. ECB's hawkish stance and signals of maintaining higher rates for longer are the primary drivers. Meanwhile, hints of a potential dovish shift from the Federal Reserve are putting pressure on the USD. Economic data from the Eurozone showing resilience is providing additional support for the Euro."
  };
  
  // Fetch sentiment data when component loads
  useEffect(() => {
    async function fetchSentimentData() {
      try {
        setIsLoading(true);
        // In a production environment, we would use:
        // const data = await apiService.sentiment.getSentimentForPair(signal.currency_pair);
        // For now, we'll use our mock data
        setTimeout(() => {
          setSentimentData(mockSentimentData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        setError('Failed to load sentiment analysis');
        setIsLoading(false);
      }
    }
    
    fetchSentimentData();
  }, [signal.currency_pair]);
  
  // Calculate pip difference and direction
  const pips = signal.profit_loss_pips;
  const pipDirection = pips >= 0 ? "positive" : "negative";
  
  // Format percentage for display
  const percentage = (signal.profit_loss_percentage * 100).toFixed(2);
  
  // Calculate trade risk-reward
  const riskPips = Math.abs(signal.entry_price - signal.stop_loss) * 10000;
  const rewardPips = Math.abs(signal.take_profit - signal.entry_price) * 10000;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard/signals" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RiArrowLeftLine className="mr-1" />
          Back to Signals
        </Link>
      </div>
      
      <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex items-center justify-between bg-card rounded-lg p-6 shadow-md">
            <div>
              <h1 className="text-2xl font-bold">{signal.currency_pair}</h1>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium mr-2 ${signal.direction === "BUY" ? "text-positive" : "text-negative"}`}>
                  {signal.direction}
                </span>
                <span className="text-sm text-muted-foreground">
                  {signal.timeframe} Timeframe
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Signal Confidence</div>
              <div className="flex items-center justify-end mt-1">
                <span className="text-lg font-bold">{Math.round(signal.confidence_score * 100)}%</span>
                <div className="ml-2 h-2 w-16 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${signal.confidence_score * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md">
            <PlaceholderChart direction={signal.direction} />
          </div>
          
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                  activeTab === "analysis" ? "border-b-2 border-primary" : ""
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setActiveTab("technical")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                  activeTab === "technical" ? "border-b-2 border-primary" : ""
                }`}
              >
                Technical
              </button>
              <button
                onClick={() => setActiveTab("fundamental")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                  activeTab === "fundamental" ? "border-b-2 border-primary" : ""
                }`}
              >
                Fundamental
              </button>
              <button
                onClick={() => setActiveTab("economic")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                  activeTab === "economic" ? "border-b-2 border-primary" : ""
                }`}
              >
                Economic
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === "analysis" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-medium mb-4">Analysis Summary</h3>
                    <p className="text-muted-foreground">{signal.analysis_summary}</p>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">AI Reasoning</h4>
                      <p className="text-sm text-muted-foreground">{signal.ai_reasoning}</p>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="bg-card rounded-lg p-6 shadow-md flex items-center justify-center h-32">
                      <div className="text-primary">Loading sentiment analysis...</div>
                    </div>
                  ) : error ? (
                    <div className="bg-card rounded-lg p-6 shadow-md">
                      <div className="text-negative">{error}</div>
                    </div>
                  ) : sentimentData && (
                    <SentimentPanel 
                      data={sentimentData}
                      isExpanded={sentimentExpanded}
                      onToggle={() => setSentimentExpanded(!sentimentExpanded)}
                    />
                  )}
                  
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Technical Analysis</h3>
                      <button
                        onClick={() => setActiveTab("technical")}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {signal.technical_factors.map((factor, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{factor.factor}</div>
                            <div className="text-sm text-muted-foreground">{factor.value}</div>
                          </div>
                          <div>
                            <div className="text-right">
                              <span className="inline-block w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <span 
                                  className="block h-full bg-primary" 
                                  style={{ width: `${factor.impact * 100}%` }}
                                />
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                              Impact: {(factor.impact * 10).toFixed(1)}/10
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Fundamental Factors</h3>
                      <button
                        onClick={() => setActiveTab("fundamental")}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {signal.fundamental_factors.map((factor, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{factor.factor}</div>
                            <div className="text-sm text-muted-foreground">{factor.value}</div>
                          </div>
                          <div>
                            <div className="text-right">
                              <span className="inline-block w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <span 
                                  className="block h-full bg-primary" 
                                  style={{ width: `${factor.impact * 100}%` }}
                                />
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                              Impact: {(factor.impact * 10).toFixed(1)}/10
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "technical" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Technical Analysis</h3>
                  
                  <div className="space-y-6">
                    {signal.technical_factors.map((factor, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{factor.factor}</h4>
                          <div className="text-right">
                            <span className="inline-block w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <span 
                                className="block h-full bg-primary" 
                                style={{ width: `${factor.impact * 100}%` }}
                              />
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Value:</span>
                          <span className="text-sm font-medium">{factor.value}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Impact:</span>
                          <span className="text-sm font-medium">{(factor.impact * 10).toFixed(1)}/10</span>
                        </div>
                        
                        <p className="text-sm mt-2">{factor.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "fundamental" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Fundamental Analysis</h3>
                  
                  <div className="space-y-6">
                    {signal.fundamental_factors.map((factor, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{factor.factor}</h4>
                          <div className="text-right">
                            <span className="inline-block w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <span 
                                className="block h-full bg-primary" 
                                style={{ width: `${factor.impact * 100}%` }}
                              />
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Value:</span>
                          <span className="text-sm font-medium">{factor.value}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Impact:</span>
                          <span className="text-sm font-medium">{(factor.impact * 10).toFixed(1)}/10</span>
                        </div>
                        
                        <p className="text-sm mt-2">{factor.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "economic" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Economic Calendar Events</h3>
                  
                  <div className="space-y-4">
                    {signal.economic_events.map((event, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{event.event}</h4>
                          <div className="text-right">
                            <span className="inline-block w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <span 
                                className="block h-full bg-primary" 
                                style={{ width: `${event.impact * 100}%` }}
                              />
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm font-medium">
                            {new Date(event.date).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Impact:</span>
                          <span className="text-sm font-medium">{(event.impact * 10).toFixed(1)}/10</span>
                        </div>
                        
                        <p className="text-sm mt-2">{event.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium mb-4">Signal Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Direction</span>
                <span className={`font-medium ${signal.direction === "BUY" ? "text-positive" : "text-negative"}`}>
                  {signal.direction}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Price</span>
                <span className="font-medium">{signal.entry_price.toFixed(4)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stop Loss</span>
                <span className="font-medium text-negative">{signal.stop_loss.toFixed(4)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Take Profit</span>
                <span className="font-medium text-positive">{signal.take_profit.toFixed(4)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk-Reward Ratio</span>
                <span className="font-medium">1:{signal.risk_reward_ratio.toFixed(1)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Duration</span>
                <span className="font-medium">{signal.expected_duration}</span>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="font-medium">{signal.current_price.toFixed(4)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit/Loss</span>
                  <div className="text-right">
                    <div className={`font-medium ${pipDirection === "positive" ? "text-positive" : "text-negative"}`}>
                      {pips > 0 ? "+" : ""}{pips} pips
                    </div>
                    <div className={`text-xs ${pipDirection === "positive" ? "text-positive" : "text-negative"}`}>
                      {percentage > 0 ? "+" : ""}{percentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium mb-4">Risk Assessment</h3>
            
            <RiskAssessment
              currencyPair={signal.currency_pair}
              direction={signal.direction as 'BUY' | 'SELL'}
              entryPrice={signal.entry_price}
              stopLoss={signal.stop_loss}
              takeProfit={signal.take_profit}
              timeframe={signal.timeframe}
              onAssessmentComplete={(assessment) => {
                console.log('Risk assessment completed:', assessment);
              }}
            />
            
            <div className="mt-6 pt-4 border-t border-border space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Risk (pips)</span>
                  <span className="text-sm font-medium">{riskPips.toFixed(1)}</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-negative" 
                    style={{ width: `${(riskPips / (riskPips + rewardPips)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Reward (pips)</span>
                  <span className="text-sm font-medium">{rewardPips.toFixed(1)}</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-positive" 
                    style={{ width: `${(rewardPips / (riskPips + rewardPips)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Intelligence Sources</span>
                  <span className="text-sm font-medium">{signal.intelligence_sources.length}</span>
                </div>
                
                <div className="space-y-2">
                  {signal.intelligence_sources.map((source, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1 h-1 rounded-full bg-primary mr-2" />
                      <span className="text-sm">{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-primary text-primary-foreground rounded-md py-2 font-medium hover:bg-primary/90 transition-colors">
                Execute Trade
              </button>
              
              <button className="w-full bg-secondary text-secondary-foreground rounded-md py-2 font-medium hover:bg-secondary/90 transition-colors">
                Save Signal
              </button>
              
              <button className="w-full bg-transparent border border-border text-foreground rounded-md py-2 font-medium hover:bg-secondary/20 transition-colors">
                Create Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
