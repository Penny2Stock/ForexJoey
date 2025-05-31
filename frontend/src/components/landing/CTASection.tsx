import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiShieldCheckLine, RiRobot2Line, RiLineChartLine } from 'react-icons/ri';

export default function CTASection() {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-blue-900 py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 md:p-12 shadow-glow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Start Trading with AI-Driven Precision
              </h2>
              
              <p className="text-xl text-gray-300 mb-8">
                ForexJoey combines multiple intelligence sources to deliver high-accuracy signals with 
                built-in risk management.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mr-3">
                    <RiShieldCheckLine className="h-4 w-4" />
                  </div>
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Capital Protection:</span> Advanced risk management with position sizing and drawdown prevention
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mr-3">
                    <RiRobot2Line className="h-4 w-4" />
                  </div>
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Multi-Source Intelligence:</span> Every signal backed by 2+ independent data sources
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mr-3">
                    <RiLineChartLine className="h-4 w-4" />
                  </div>
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Self-Improving AI:</span> Joey learns from every trade outcome to continuously enhance accuracy
                  </p>
                </div>
              </div>
              
              <Link
                href="/auth/sign-up"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium text-lg transform transition-transform hover:scale-105 hover:shadow-glow"
              >
                Try ForexJoey Free for 7 Days
              </Link>
              <p className="text-sm text-gray-400 mt-3">
                No credit card required. Cancel anytime.
              </p>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Signal Card Example */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-glow-sm overflow-hidden p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3">
                      <RiRobot2Line className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">AI Signal</h3>
                      <p className="text-xs text-gray-400">Just now • EUR/USD</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    BUY
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Entry:</span>
                    <span className="text-white font-mono">1.0876</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-red-400 font-mono">1.0845</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Take Profit:</span>
                    <span className="text-green-400 font-mono">1.0945</span>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-white mb-1">AI Reasoning:</h4>
                  <p className="text-xs text-gray-300">
                    Bullish momentum confirmed by MACD crossover and RSI at 58. 
                    Fundamentals support EUR with hawkish ECB stance. Sentiment analysis shows 67% bullish positioning.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Sources:</span>
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 text-xs">T</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 text-xs">F</div>
                      <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs">S</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium mr-2">Confidence:</div>
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <div className="ml-2 text-sm font-mono">87%</div>
                  </div>
                </div>
                
                {/* Glowing accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
