'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRobot2Line, RiCloseLine, RiSendPlaneFill, RiUserSmileLine } from 'react-icons/ri';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'joey';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hey there! I'm Joey, your AI forex assistant. How can I help you today?",
    sender: 'joey',
    timestamp: new Date()
  }
];

import apiService from '../../services/api';
import { getCombinedAnalysis, meetsMultiSourceRequirement } from '../../utils/intelligence-sources';

// Predefined answers for quick questions
const quickResponses: Record<string, string> = {
  "what is forexjoey": "ForexJoey is an AI-first forex trading assistant that provides high-accuracy trading signals by analyzing multiple intelligence sources including technical analysis, fundamental data, sentiment analysis, and economic events.",
  "how does it work": "I analyze market data from multiple sources (technical, fundamental, sentiment, economic) and only generate signals when at least 2 sources confirm a potential opportunity. This multi-source approach leads to higher accuracy trading decisions.",
  "how accurate is it": "ForexJoey achieves 75-95% accuracy on signals by requiring confirmation from multiple intelligence sources. I never make a prediction without at least 2 supporting indicators, and I continuously learn from trade outcomes to improve my accuracy.",
  "pricing": "ForexJoey offers several plans: Free (2 signals/day), Standard ($49/month for unlimited signals), and Premium ($99/month for signals plus automated trading). All plans include our proprietary risk management system.",
  "risk management": "My risk management system automatically calculates optimal position sizing based on your account balance and risk tolerance. I enforce daily/weekly loss limits and maximum drawdown protection to safeguard your capital.",
  "supported pairs": "I currently support all major forex pairs (EUR/USD, GBP/USD, USD/JPY, etc.) and popular minor pairs. Premium users can access signals for 28+ currency pairs.",
  "demo account": "Yes! You can sign up for a free 7-day trial of our Premium plan with no credit card required. This gives you full access to experience ForexJoey's capabilities.",
  "sentiment analysis": "I use advanced sentiment analysis from multiple sources including financial news, social media, and market commentary. This data is combined with technical and economic indicators to provide high-confidence trading signals.",
  "economic calendar": "I monitor economic events 24/7 and adjust my analysis based on upcoming high-impact events. I'll warn you about potential volatility and automatically reduce position sizes before major announcements.",
  "intelligence sources": "I use at least 2 independent intelligence sources for every trading signal: technical analysis, sentiment analysis, economic calendar data, and fundamental analysis. This multi-source approach is key to my high accuracy.",
};

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Simulate Joey typing response
  const simulateTyping = (response: string) => {
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(1000, Math.max(500, response.length * 10));
    
    setTimeout(() => {
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: response,
          sender: 'joey',
          timestamp: new Date()
        }
      ]);
    }, typingDelay);
  };

  // Process user message and generate Joey's response
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Generate response based on user input
    const userQuery = inputValue.toLowerCase();
    let response = '';
    
    // Check for matches in predefined responses
    for (const [key, value] of Object.entries(quickResponses)) {
      if (userQuery.includes(key)) {
        response = value;
        break;
      }
    }
    
    // Check for currency pair analysis requests
    const currencyPairRegex = /(?:what(?:'s| is) the (?:outlook|analysis|sentiment|forecast) (?:for|on) |(?:analyze|check) )([a-z]{3}\/?[a-z]{3})/i;
    const match = userQuery.match(currencyPairRegex);
    
    if (match) {
      const pair = match[1].toUpperCase();
      const formattedPair = pair.includes('/') ? pair : `${pair.slice(0, 3)}/${pair.slice(3)}`;
      
      setIsTyping(true);
      
      try {
        // Get sentiment data for the pair
        const sentiment = await apiService.sentiment.getSentimentForPair(formattedPair, '1d');
        
        response = `${formattedPair} sentiment is ${sentiment.direction.toUpperCase()} with ${Math.round(sentiment.confidence * 100)}% confidence. `;
        response += `Analysis based on ${sentiment.news_count} news sources. `;
        response += sentiment.analysis || '';
        
        // Try to get combined analysis if available
        try {
          const combinedAnalysis = await getCombinedAnalysis(formattedPair, '1d');
          
          if (meetsMultiSourceRequirement(combinedAnalysis)) {
            response += `\n\nCOMBINED SIGNAL: ${combinedAnalysis.combined_signal.direction.replace('_', ' ').toUpperCase()} with ${Math.round(combinedAnalysis.confidence_score * 100)}% confidence. `;
            response += `This signal is backed by ${combinedAnalysis.intelligence_sources.join(' and ')} analysis.`;
          }
        } catch (error) {
          console.error('Error getting combined analysis:', error);
          // Continue with just sentiment analysis if combined analysis fails
        }
      } catch (error) {
        console.error('Error getting sentiment data:', error);
        response = `I'm having trouble analyzing ${formattedPair} right now. Please try again later or check another currency pair.`;
      } finally {
        setIsTyping(false);
      }
    }
    
    // Default response if no matches found
    if (!response) {
      response = "Thanks for your message! For detailed information about ForexJoey's capabilities, please sign up or speak with our customer support team. Would you like to know about our trading accuracy, risk management system, or pricing plans?";
    }
    
    // Simulate Joey typing a response
    simulateTyping(response);
  };
  
  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-glow text-white"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <RiCloseLine className="w-8 h-8" />
        ) : (
          <RiRobot2Line className="w-8 h-8" />
        )}
      </motion.button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 z-40 w-full max-w-md"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900 rounded-xl shadow-glow border border-gray-700 overflow-hidden backdrop-blur-sm">
              {/* Chat header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <RiRobot2Line className="w-6 h-6" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-bold">ForexJoey</h3>
                    <div className="flex items-center text-xs text-blue-100">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                      AI Assistant
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>
              </div>
              
              {/* Chat messages */}
              <div className="h-96 overflow-y-auto p-4 flex flex-col space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'joey' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-3 ${
                        message.sender === 'joey' 
                          ? 'bg-gray-800 text-white rounded-tl-none' 
                          : 'bg-blue-500 text-white rounded-tr-none'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white rounded-2xl rounded-tl-none max-w-xs px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                    placeholder="Ask me about ForexJoey..."
                  />
                  <button 
                    type="submit"
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                  >
                    <RiSendPlaneFill className="w-5 h-5" />
                  </button>
                </form>
                <div className="mt-3 flex justify-center">
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <button 
                      onClick={() => setInputValue("How accurate is ForexJoey?")}
                      className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700"
                    >
                      Accuracy
                    </button>
                    <button 
                      onClick={() => setInputValue("How does risk management work?")}
                      className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700"
                    >
                      Risk Management
                    </button>
                    <button 
                      onClick={() => setInputValue("What are the pricing plans?")}
                      className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700"
                    >
                      Pricing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
