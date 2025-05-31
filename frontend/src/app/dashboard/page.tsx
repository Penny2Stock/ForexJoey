"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  RiLineChartLine, 
  RiPulseLine, 
  RiTimeLine,
  RiArrowRightLine,
  RiInformationLine,
  RiRobot2Line,
  RiBookOpenLine,
  RiLightbulbFlashLine
} from "react-icons/ri";

// Dashboard greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function Dashboard() {
  const [showTip, setShowTip] = useState(true);
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, John</h1>
        <p className="text-sm text-foreground/70">
          Here's your forex trading overview for {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Beginner Tip Card - Helps new users understand forex concepts */}
      {showTip && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-lg border border-accent/30 bg-accent/5 p-4"
        >
          <button 
            onClick={() => setShowTip(false)}
            className="absolute right-3 top-3 rounded-full p-1 text-foreground/50 hover:bg-accent/10 hover:text-accent"
          >
            ×
          </button>
          <div className="flex items-start space-x-3">
            <div className="rounded-full bg-accent/20 p-2">
              <RiLightbulbFlashLine className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">New to Forex Trading?</h3>
              <p className="text-sm text-foreground/70">
                Forex trading involves buying one currency while selling another. Our AI analyzes market conditions to find the best trading opportunities for you.
              </p>
              <div className="mt-2 flex space-x-3">
                <Link 
                  href="/dashboard/learn"
                  className="flex items-center text-xs font-medium text-accent hover:underline"
                >
                  <RiBookOpenLine className="mr-1 h-4 w-4" />
                  Start Learning
                </Link>
                <Link 
                  href="/dashboard/ai-assistant"
                  className="flex items-center text-xs font-medium text-accent hover:underline"
                >
                  <RiRobot2Line className="mr-1 h-4 w-4" />
                  Ask AI Assistant
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Account Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass-card flex items-center p-4">
          <div className="rounded-full bg-accent/20 p-3">
            <RiLineChartLine className="h-6 w-6 text-accent" />
          </div>
          <div className="ml-4">
            <div className="text-sm text-foreground/70">Balance</div>
            <div className="data-value text-xl font-bold">$1,000.00</div>
          </div>
        </div>
        
        <div className="glass-card flex items-center p-4">
          <div className="rounded-full bg-positive/20 p-3">
            <RiPulseLine className="h-6 w-6 text-positive" />
          </div>
          <div className="ml-4">
            <div className="text-sm text-foreground/70">Today's P/L</div>
            <div className="data-value text-xl font-bold text-positive">+$0.00</div>
          </div>
        </div>
        
        <div className="glass-card flex items-center p-4">
          <div className="rounded-full bg-warning/20 p-3">
            <RiTimeLine className="h-6 w-6 text-warning" />
          </div>
          <div className="ml-4">
            <div className="text-sm text-foreground/70">Signals Today</div>
            <div className="data-value text-xl font-bold">0/3 <span className="text-xs font-normal text-foreground/50">Free Plan</span></div>
          </div>
        </div>
      </div>
      
      {/* AI Trading Signals Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">AI Trading Signals</h2>
          <Link 
            href="/dashboard/signals"
            className="flex items-center text-sm text-accent hover:underline"
          >
            View All <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* No Signals State */}
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-center">
            <div className="rounded-full bg-background p-4">
              <RiPulseLine className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Active Signals</h3>
            <p className="mt-2 max-w-md text-sm text-foreground/70">
              ForexJoey AI is constantly analyzing the market to find high-probability trading opportunities for you.
            </p>
            <button className="mt-4 flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-accent/90">
              Generate New Signal
            </button>
          </div>
        </div>
      </div>
      
      {/* Market Overview */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Market Overview</h2>
          <Link 
            href="/dashboard/market"
            className="flex items-center text-sm text-accent hover:underline"
          >
            View Market <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"].map((pair, i) => (
            <Link 
              key={pair}
              href={`/dashboard/market/${pair.replace("/", "")}`}
              className="glass-card block p-4 transition-all hover:border-accent/30 hover:shadow-neon"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{pair}</div>
                <div className={i % 2 === 0 ? "text-positive text-sm" : "text-negative text-sm"}>
                  {i % 2 === 0 ? "+0.12%" : "-0.08%"}
                </div>
              </div>
              <div className="h-[60px] w-full">
                {/* Placeholder for chart sparkline */}
                <div className={`h-full w-full rounded-md ${i % 2 === 0 ? "bg-positive/10" : "bg-negative/10"}`}></div>
              </div>
              <div className="mt-2 text-center text-sm text-foreground/70">
                {i % 2 === 0 ? "Bullish momentum" : "Bearish pressure"}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Economic Calendar */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Economic Calendar</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground/70 hover:bg-accent/10 hover:text-accent">
              <div className="mr-1 h-2 w-2 rounded-full bg-negative"></div>
              High Impact
            </button>
            <Link 
              href="/dashboard/market/calendar"
              className="flex items-center text-sm text-accent hover:underline"
            >
              View Calendar <RiArrowRightLine className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="rounded-lg border border-border">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-border bg-background/30 p-3 text-xs font-medium text-foreground/70">
            <div>Time</div>
            <div>Event</div>
            <div>Impact</div>
            <div>Currency</div>
          </div>
          
          <div className="divide-y divide-border">
            {[
              { time: "09:30", event: "GDP Growth Rate", impact: "high", currency: "GBP" },
              { time: "14:30", event: "Non-Farm Payrolls", impact: "high", currency: "USD" },
              { time: "15:45", event: "ECB Press Conference", impact: "medium", currency: "EUR" }
            ].map((event, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3">
                <div className="whitespace-nowrap text-sm font-mono">{event.time}</div>
                <div className="text-sm">{event.event}</div>
                <div>
                  <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    event.impact === "high" 
                      ? "bg-negative/10 text-negative" 
                      : event.impact === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-neutral/10 text-neutral"
                  }`}>
                    {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)}
                  </div>
                </div>
                <div className="font-medium">{event.currency}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Learning Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Learn Forex</h2>
          <Link 
            href="/dashboard/learn"
            className="flex items-center text-sm text-accent hover:underline"
          >
            Learning Hub <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: "Forex Basics", desc: "Learn the fundamentals of forex trading for beginners" },
            { title: "Technical Analysis", desc: "Understand charts, indicators and price patterns" },
            { title: "AI Trading Guide", desc: "How to use ForexJoey AI to improve your trading" }
          ].map((course, i) => (
            <Link 
              key={i}
              href={`/dashboard/learn/${course.title.toLowerCase().replace(" ", "-")}`}
              className="glass-card block p-4 transition-all hover:border-accent/30"
            >
              <div className="mb-2 rounded-md bg-accent/10 p-6 text-center">
                <RiBookOpenLine className="mx-auto h-8 w-8 text-accent" />
              </div>
              <h3 className="text-base font-medium">{course.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{course.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
