import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RiArrowUpSLine, RiArrowDownSLine, RiExternalLinkLine, RiLineChartLine, RiCheckLine } from 'react-icons/ri';

// Sample signal data
const sampleSignals = [
  {
    id: "sig1",
    pair: "EUR/USD",
    direction: "BUY",
    entry: 1.0876,
    stop: 1.0845,
    target: 1.0945,
    confidence: 87,
    timeframe: "H4",
    reason: "Bullish momentum with supportive economic data"
  },
  {
    id: "sig2",
    pair: "GBP/JPY",
    direction: "SELL",
    entry: 182.543,
    stop: 182.843,
    target: 181.943,
    confidence: 92,
    timeframe: "H1",
    reason: "Bearish pressure with overbought conditions"
  },
  {
    id: "sig3",
    pair: "USD/CAD",
    direction: "BUY",
    entry: 1.3512,
    stop: 1.3485,
    target: 1.3566,
    confidence: 85,
    timeframe: "H4",
    reason: "Technical breakout with supportive fundamentals"
  }
];

export default function Hero() {
  return (
    <div className="relative pt-8 lg:pt-12 pb-16 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left column - text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your AI Forex<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Trading Assistant
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Analyze the markets, generate winning trade ideas, and execute them automatically with ForexJoey's AI-first approach.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                href="/auth/sign-up" 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow transition-all"
              >
                Get Started
              </Link>
              
              <Link 
                href="/signals" 
                className="px-8 py-3 rounded-full bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
              >
                See Signals
              </Link>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-start gap-8 lg:gap-12 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">95%</div>
                <div className="text-sm text-gray-400 mt-1">Accuracy</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">24/7</div>
                <div className="text-sm text-gray-400 mt-1">Monitoring</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">4+</div>
                <div className="text-sm text-gray-400 mt-1">Signal Sources</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Trading Signals */}
          <div className="flex-1 relative mt-10 lg:mt-0">
            <motion.div
              className="w-full max-w-lg mx-auto relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Signal cards stack */}
              <div className="relative space-y-4">
                {sampleSignals.map((signal, index) => (
                  <motion.div
                    key={signal.id}
                    className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all shadow-lg hover:shadow-glow-sm"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                  >
                    {/* Signal Header */}
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${signal.direction === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {signal.direction === "BUY" ? (
                            <RiArrowUpSLine className="h-6 w-6" />
                          ) : (
                            <RiArrowDownSLine className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{signal.pair}</div>
                          <div className="text-xs text-gray-400">{signal.timeframe} Timeframe</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-sm font-medium ${signal.direction === "BUY" ? "text-green-400" : "text-red-400"}`}>
                          {signal.direction}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden mr-2">
                            <div 
                              className={`h-full ${signal.direction === "BUY" ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${signal.confidence}%` }}
                            ></div>
                          </div>
                          {signal.confidence}% Confidence
                        </div>
                      </div>
                    </div>
                    
                    {/* Signal Content */}
                    <div className="p-4">
                      <div className="flex justify-between mb-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                          <div className="text-white font-medium">{signal.entry}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                          <div className="text-red-400 font-medium">{signal.stop}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Take Profit</div>
                          <div className="text-green-400 font-medium">{signal.target}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-300 mt-2">
                        <span className="text-xs text-blue-400 font-medium mr-2">AI Analysis:</span>
                        {signal.reason}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* AI active indicator */}
              <motion.div 
                className="absolute -bottom-4 right-4 bg-gray-900/80 backdrop-blur-md rounded-full px-4 py-2 border border-blue-500/30 flex items-center shadow-glow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-ping-slow"></div>
                <div className="text-sm font-medium text-blue-400">AI Active</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
