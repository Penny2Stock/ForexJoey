'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';

export default function RiskDisclosurePage() {
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
              Risk Disclosure
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Important information about the risks associated with forex trading
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 shadow-sm">
            <div className="prose prose-invert max-w-none">
              <h2>Risk Warning</h2>
              <p>
                Trading foreign exchange (forex) on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite.
              </p>
              <p>
                The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with foreign exchange trading, and seek advice from an independent financial advisor if you have any doubts.
              </p>
              
              <h2>Accuracy of AI Trading Signals</h2>
              <p>
                ForexJoey employs sophisticated AI algorithms to analyze market data and generate trading signals. While our AI systems are designed to deliver high-accuracy predictions, it is important to understand that:
              </p>
              <ul>
                <li>No trading system can guarantee profits or completely eliminate risk.</li>
                <li>Past performance is not indicative of future results.</li>
                <li>Our AI's confidence scores represent probability estimates, not certainties.</li>
                <li>Market conditions can change rapidly due to unforeseen events.</li>
              </ul>
              <p>
                Even signals with high confidence scores can result in losing trades due to the inherent volatility and unpredictability of financial markets.
              </p>
              
              <h2>Leverage and Margin Risk</h2>
              <p>
                Trading forex typically involves the use of leverage, which means you can gain exposure to large positions while only tying up a small amount of your capital. While this can magnify profits, it can equally magnify losses and you may lose more than your initial deposit.
              </p>
              <p>
                ForexJoey's risk management parameters help mitigate these risks but cannot eliminate them entirely. You are ultimately responsible for setting appropriate leverage levels with your broker and managing your overall risk exposure.
              </p>
              
              <h2>Technology and Operational Risk</h2>
              <p>
                Using an AI-based trading platform involves various technological and operational risks, including:
              </p>
              <ul>
                <li>Internet connectivity issues that may affect signal delivery</li>
                <li>Broker API connectivity problems that may affect trade execution</li>
                <li>Potential discrepancies between expected and actual execution prices</li>
                <li>Delays in signal generation or transmission during volatile market conditions</li>
              </ul>
              
              <h2>Emotional Trading Risk</h2>
              <p>
                While ForexJoey's AI system aims to remove emotional bias from trading decisions, users may still make emotional decisions when choosing which signals to follow or when managing existing trades. Emotional trading can lead to poor decision-making, such as:
              </p>
              <ul>
                <li>Overriding AI recommendations based on fear or greed</li>
                <li>Adding to losing positions against the recommended strategy</li>
                <li>Closing profitable trades prematurely</li>
                <li>Taking excessive risks to recover losses</li>
              </ul>
              <p>
                We strongly recommend following ForexJoey's risk management guidelines and maintaining discipline in your trading approach.
              </p>
              
              <h2>Market Risk</h2>
              <p>
                The forex market is affected by numerous factors including, but not limited to:
              </p>
              <ul>
                <li>Economic indicators and data releases</li>
                <li>Central bank policies and interest rate decisions</li>
                <li>Political events and geopolitical tensions</li>
                <li>Market sentiment and unexpected news</li>
              </ul>
              <p>
                These factors can cause rapid price movements and increased volatility, which may result in slippage, gaps, and trading losses even when using ForexJoey's AI signals.
              </p>
              
              <h2>Regulatory and Legal Risk</h2>
              <p>
                Forex markets are regulated differently across jurisdictions. You are responsible for ensuring that your use of ForexJoey and any resulting trading activities comply with the laws and regulations in your jurisdiction. Regulatory changes may impact trading conditions and available instruments.
              </p>
              
              <h2>Risk Management Recommendations</h2>
              <p>
                To help manage trading risks, we recommend the following practices:
              </p>
              <ul>
                <li>Never risk more than 1-2% of your trading capital on a single trade</li>
                <li>Always use stop-loss orders as recommended by ForexJoey's AI</li>
                <li>Consider starting with a demo account until you are comfortable with the platform</li>
                <li>Diversify your trading across different currency pairs</li>
                <li>Keep a trading journal to track and learn from your trading decisions</li>
                <li>Only trade with money you can afford to lose</li>
              </ul>
              
              <h2>Conclusion</h2>
              <p>
                While ForexJoey's AI-powered trading signals can help inform your trading decisions, you are ultimately responsible for your own trading results. By using our platform, you acknowledge that you have read and understood these risks and accept full responsibility for your trading decisions.
              </p>
              <p>
                If you have any questions about the risks associated with forex trading or how to use ForexJoey's risk management features, please contact our support team.
              </p>
              
              <p className="text-sm text-gray-400 mt-8">
                Last updated: May 30, 2025
              </p>
            </div>
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
