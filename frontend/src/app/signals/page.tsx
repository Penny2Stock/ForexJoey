'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';
import { motion } from 'framer-motion';
import { RiArrowUpSLine, RiArrowDownSLine, RiFilter3Line, RiArrowRightLine } from 'react-icons/ri';

// Sample signals for demonstration
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
    timeframe: "H4",
    analysis_summary: "Bullish momentum with supportive economic data and positive sentiment",
    date: "30 May, 2025"
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
    timeframe: "H1",
    analysis_summary: "Strong bearish pressure with overbought conditions and negative sentiment",
    date: "30 May, 2025"
  },
  {
    id: "sig125",
    currency_pair: "USD/CAD",
    direction: "BUY",
    entry_price: 1.3512,
    stop_loss: 1.3485,
    take_profit: 1.3566,
    risk_reward_ratio: 2.1,
    confidence_score: 0.85,
    timeframe: "H4",
    analysis_summary: "Technical breakout with support from oil price movements and economic data",
    date: "29 May, 2025"
  }
];

export default function SignalsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("confidence");
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Nav bar */}
      <Navbar />
      
      {/* Page Header */}
      <div className="relative pt-28 pb-12 bg-gradient-to-b from-gray-900 to-blue-950">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute bottom-20 -left-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
              AI Trading Signals
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              High-accuracy signals powered by ForexJoey's multi-source intelligence system.
              Every trade recommendation is backed by at least two independent analysis methods.
            </p>
          </div>
        </div>
      </div>
      
      {/* Signals Section */}
      <div className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Control Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveFilter("all")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  activeFilter === "all" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Signals
              </button>
              <button 
                onClick={() => setActiveFilter("buy")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  activeFilter === "buy" 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Buy Signals
              </button>
              <button 
                onClick={() => setActiveFilter("sell")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  activeFilter === "sell" 
                    ? "bg-red-500 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Sell Signals
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-600"
              >
                <RiFilter3Line className="mr-1.5 h-4 w-4" />
                Filters
              </button>
              
              <button
                onClick={() => setSortBy(sortBy === "date" ? "confidence" : "date")}
                className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-600"
              >
                Sort: {sortBy === "date" ? "Latest" : "Confidence"}
              </button>
              
              <Link
                href="/auth/sign-up"
                className="rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1.5 text-sm font-medium text-white hover:shadow-glow"
              >
                Get Access
              </Link>
            </div>
          </div>
          
          {/* Premium Banner */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Unlock Premium Trading Signals</h3>
                <p className="text-gray-300">
                  Get unlimited access to ForexJoey's high-accuracy signals with detailed analysis and risk management.
                </p>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow flex items-center whitespace-nowrap"
              >
                View Pricing <RiArrowRightLine className="ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Signals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleSignals
              .filter(signal => {
                if (activeFilter === "all") return true;
                if (activeFilter === "buy" && signal.direction === "BUY") return true;
                if (activeFilter === "sell" && signal.direction === "SELL") return true;
                return false;
              })
              .sort((a, b) => {
                if (sortBy === "date") {
                  // In real app, would use actual date comparison
                  return 0;
                } else {
                  return b.confidence_score - a.confidence_score;
                }
              })
              .map((signal) => (
                <motion.div
                  key={signal.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-glow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Signal Header */}
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        signal.direction === "BUY" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {signal.direction === "BUY" ? (
                          <RiArrowUpSLine className="h-6 w-6" />
                        ) : (
                          <RiArrowDownSLine className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{signal.currency_pair}</h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`${
                            signal.direction === "BUY" 
                              ? "text-green-400" 
                              : "text-red-400"
                          }`}>
                            {signal.direction}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{signal.timeframe}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{signal.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Confidence</div>
                      <div className="text-sm font-bold text-white">{Math.round(signal.confidence_score * 100)}%</div>
                    </div>
                  </div>
                  
                  {/* Signal Body */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Entry</div>
                        <div className="text-sm font-mono font-medium text-white">{signal.entry_price}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Stop</div>
                        <div className="text-sm font-mono font-medium text-red-400">{signal.stop_loss}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Target</div>
                        <div className="text-sm font-mono font-medium text-green-400">{signal.take_profit}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 line-clamp-2 mb-4">{signal.analysis_summary}</p>
                    
                    <Link
                      href={`/dashboard/signals/${signal.id}`}
                      className="block text-center py-2 px-4 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors text-sm"
                    >
                      View Full Analysis
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
          
          {/* More Signals CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-300 mb-6">
              These are just samples. Sign up to get access to all trading signals with detailed analysis.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </main>
  );
}
