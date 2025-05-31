'use client';

import React, { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  RiHome4Line, 
  RiLineChartLine, 
  RiBrainLine, 
  RiWalletLine, 
  RiSettings4Line, 
  RiMenuFoldLine, 
  RiMenuUnfoldLine,
  RiQuestionLine,
  RiSignalTowerLine
} from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <RiHome4Line size={20} /> },
    { name: 'Market Analysis', path: '/dashboard/market', icon: <RiLineChartLine size={20} /> },
    { name: 'AI Signals', path: '/dashboard/signals', icon: <RiSignalTowerLine size={20} /> },
    { name: 'AI Performance', path: '/dashboard/ai-performance', icon: <RiBrainLine size={20} /> },
    { name: 'Portfolio', path: '/dashboard/portfolio', icon: <RiWalletLine size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <RiSettings4Line size={20} /> },
    { name: 'Learn', path: '/dashboard/learn', icon: <RiQuestionLine size={20} /> },
  ];

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        className="glass-card flex flex-col z-30 bg-card border-r border-border"
        animate={{ width: collapsed ? '80px' : '250px' }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center">
              <span className="font-bold text-xl text-accent">ForexJoey</span>
            </Link>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-background/50 transition-colors"
          >
            {collapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
              
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-accent/10 text-accent neon-border' 
                        : 'hover:bg-card-foreground/5'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-3 transition-opacity">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-border flex items-center">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-semibold">J</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs text-muted-foreground">3/3 Signals</p>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
