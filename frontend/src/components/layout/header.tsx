"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  RiNotification3Line, 
  RiGlobalLine,
  RiArrowDownSLine,
  RiMoonLine,
  RiSunLine,
  RiUser3Line,
  RiLogoutBoxRLine
} from "react-icons/ri";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Currency pairs for quick access in header
  const quickPairs = [
    { name: "EUR/USD", change: 0.12, positive: true },
    { name: "GBP/USD", change: -0.08, positive: false },
    { name: "USD/JPY", change: 0.23, positive: true },
    { name: "AUD/USD", change: -0.15, positive: false },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      {/* Left: Quick Currency Pairs */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          {quickPairs.map((pair) => (
            <Link
              key={pair.name}
              href={`/dashboard/market/${pair.name.replace("/", "")}`}
              className="flex items-center rounded-md border border-border/50 px-2 py-1 transition-all hover:border-accent/30 hover:bg-accent/5"
            >
              <span className="text-sm font-medium">{pair.name}</span>
              <span className={`ml-1.5 text-xs font-semibold ${pair.positive ? "text-positive" : "text-negative"}`}>
                {pair.positive ? "+" : ""}{pair.change}%
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full p-1.5 text-foreground/70 hover:bg-accent/10 hover:text-accent"
        >
          {theme === "dark" ? (
            <RiMoonLine className="h-5 w-5" />
          ) : (
            <RiSunLine className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-1.5 text-foreground/70 hover:bg-accent/10 hover:text-accent">
          <RiNotification3Line className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-positive"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            className="flex items-center rounded-full border border-border/50 py-1 pl-1 pr-2 hover:border-accent/30 hover:bg-accent/5"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <Image
              src="/avatar-placeholder.png"
              alt="User Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="ml-2 text-sm font-medium">John</span>
            <RiArrowDownSLine className="ml-1 h-4 w-4" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-card shadow-lg">
              <div className="p-2">
                <Link
                  href="/dashboard/profile"
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent/10"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <RiUser3Line className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/auth/logout"
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent/10"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
