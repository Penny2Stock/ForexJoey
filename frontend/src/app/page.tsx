'use client';

// Simplified imports for Vercel deployment
import dynamic from 'next/dynamic';

// Dynamically import components to reduce initial load
const Hero = dynamic(() => import('@/components/landing/Hero'), { ssr: false });
const Navbar = dynamic(() => import('@/components/landing/Navbar'), { ssr: false });
const Features = dynamic(() => import('@/components/landing/Features'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/landing/Testimonials'), { ssr: false });
const CTASection = dynamic(() => import('@/components/landing/CTASection'), { ssr: false });
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: false });
const AIChatAssistant = dynamic(() => import('@/components/landing/AIChatAssistant'), { ssr: false });

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
