'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';

export default function CookiesPage() {
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
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              How ForexJoey uses cookies and similar technologies
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 shadow-sm">
            <div className="prose prose-invert max-w-none">
              <h2>What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              
              <h2>How We Use Cookies</h2>
              <p>
                ForexJoey uses cookies and similar technologies for several purposes, including:
              </p>
              <ul>
                <li><strong>Essential cookies:</strong> Required for the basic functionality of our platform, such as authentication and security.</li>
                <li><strong>Functional cookies:</strong> Help us remember your preferences and settings.</li>
                <li><strong>Performance cookies:</strong> Collect information about how you use our platform to help us improve it.</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our platform by collecting and reporting information anonymously.</li>
              </ul>
              
              <h2>Types of Cookies We Use</h2>
              
              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
              </p>
              
              <h3>Performance and Analytics Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
              </p>
              
              <h3>Functional Cookies</h3>
              <p>
                These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
              </p>
              
              <h3>Targeting Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
              </p>
              
              <h2>Managing Cookies</h2>
              <p>
                Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The Help function within your browser should tell you how.
              </p>
              <p>
                Please note that if you disable cookies, some features of ForexJoey may not function properly.
              </p>
              
              <h2>Changes to Our Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at privacy@forexjoey.com.
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
