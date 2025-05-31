'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              How ForexJoey protects your data and respects your privacy
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 shadow-sm">
            <div className="prose prose-invert max-w-none">
              <h2>Introduction</h2>
              <p>
                At ForexJoey, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our forex trading platform and AI services.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support. This may include:
              </p>
              <ul>
                <li>Personal information (name, email address)</li>
                <li>Account credentials</li>
                <li>Trading preferences and risk parameters</li>
                <li>Trading history and performance data</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We use your information primarily to provide, maintain, and improve our services. This includes:
              </p>
              <ul>
                <li>Generating personalized trading signals</li>
                <li>Calibrating risk management systems to your preferences</li>
                <li>Providing customer support</li>
                <li>Communicating with you about updates and new features</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                ForexJoey implements robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our AI systems are designed with privacy-by-design principles.
              </p>
              
              <h2>Your Rights</h2>
              <p>
                Depending on your location, you may have rights regarding your personal information, including:
              </p>
              <ul>
                <li>Accessing your data</li>
                <li>Correcting inaccurate data</li>
                <li>Deleting your data</li>
                <li>Restricting processing</li>
                <li>Data portability</li>
              </ul>
              
              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@forexjoey.com.
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
