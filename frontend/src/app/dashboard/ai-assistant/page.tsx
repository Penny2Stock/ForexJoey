'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  RiRobot2Line, RiLineChartLine, RiSettings4Line, 
  RiCheckboxCircleLine, RiCloseCircleLine, RiAlertLine,
  RiArrowUpLine, RiArrowDownLine, RiExchangeLine
} from 'react-icons/ri';
import { Switch, Slider, Select, Checkbox, Radio, Button, Tag, Tooltip, Spin } from 'antd';

// Currency pairs
const currencyPairs = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 
  'USD/CAD', 'USD/CHF', 'NZD/USD', 'EUR/GBP'
];

// Timeframes
const timeframes = [
  { label: 'M15', value: 'M15' },
  { label: 'H1', value: 'H1' },
  { label: 'H4', value: 'H4' },
  { label: 'D1', value: 'D1' },
];

export default function AIAssistantPage() {
  // Bot state
  const [botEnabled, setBotEnabled] = useState(false);
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [maxDailyTrades, setMaxDailyTrades] = useState(5);
  const [autoProtection, setAutoProtection] = useState(true);
  const [selectedPairs, setSelectedPairs] = useState(['EUR/USD', 'GBP/USD']);
  const [selectedTimeframes, setSelectedTimeframes] = useState(['H4']);
  const [activePair, setActivePair] = useState('EUR/USD');
  const [activeTimeframe, setActiveTimeframe] = useState('H4');
  const [chartLoaded, setChartLoaded] = useState(false);
  
  // TradingView widget container reference
  const tradingViewRef = useRef(null);
  
  // Activity log
  const [activityLog, setActivityLog] = useState([
    { time: '10:32', message: 'Closed GBP/USD trade: +28 pips', type: 'success' },
    { time: '09:15', message: 'Adjusted SL on USD/JPY to lock profit', type: 'info' },
    { time: '08:45', message: 'Opened long position on GBP/USD', type: 'info' },
    { time: '08:30', message: 'Analyzing market conditions...', type: 'info' },
    { time: '08:15', message: 'Bot started', type: 'info' },
  ]);

  // Initialize TradingView widget
  useEffect(() => {
    if (tradingViewRef.current && !chartLoaded) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            autosize: true,
            symbol: activePair.replace('/', ''),
            interval: activeTimeframe,
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#1f2937',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'tradingview_chart',
            studies: [
              'MAExp@tv-basicstudies',
              'RSI@tv-basicstudies',
              'MACD@tv-basicstudies'
            ],
            disabled_features: [
              'use_localstorage_for_settings',
              'header_symbol_search',
              'header_screenshot',
              'header_compare'
            ],
            enabled_features: [
              'side_toolbar_in_fullscreen_mode',
              'hide_left_toolbar_by_default'
            ]
          });
          setChartLoaded(true);
        }
      };
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [tradingViewRef, activePair, activeTimeframe, chartLoaded]);

  // Handle bot toggle
  const handleBotToggle = (checked: boolean) => {
    setBotEnabled(checked);
    
    // Add activity to log
    const newActivity = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: checked ? 'Bot activated' : 'Bot deactivated',
      type: checked ? 'success' : 'info'
    };
    
    setActivityLog([newActivity, ...activityLog.slice(0, 9)]);
  };

  // Handle pair selection
  const handlePairSelection = (pair: string) => {
    if (selectedPairs.includes(pair)) {
      setSelectedPairs(selectedPairs.filter(p => p !== pair));
    } else {
      setSelectedPairs([...selectedPairs, pair]);
    }
  };

  // Handle active pair change
  const handleActivePairChange = (pair: string) => {
    setActivePair(pair);
    setChartLoaded(false); // Reload chart with new pair
  };

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe);
    setChartLoaded(false); // Reload chart with new timeframe
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center mb-4">
          <RiRobot2Line className="text-cyan-500 text-3xl mr-3" />
          <h1 className="text-2xl font-bold text-white">AI Trading Assistant</h1>
          <Tag color={botEnabled ? 'success' : 'default'} className="ml-4">
            {botEnabled ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </div>
        <p className="text-gray-400">
          ForexJoey's AI Assistant can automatically execute trades based on AI-generated signals with multi-source intelligence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bot Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <RiSettings4Line className="mr-2 text-cyan-500" /> Bot Controls
          </h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Trading Bot Status</span>
              <Switch 
                checked={botEnabled} 
                onChange={handleBotToggle} 
                className={botEnabled ? "bg-green-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <span className="text-gray-300">Risk Profile</span>
              <Radio.Group 
                value={riskProfile} 
                onChange={e => setRiskProfile(e.target.value)}
                className="w-full flex"
              >
                <Radio.Button value="conservative" className="flex-1 text-center">Conservative</Radio.Button>
                <Radio.Button value="moderate" className="flex-1 text-center">Moderate</Radio.Button>
                <Radio.Button value="aggressive" className="flex-1 text-center">Aggressive</Radio.Button>
              </Radio.Group>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Max Daily Trades</span>
                <span className="text-cyan-500">{maxDailyTrades}</span>
              </div>
              <Slider 
                min={1} 
                max={10} 
                value={maxDailyTrades} 
                onChange={value => setMaxDailyTrades(value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Auto-Protection (Stop after 3 losses)</span>
              <Switch 
                checked={autoProtection} 
                onChange={setAutoProtection}
                className={autoProtection ? "bg-green-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <span className="text-gray-300">Active Currency Pair</span>
              <Select
                style={{ width: '100%' }}
                value={activePair}
                onChange={handleActivePairChange}
                options={currencyPairs.map(pair => ({ label: pair, value: pair }))}
              />
            </div>
            
            <div className="space-y-2">
              <span className="text-gray-300">Chart Timeframe</span>
              <div className="flex justify-between">
                {timeframes.map(tf => (
                  <Button 
                    key={tf.value}
                    type={activeTimeframe === tf.value ? 'primary' : 'default'}
                    onClick={() => handleTimeframeChange(tf.value)}
                    className={activeTimeframe === tf.value ? 'bg-cyan-500' : ''}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* TradingView Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 shadow-md lg:col-span-3"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <RiLineChartLine className="mr-2 text-cyan-500" /> Live Chart with AI Signals
            </h2>
          </div>
          
          <div 
            id="tradingview_chart" 
            ref={tradingViewRef}
            className="w-full rounded-lg overflow-hidden"
            style={{ height: '500px' }}
          >
            {!chartLoaded && (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gray-700">
                <Spin size="large" />
                <p className="mt-2 text-gray-400">Loading chart...</p>
              </div>
            )}
          </div>
          
          {/* AI Signal Overlay */}
          <div className="mt-4 bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">AI Signal Analysis</h3>
            <div className="text-center py-4 text-gray-400">
              <RiAlertLine className="inline-block text-2xl mb-2" />
              <p>No active signals for {activePair}</p>
              <p className="text-sm mt-2">The AI is constantly analyzing market data from multiple sources to find high-probability trading opportunities.</p>
            </div>
          </div>
        </motion.div>

        {/* Currency Pair Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Active Pairs</h2>
          
          <div className="grid grid-cols-2 gap-2 mb-6">
            {currencyPairs.map(pair => (
              <div key={pair} className="flex items-center">
                <Checkbox 
                  checked={selectedPairs.includes(pair)} 
                  onChange={() => handlePairSelection(pair)}
                >
                  <span className="text-gray-300">{pair}</span>
                </Checkbox>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <span className="text-gray-300">Timeframes to Monitor</span>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select timeframes"
              value={selectedTimeframes}
              onChange={value => setSelectedTimeframes(value)}
              options={timeframes}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Recent Bot Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 shadow-md lg:col-span-3"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          
          <div className="space-y-3 mb-4">
            {botEnabled && (
              <div className="flex items-start border-l-2 border-cyan-500 pl-3">
                <div className="text-gray-400 min-w-16">NOW</div>
                <div className="text-white flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></div>
                  Analyzing market conditions for potential trades...
                </div>
              </div>
            )}
            
            {activityLog.map((activity, index) => (
              <div key={index} className={`flex items-start border-l-2 pl-3 ${
                activity.type === 'success' ? 'border-green-500' : 
                activity.type === 'error' ? 'border-red-500' : 'border-gray-500'
              }`}>
                <div className="text-gray-400 min-w-16">{activity.time}</div>
                <div className="text-white flex items-center">
                  {activity.type === 'success' && <RiCheckboxCircleLine className="text-green-500 mr-2" />}
                  {activity.type === 'error' && <RiCloseCircleLine className="text-red-500 mr-2" />}
                  {activity.type === 'info' && <RiAlertLine className="text-gray-400 mr-2" />}
                  {activity.message}
                </div>
              </div>
            ))}
          </div>
          
          <Button type="default" className="w-full">View Full Trade Journal</Button>
        </motion.div>
      </div>
      
      {/* Connect OANDA Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-6 bg-gray-800 rounded-xl p-6 shadow-md"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Connect Trading Account</h2>
        
        <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-white">No trading account connected</span>
          </div>
          <p className="text-gray-400 text-sm">
            Connect your OANDA account to enable automated trading. ForexJoey will execute trades based on your risk settings and AI-generated signals with multiple intelligence sources.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">OANDA API Key</label>
            <input 
              type="password" 
              placeholder="Enter your OANDA API key" 
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">OANDA Account ID</label>
            <input 
              type="text" 
              placeholder="Enter your OANDA account ID" 
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button type="primary" className="bg-cyan-500 hover:bg-cyan-600">
            Connect OANDA Account
          </Button>
          <Button type="link" className="ml-2">
            How to get API credentials?
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
