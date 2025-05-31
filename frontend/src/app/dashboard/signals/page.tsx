"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  RiPulseLine, 
  RiArrowUpSLine, 
  RiArrowDownSLine,
  RiInformationLine,
  RiBarChartGroupedLine,
  RiNewspaperLine,
  RiCalendarEventLine,
  RiTimeLine,
  RiRobot2Line,
  RiFilter3Line,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiCloseLine
} from "react-icons/ri";

// Sample data - in production this would come from the backend API
const sampleSignals = [
  {
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
    technical_factors: [
      { name: "MACD", interpretation: "Bullish crossover" },
      { name: "RSI", interpretation: "58 (Neutral)" },
      { name: "MA", interpretation: "Price above 200 EMA" }
    ],
    fundamental_factors: [
      { name: "ECB Statement", interpretation: "Hawkish tone (Bullish EUR)" },
      { name: "Market Sentiment", interpretation: "65% Bullish" }
    ],
    economic_events: [
      { name: "NFP Report", interpretation: "Better than expected (Bullish USD)" }
    ],
    intelligence_sources: ["Technical", "Fundamental", "Economic"]
  },
  {
    id: "sig124",
    currency_pair: "GBP/JPY",
    direction: "SELL",
    entry_price: 182.543,
    stop_loss: 182.843,
    take_profit: 181.943,
    risk_reward_ratio: 2.0,
    confidence_score: 0.92,
    status: "ACTIVE",
    created_at: "2025-05-30T11:45:12Z",
    timeframe: "H1",
    expected_duration: "1-2 days",
    analysis_summary: "Strong bearish pressure with overbought conditions and negative sentiment",
    technical_factors: [
      { name: "RSI", interpretation: "78 (Overbought)" },
      { name: "Bollinger Bands", interpretation: "Price above upper band" },
      { name: "MACD", interpretation: "Bearish divergence" }
    ],
    fundamental_factors: [
      { name: "BoJ Statement", interpretation: "Potential rate hike (Bullish JPY)" },
      { name: "Market Sentiment", interpretation: "70% Bearish" }
    ],
    economic_events: [
      { name: "UK GDP", interpretation: "Worse than expected (Bearish GBP)" }
    ],
    intelligence_sources: ["Technical", "Sentiment"]
  }
];

