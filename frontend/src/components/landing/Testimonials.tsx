import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { RiStarFill, RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri';

const testimonials = [
  {
    name: "Alex Chen",
    title: "Professional Trader",
    image: "/images/testimonials/alex.jpg",
    content: "ForexJoey's multi-source analysis is a game-changer. The AI doesn't just show promising setups; it explains exactly why the trade makes sense with technical, fundamental, and sentiment data backing it up.",
    rating: 5,
    profit: "+21.8%"
  },
  {
    name: "Sarah Johnson",
    title: "Part-time Trader",
    image: "/images/testimonials/sarah.jpg",
    content: "As someone who can't watch the markets all day, Joey's AI has been invaluable. The risk management system protected my capital when I was just starting, and the explainable signals helped me learn proper trading psychology.",
    rating: 5,
    profit: "+17.4%"
  },
  {
    name: "Marcus Williams",
    title: "Beginner Trader",
    image: "/images/testimonials/marcus.jpg",
    content: "I tried several forex robots before Joey and lost money with all of them. The difference here is transparency - Joey explains every signal in plain English and requires multiple confirmations before recommending a trade.",
    rating: 4,
    profit: "+9.6%"
  }
];

export default function Testimonials() {
  return (
    <div className="relative bg-gray-900 py-24">
      {/* Gradient accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-base font-semibold text-cyan-400">TESTIMONIALS</h2>
            <h3 className="mt-2 text-4xl font-bold text-white">What Our Traders Say</h3>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of traders who have transformed their trading experience with ForexJoey's AI-driven approach.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, staggerChildren: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-cyan-500/40 transition-all group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Profit badge */}
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-sm">
                {testimonial.profit}
              </div>
              
              {/* Quotes decorations */}
              <div className="absolute top-12 left-6 text-blue-500/20 text-4xl">
                <RiDoubleQuotesL />
              </div>
              <div className="absolute bottom-12 right-6 text-blue-500/20 text-4xl">
                <RiDoubleQuotesR />
              </div>
              
              <div className="relative z-10">
                {/* Testimonial content */}
                <p className="text-gray-300 mb-8 relative z-10">
                  {testimonial.content}
                </p>
                
                {/* User info */}
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                  
                  <div className="ml-auto flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <RiStarFill key={i} className="text-yellow-500 w-5 h-5" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Overall stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <motion.div
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-cyan-400 font-bold text-4xl">89%</div>
            <div className="text-gray-300 mt-2">Success Rate</div>
          </motion.div>
          
          <motion.div
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-cyan-400 font-bold text-4xl">15K+</div>
            <div className="text-gray-300 mt-2">Active Users</div>
          </motion.div>
          
          <motion.div
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-cyan-400 font-bold text-4xl">128K</div>
            <div className="text-gray-300 mt-2">Signals Generated</div>
          </motion.div>
          
          <motion.div
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-cyan-400 font-bold text-4xl">$42M+</div>
            <div className="text-gray-300 mt-2">Profits Generated</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
