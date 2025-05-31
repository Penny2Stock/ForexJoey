'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Terms and conditions for using ForexJoey's AI trading platform
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 shadow-sm">
            <div className="prose prose-invert max-w-none">
              <h2>Agreement to Terms</h2>
              <p>
                These Terms of Service govern your use of the ForexJoey platform and services. By accessing or using ForexJoey, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
              </p>
              
              <h2>AI-First Trading Services</h2>
              <p>
                ForexJoey is an AI-first, forex-only autonomous agent that prioritizes high-accuracy decision making. Our platform is designed to provide trading signals based on multiple intelligence sources and implements capital protection measures through advanced risk management.
              </p>
              
              <h2>Subscription Terms</h2>
              <p>
                Your subscription to ForexJoey grants you access to our AI trading signals and platform features based on your chosen plan. Subscriptions are billed on a recurring basis (monthly or annually) until canceled. You may cancel your subscription at any time.
              </p>
              
              <h2>Risk Disclosure</h2>
              <p>
                Forex trading involves substantial risk of loss and is not suitable for all investors. While ForexJoey's AI systems aim to provide high-accuracy trading signals, no trading system can guarantee profits. Past performance is not indicative of future results.
              </p>
              <p>
                Your capital is at risk, and you should not trade with money you cannot afford to lose. By using ForexJoey, you acknowledge and accept these risks.
              </p>
              
              <h2>Automated Trading</h2>
              <p>
                If you enable automated trading features (Premium plan), you authorize ForexJoey to place trades on your behalf based on your preset risk parameters. You remain responsible for all trading activity initiated through your account, including:
              </p>
              <ul>
                <li>Losses incurred from automated trades</li>
                <li>Technical issues that may affect trade execution</li>
                <li>Differences between expected and actual execution prices</li>
              </ul>
              
              <h2>User Obligations</h2>
              <p>
                As a ForexJoey user, you agree to:
              </p>
              <ul>
                <li>Provide accurate account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with applicable laws and regulations</li>
                <li>Not attempt to reverse-engineer or manipulate the ForexJoey AI system</li>
              </ul>
              
              <h2>Intellectual Property</h2>
              <p>
                All aspects of the ForexJoey platform, including its AI algorithms, trading strategies, and user interface, are proprietary and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works based on our service without explicit permission.
              </p>
              
              <h2>Limitation of Liability</h2>
              <p>
                ForexJoey shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including trading losses, regardless of whether such losses were foreseeable.
              </p>
              
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the bottom of this page or by notifying you directly. Your continued use of ForexJoey after such changes constitutes your acceptance of the new Terms.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have questions about these Terms, please contact us at legal@forexjoey.com.
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
