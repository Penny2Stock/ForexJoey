'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Features from '@/components/landing/Features';
import AIChatAssistant from '@/components/landing/AIChatAssistant';

export default function FeaturesPage() {
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
              ForexJoey Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how ForexJoey's AI-first approach combines multiple intelligence sources
              to deliver high-accuracy trading signals with built-in risk management.
            </p>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <Features />
      
      {/* Footer */}
      <Footer />
      
      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </main>
  );
}