export default function SignalsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTimeframes, setSelectedTimeframes] = useState(["H1", "H4", "D1"]);
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);
  
  const timeframeOptions = ["M15", "H1", "H4", "D1", "W1"];
  
  const toggleTimeframe = (timeframe: string) => {
    if (selectedTimeframes.includes(timeframe)) {
      setSelectedTimeframes(selectedTimeframes.filter(t => t !== timeframe));
    } else {
      setSelectedTimeframes([...selectedTimeframes, timeframe]);
    }
  };
  
  // Filter signals based on selected criteria
  const filteredSignals = sampleSignals.filter(signal => {
    // Filter by status
    if (activeFilter === "active" && signal.status !== "ACTIVE") return false;
    if (activeFilter === "completed" && signal.status !== "COMPLETED") return false;
    
    // Filter by timeframe
    if (!selectedTimeframes.includes(signal.timeframe)) return false;
    
    return true;
  });
  
  // Sort signals
  const sortedSignals = [...filteredSignals].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "confidence") {
      return b.confidence_score - a.confidence_score;
    }
    return 0;
  });
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-foreground">AI Trading Signals</h1>
        <p className="text-sm text-foreground/70">
          High-accuracy trading signals backed by multiple intelligence sources
        </p>
      </div>
      
      {/* Control Panel */}
      <div className="flex flex-col space-y-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              activeFilter === "all" 
                ? "bg-accent text-white" 
                : "bg-background text-foreground/70 hover:bg-accent/10"
            }`}
          >
            All Signals
          </button>
          <button 
            onClick={() => setActiveFilter("active")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              activeFilter === "active" 
                ? "bg-accent text-white" 
                : "bg-background text-foreground/70 hover:bg-accent/10"
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveFilter("completed")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              activeFilter === "completed" 
                ? "bg-accent text-white" 
                : "bg-background text-foreground/70 hover:bg-accent/10"
            }`}
          >
            Completed
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-accent/10"
          >
            <RiFilter3Line className="mr-1.5 h-4 w-4" />
            Filters
          </button>
          
          <button
            onClick={() => setSortBy(sortBy === "date" ? "confidence" : "date")}
            className="flex items-center rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-accent/10"
          >
            Sort: {sortBy === "date" ? "Latest" : "Confidence"}
            {sortBy === "date" ? (
              <RiArrowDownSLine className="ml-1 h-4 w-4" />
            ) : (
              <RiArrowDownSLine className="ml-1 h-4 w-4" />
            )}
          </button>
          
          <button className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90">
            Generate Signal
          </button>
        </div>
      </div>
      
      {/* Expanded Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Timeframes</h3>
              <div className="flex flex-wrap gap-2">
                {timeframeOptions.map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => toggleTimeframe(timeframe)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                      selectedTimeframes.includes(timeframe)
                        ? "bg-accent text-white"
                        : "bg-background text-foreground/70 hover:bg-accent/10"
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Intelligence Sources</h3>
              <div className="flex flex-wrap gap-2">
                {["Technical", "Fundamental", "Sentiment", "Economic"].map(source => (
                  <button
                    key={source}
                    className="rounded-md bg-background px-2.5 py-1 text-xs font-medium text-foreground/70 hover:bg-accent/10"
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Premium Upgrade Banner (For Free Users) */}
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
        <div className="flex items-start space-x-3">
          <div className="rounded-full bg-warning/20 p-2">
            <RiInformationLine className="h-5 w-5 text-warning" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">Free Plan: 2/3 Signals Used Today</h3>
            <p className="text-sm text-foreground/70">
              Upgrade to Premium for unlimited AI signals, advanced analysis, and automated trading.
            </p>
            <button className="mt-2 rounded-md bg-warning px-3 py-1.5 text-xs font-bold text-background hover:bg-warning/90">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
      
      {/* Signals List */}
      <div className="space-y-4">
        {sortedSignals.length > 0 ? (
          sortedSignals.map(signal => (
            <Link
              key={signal.id}
              href={`/dashboard/signals/${signal.id}`}
              className="block rounded-lg border border-border bg-card transition-all hover:border-accent/30 hover:shadow-neon"
            >
              <div className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Signal Header */}
                <div className="mb-4 flex items-start gap-4 sm:mb-0">
                  {/* Direction Indicator */}
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                    signal.direction === "BUY" 
                      ? "bg-positive/20 text-positive" 
                      : "bg-negative/20 text-negative"
                  }`}>
                    {signal.direction === "BUY" ? (
                      <RiArrowUpSLine className="h-6 w-6" />
                    ) : (
                      <RiArrowDownSLine className="h-6 w-6" />
                    )}
                  </div>
                  
                  {/* Signal Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{signal.currency_pair}</h3>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                        signal.direction === "BUY" 
                          ? "bg-positive/10 text-positive" 
                          : "bg-negative/10 text-negative"
                      }`}>
                        {signal.direction}
                      </span>
                      <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        {signal.timeframe}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/70">{signal.analysis_summary}</p>
                    
                    {/* Intelligence Sources */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <RiBarChartGroupedLine className="h-3 w-3 text-accent" />
                        <span className="text-xs text-foreground/70">Technical</span>
                      </div>
                      {signal.intelligence_sources.includes("Fundamental") && (
                        <div className="flex items-center gap-1">
                          <RiNewspaperLine className="h-3 w-3 text-accent" />
                          <span className="text-xs text-foreground/70">Fundamental</span>
                        </div>
                      )}
                      {signal.intelligence_sources.includes("Economic") && (
                        <div className="flex items-center gap-1">
                          <RiCalendarEventLine className="h-3 w-3 text-accent" />
                          <span className="text-xs text-foreground/70">Economic</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Signal Details & Actions */}
                <div className="flex flex-col items-end gap-2">
                  {/* Confidence Score */}
                  <div className="flex items-center">
                    <div className="mr-2 text-sm font-medium">AI Confidence</div>
                    <div className="relative h-2 w-24 rounded-full bg-background">
                      <div 
                        className="absolute left-0 top-0 h-full rounded-full bg-accent"
                        style={{ width: `${signal.confidence_score * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-sm font-mono font-bold">
                      {Math.round(signal.confidence_score * 100)}%
                    </div>
                  </div>
                  
                  {/* Trade Parameters */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-foreground/70">Entry</div>
                      <div className="text-sm font-mono font-bold">{signal.entry_price}</div>
                    </div>
                    <div>
                      <div className="text-xs text-foreground/70">Stop</div>
                      <div className="text-sm font-mono font-bold text-negative">{signal.stop_loss}</div>
                    </div>
                    <div>
                      <div className="text-xs text-foreground/70">Target</div>
                      <div className="text-sm font-mono font-bold text-positive">{signal.take_profit}</div>
                    </div>
                  </div>
                  
                  {/* View Button */}
                  <button className="mt-2 flex items-center rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20">
                    View Details <RiArrowRightLine className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
              
              {/* Signal Footer */}
              <div className="flex items-center justify-between border-t border-border bg-background/40 px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-xs text-foreground/70">
                    <RiTimeLine className="mr-1 h-3 w-3" />
                    {signal.expected_duration}
                  </div>
                  <div className="flex items-center text-xs text-foreground/70">
                    <RiRobot2Line className="mr-1 h-3 w-3" />
                    AI Generated
                  </div>
                </div>
                <div className="text-xs text-foreground/70">
                  {new Date(signal.created_at).toLocaleString()}
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Empty state
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-center">
            <div className="rounded-full bg-background p-4">
              <RiPulseLine className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Signals Found</h3>
            <p className="mt-2 max-w-md text-sm text-foreground/70">
              No signals match your current filters. Try adjusting your filters or generate a new signal.
            </p>
            <button className="mt-4 flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-accent/90">
              Generate New Signal
            </button>
          </div>
        )}
      </div>
      
      {/* Trading Tip */}
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
        <div className="flex items-start space-x-3">
          <div className="rounded-full bg-accent/20 p-2">
            <RiInformationLine className="h-5 w-5 text-accent" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">Trading Tip</h3>
            <p className="text-sm text-foreground/70">
              ForexJoey signals are high-probability setups backed by multiple intelligence sources. Always follow your risk management rules and never risk more than 2% of your account on a single trade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
