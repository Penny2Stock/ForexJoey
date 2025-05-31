'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';
import { RiCheckLine, RiCloseLine, RiArrowRightLine } from 'react-icons/ri';

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Basic access to ForexJoey's AI trading signals",
    features: [
      { name: "2 Signals per day", included: true },
      { name: "Basic technical analysis", included: true },
      { name: "Standard risk assessment", included: true },
      { name: "Single timeframe (H4)", included: true },
      { name: "Multi-source intelligence", included: false },
      { name: "Detailed signal reasoning", included: false },
      { name: "Custom risk parameters", included: false },
      { name: "Automated trading", included: false },
    ],
    cta: "Get Started",
    highlighted: false
  },
  {
    name: "Standard",
    price: "49",
    description: "Comprehensive forex signals with detailed analysis",
    features: [
      { name: "Unlimited signals", included: true },
      { name: "Advanced technical analysis", included: true },
      { name: "Personalized risk management", included: true },
      { name: "All timeframes", included: true },
      { name: "Multi-source intelligence", included: true },
      { name: "Detailed signal reasoning", included: true },
      { name: "Custom risk parameters", included: true },
      { name: "Automated trading", included: false },
    ],
    cta: "Start 7-Day Trial",
    highlighted: true
  },
  {
    name: "Premium",
    price: "99",
    description: "Full-featured AI assistant with automated trading",
    features: [
      { name: "Unlimited signals", included: true },
      { name: "Advanced technical analysis", included: true },
      { name: "Personalized risk management", included: true },
      { name: "All timeframes", included: true },
      { name: "Multi-source intelligence", included: true },
      { name: "Detailed signal reasoning", included: true },
      { name: "Custom risk parameters", included: true },
      { name: "Automated trading", included: true },
    ],
    cta: "Get Premium",
    highlighted: false
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your trading needs, from basic signals to fully automated trading.
            </p>
            
            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center bg-gray-800/60 backdrop-blur-sm rounded-full p-1 border border-gray-700">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              // Calculate yearly pricing (20% discount)
              const monthlyPrice = parseInt(plan.price);
              const yearlyPrice = monthlyPrice * 0.8;
              
              // Display price based on selected billing period
              const displayPrice = billingPeriod === 'monthly' 
                ? plan.price 
                : Math.floor(yearlyPrice).toString();
              
              return (
                <motion.div
                  key={plan.name}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border ${
                    plan.highlighted 
                      ? 'border-blue-500 shadow-glow' 
                      : 'border-gray-700 hover:border-gray-500'
                  } transition-all relative`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  )}
                  
                  {/* Plan Header */}
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">${displayPrice}</span>
                      <span className="text-gray-400 ml-2">
                        /{billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Plan Features */}
                  <div className="p-6">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                            feature.included 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-gray-700/50 text-gray-500'
                          } flex items-center justify-center mr-3 mt-0.5`}>
                            {feature.included ? (
                              <RiCheckLine className="h-3 w-3" />
                            ) : (
                              <RiCloseLine className="h-3 w-3" />
                            )}
                          </div>
                          <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      href="/auth/sign-up"
                      className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-glow transition-shadow'
                          : 'bg-gray-700 text-white hover:bg-gray-600 transition-colors'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-blue-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6 max-w-2xl">
              <h3 className="text-xl font-bold text-white mb-2">7-Day Money-Back Guarantee</h3>
              <p className="text-gray-300">
                Try ForexJoey risk-free. If you're not completely satisfied with your subscription,
                we'll refund your payment in full — no questions asked.
              </p>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-2">How accurate are ForexJoey's signals?</h3>
                <p className="text-gray-300">
                  ForexJoey achieves 75-95% accuracy by requiring at least 2 independent sources of confirmation before generating a signal. The AI continuously learns from trade outcomes to improve future predictions.
                </p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-300">
                  Yes, you can cancel your subscription at any time. If you cancel within the first 7 days, you'll receive a full refund. After that, you'll retain access until the end of your billing period.
                </p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-2">What currency pairs does ForexJoey support?</h3>
                <p className="text-gray-300">
                  ForexJoey supports all major forex pairs (EUR/USD, GBP/USD, USD/JPY, etc.) and most minor pairs. Premium subscribers get access to 28+ currency pairs including exotics.
                </p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-2">How does the automated trading work?</h3>
                <p className="text-gray-300">
                  Premium subscribers can connect ForexJoey to their trading account via our secure API. The AI will automatically execute trades based on your pre-defined risk parameters, including position sizing, max drawdown, and take profit/stop loss settings.
                </p>
              </div>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to transform your trading?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who are already benefiting from ForexJoey's AI-powered signals.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow transition-all text-lg"
            >
              Start Your Free Trial <RiArrowRightLine className="ml-2" />
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
