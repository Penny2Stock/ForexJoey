import React from 'react';
import { motion } from 'framer-motion';
import { 
  RiBarChartGroupedLine,
  RiShieldCheckLine,
  RiBrainLine,
  RiRobot2Line,
  RiFlashlightLine,
  RiPieChartLine
} from 'react-icons/ri';

const features = [
  {
    icon: <RiBarChartGroupedLine className="w-10 h-10" />,
    title: "Multi-Source Intelligence",
    description: "Every signal is backed by at least 2 independent intelligence sources, ensuring high-confidence decisions.",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <RiShieldCheckLine className="w-10 h-10" />,
    title: "Smart Risk Management",
    description: "AI-powered capital protection that adjusts position sizing and enforces risk limits to preserve your account.",
    color: "from-green-400 to-cyan-400"
  },
  {
    icon: <RiBrainLine className="w-10 h-10" />,
    title: "Continuous Learning",
    description: "Joey learns from every trade outcome, constantly optimizing models to improve signal accuracy.",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: <RiRobot2Line className="w-10 h-10" />,
    title: "Autonomous Execution",
    description: "Set your risk parameters and let Joey handle the rest, from entry to exit with precision.",
    color: "from-yellow-400 to-orange-400"
  },
  {
    icon: <RiFlashlightLine className="w-10 h-10" />,
    title: "Real-time Analysis",
    description: "Constant monitoring of market conditions, news events, and sentiment shifts for timely signals.",
    color: "from-red-400 to-pink-400"
  },
  {
    icon: <RiPieChartLine className="w-10 h-10" />,
    title: "Transparent Reasoning",
    description: "Every signal includes detailed AI reasoning so you understand exactly why a trade was recommended.",
    color: "from-indigo-400 to-blue-400"
  }
];

// Animation variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function Features() {
  return (
    <div className="relative bg-gray-900 py-24">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="absolute inset-y-0 right-1/4 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-base font-semibold text-cyan-400">FEATURES</h2>
            <h3 className="mt-2 text-4xl font-bold text-white">Unlock the Power of Smart Trading</h3>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              ForexJoey combines advanced AI technologies with decades of forex expertise to deliver
              an unparalleled trading experience.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all group"
              variants={itemVariants}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-xl opacity-0 group-hover:opacity-25 blur-sm transition-opacity`} />
              <div className="relative">
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
