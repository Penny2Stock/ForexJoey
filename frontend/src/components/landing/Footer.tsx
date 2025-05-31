import React from 'react';
import Link from 'next/link';
import { RiTwitterXLine, RiDiscordLine, RiInstagramLine, RiYoutubeLine, RiArrowRightLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Social */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">FJ</span>
              </div>
              <span className="text-white font-bold text-xl">ForexJoey</span>
            </Link>
            
            <p className="text-gray-400 max-w-xs">
              AI-first forex trading assistant providing high-accuracy signals with multi-source intelligence.
            </p>
            
            <div className="flex space-x-4">
              <a href="https://twitter.com/forexjoey" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <RiTwitterXLine className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://discord.gg/forexjoey" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <RiDiscordLine className="w-6 h-6" />
                <span className="sr-only">Discord</span>
              </a>
              <a href="https://instagram.com/forexjoey" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <RiInstagramLine className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://youtube.com/forexjoey" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <RiYoutubeLine className="w-6 h-6" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/signals" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Trading Signals
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Trading Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/learn" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Learning Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Get weekly trading insights and AI signal performance updates.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-4 pr-12 py-3"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400"
                >
                  <RiArrowRightLine className="w-6 h-6" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ForexJoey. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-300 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-300 text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm">
              Cookies
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>
            Forex trading involves substantial risk of loss and is not suitable for all investors.
            Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
