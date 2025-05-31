'use client';

import Hero from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import Features from '@/components/landing/Features';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Nav bar */}
      <Navbar />
      
      {/* Hero section */}
      <Hero />
      
      {/* Features */}
      <Features />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
      
      {/* AI Chat Assistant (floating) */}
      <AIChatAssistant />
    </main>
  );
}
