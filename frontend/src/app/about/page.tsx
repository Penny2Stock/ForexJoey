'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AIChatAssistant from '@/components/landing/AIChatAssistant';
import { RiTeamLine, RiAiLine, RiShieldLine, RiLineChartLine, RiBarChartGroupedLine } from 'react-icons/ri';

export default function AboutPage() {
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
              About ForexJoey
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our mission is to transform forex trading with AI-first intelligence and explainable insights
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission Section */}
          <div className="mb-20">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                ForexJoey was created with a singular goal: to bring institutional-grade trading intelligence to individual forex traders through the power of AI. We believe that successful trading requires both advanced technology and the human element of understanding.
              </p>
              <p className="text-xl text-gray-300 leading-relaxed mt-4">
                That's why we've built an AI system that doesn't just make predictions, but explains its reasoning, continuously learns from outcomes, and adapts to changing market conditions.
              </p>
            </motion.div>
          </div>
          
          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Our Core Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <RiAiLine className="w-8 h-8 text-blue-400" />,
                  title: "AI-First Intelligence",
                  description: "Our autonomous agent continuously analyzes markets using multiple intelligence sources, delivering high-accuracy signals that human analysts might miss."
                },
                {
                  icon: <RiShieldLine className="w-8 h-8 text-blue-400" />,
                  title: "Capital Protection",
                  description: "Every signal comes with built-in risk management. We prioritize protecting your trading capital above all else."
                },
                {
                  icon: <RiBarChartGroupedLine className="w-8 h-8 text-blue-400" />,
                  title: "Multi-Source Analysis",
                  description: "We require at least two independent sources of intelligence to confirm each signal, reducing false positives and enhancing reliability."
                },
                {
                  icon: <RiLineChartLine className="w-8 h-8 text-blue-400" />,
                  title: "Continuous Improvement",
                  description: "Our AI system reflects on every trade outcome, constantly optimizing its models and adapting to changing market conditions."
                },
                {
                  icon: <RiTeamLine className="w-8 h-8 text-blue-400" />,
                  title: "Human-AI Partnership",
                  description: "We believe in augmenting human decision-making with AI, not replacing it. Every insight is explainable and transparent."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-center">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Our Story */}
          <div className="mb-20">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Story</h2>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
                  <p className="text-gray-300 mb-4">
                    ForexJoey began as a research project by a team of AI researchers and professional forex traders who recognized a gap in the market: existing trading algorithms were either black boxes that offered no explanation for their decisions or simplistic systems based on outdated technical indicators.
                  </p>
                  <p className="text-gray-300 mb-4">
                    We set out to build something different — an AI system that could analyze markets like a team of professional traders, combining multiple forms of analysis, while providing clear explanations for its recommendations.
                  </p>
                  <p className="text-gray-300 mb-4">
                    After three years of development and testing, ForexJoey evolved from a research project into a powerful trading assistant that continuously learns and improves. Today, our platform serves traders worldwide, from beginners looking for guidance to professionals seeking an edge in the markets.
                  </p>
                  <p className="text-gray-300">
                    As we continue to evolve, our mission remains constant: to democratize access to sophisticated trading intelligence through explainable AI.
                  </p>
                </div>
              </motion.div>
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
