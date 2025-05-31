'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';
import { motion } from 'framer-motion';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

// FAQ items
const faqItems = [
  {
    question: "What is ForexJoey?",
    answer: "ForexJoey is an AI-first forex trading assistant that provides high-accuracy trading signals by analyzing multiple intelligence sources including technical analysis, market sentiment, economic data, and pattern recognition. Our platform is designed to help traders make more informed decisions with built-in risk management."
  },
  {
    question: "How does ForexJoey generate trading signals?",
    answer: "ForexJoey uses a multi-source intelligence approach, combining at least two independent analytical methods for each signal. This includes technical analysis (chart patterns, indicators), sentiment analysis (market mood, news impact), economic data (releases, forecasts), and historical pattern recognition. Every prediction comes with a detailed explanation of the reasoning."
  },
  {
    question: "What currency pairs does ForexJoey cover?",
    answer: "ForexJoey covers all major forex pairs (EUR/USD, GBP/USD, USD/JPY, etc.), minor pairs, and selected exotic pairs. The Standard and Premium plans provide coverage for all available pairs, while the Free plan focuses on major pairs only."
  },
  {
    question: "What timeframes are supported?",
    answer: "The Free plan provides signals for the H4 (4-hour) timeframe only. Standard and Premium plans include all timeframes from M5 (5-minute) to D1 (daily), allowing you to choose the timeframes that match your trading style."
  },
  {
    question: "How accurate are the trading signals?",
    answer: "ForexJoey constantly optimizes for accuracy, with an average win rate of 68-75% across all timeframes. Each signal includes a confidence score based on the strength of the analysis. Our AI system learns from past performance to continuously improve signal quality."
  },
  {
    question: "Can I use ForexJoey for automated trading?",
    answer: "Yes, the Premium plan includes automated trading capabilities. You can connect ForexJoey to your broker account via API (supported brokers include OANDA, FXCM, and others) and set your risk parameters. The system will execute trades based on your preferences while maintaining strict risk management."
  },
  {
    question: "What risk management features are included?",
    answer: "ForexJoey incorporates comprehensive risk management in all signals, including precise stop-loss and take-profit levels. The Standard and Premium plans allow you to customize risk parameters like maximum drawdown, risk per trade, and risk-reward minimums. The system will automatically adjust signals to match your risk tolerance."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. For monthly plans, your access will continue until the end of the billing period. For annual plans, you can request a prorated refund within the first 30 days."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with the service within the first week, you can request a full refund."
  },
  {
    question: "How do I get started with ForexJoey?",
    answer: "Getting started is easy. Sign up for a free account, explore the basic signals, and upgrade to a paid plan when you're ready. We offer a 7-day free trial of the Standard plan so you can experience the full capabilities before committing."
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  
  const toggleItem = (index: number) => {
    setOpenItems(prevOpenItems => 
      prevOpenItems.includes(index)
        ? prevOpenItems.filter(item => item !== index)
        : [...prevOpenItems, index]
    );
  };
  
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about ForexJoey and how our AI trading assistant works
            </p>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-16 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-white">{item.question}</h3>
                  <span className="ml-6 flex-shrink-0 text-blue-400">
                    {openItems.includes(index) ? (
                      <RiArrowUpSLine className="h-5 w-5" />
                    ) : (
                      <RiArrowDownSLine className="h-5 w-5" />
                    )}
                  </span>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4 text-gray-300">
                    <p>{item.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Still have questions */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-6">
              Our support team is ready to help with any other questions you might have.
            </p>
            <a
              href="/support"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow transition-all"
            >
              Contact Support
            </a>
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
