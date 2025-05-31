'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiMenu4Line, RiCloseLine } from 'react-icons/ri';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Track scroll position to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-900/80 backdrop-blur-md py-2 shadow-lg' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">FJ</span>
              </div>
              <span className="text-white font-bold text-xl">ForexJoey</span>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/features" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link 
                href="/signals" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Signals
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/sign-up"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow transition-all"
              >
                Get Started
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <RiCloseLine className="w-6 h-6" />
              ) : (
                <RiMenu4Line className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation */}
      <motion.div 
        className={`fixed inset-0 z-40 bg-gray-900 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : -100
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col p-8 pt-24 space-y-8">
          <Link 
            href="/features" 
            className="text-xl text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="/signals" 
            className="text-xl text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Signals
          </Link>
          <Link 
            href="/pricing" 
            className="text-xl text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            href="/auth/sign-in" 
            className="text-xl text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link 
            href="/auth/sign-up"
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </motion.div>
    </>
  );
}
