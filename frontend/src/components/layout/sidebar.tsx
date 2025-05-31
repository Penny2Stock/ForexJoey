"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  RiHome5Line, RiHome5Fill,
  RiPulseLine, RiPulseFill,
  RiLineChartLine, RiLineChartFill,
  RiWalletLine, RiWalletFill,
  RiBookReadLine, RiBookReadFill,
  RiSettings4Line, RiSettings4Fill,
  RiRobot2Line, RiRobot2Fill
} from "react-icons/ri";
import { motion } from "framer-motion";
import Image from "next/image";

type NavItem = {
  name: string;
  href: string;
  icon: {
    default: React.ElementType;
    active: React.ElementType;
  };
  badge?: {
    text: string;
    variant: "new" | "premium" | "beta";
  };
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: {
      default: RiHome5Line,
      active: RiHome5Fill,
    },
  },
  {
    name: "Signals",
    href: "/dashboard/signals",
    icon: {
      default: RiPulseLine,
      active: RiPulseFill,
    },
    badge: {
      text: "AI",
      variant: "premium",
    },
  },
  {
    name: "Market",
    href: "/dashboard/market",
    icon: {
      default: RiLineChartLine,
      active: RiLineChartFill,
    },
  },
  {
    name: "Portfolio",
    href: "/dashboard/portfolio",
    icon: {
      default: RiWalletLine,
      active: RiWalletFill,
    },
  },
  {
    name: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: {
      default: RiRobot2Line,
      active: RiRobot2Fill,
    },
    badge: {
      text: "New",
      variant: "new",
    },
  },
  {
    name: "Learn",
    href: "/dashboard/learn",
    icon: {
      default: RiBookReadLine,
      active: RiBookReadFill,
    },
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: {
      default: RiSettings4Line,
      active: RiSettings4Fill,
    },
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-border bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="relative h-8 w-8">
          <Image
            src="/logo.svg"
            alt="ForexJoey Logo"
            width={32}
            height={32}
            className="animate-float"
          />
        </div>
        <span className="font-display text-lg font-bold tracking-wide text-foreground">
          ForexJoey
        </span>
      </div>

      <div className="scrollbar-thin flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = isActive ? item.icon.active : item.icon.default;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-foreground/70 hover:bg-accent/5 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-item"
                  className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.badge && (
                <span className={`ml-auto rounded px-1.5 py-0.5 text-xs font-semibold ${
                  item.badge.variant === "new" 
                    ? "bg-positive/10 text-positive" 
                    : item.badge.variant === "premium"
                    ? "bg-warning/10 text-warning"
                    : "bg-accent/10 text-accent"
                }`}>
                  {item.badge.text}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-3 py-4">
        <div className="rounded-lg bg-card-gradient p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-positive/20 p-1.5">
              <RiRobot2Fill className="h-4 w-4 text-positive" />
            </div>
            <span className="text-sm font-semibold">Free Plan</span>
            <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              3/3 Signals
            </span>
          </div>
          <p className="mb-3 text-xs text-foreground/70">
            Upgrade to Premium for unlimited AI signals and advanced features
          </p>
          <button className="w-full rounded-lg bg-accent py-1.5 text-sm font-semibold text-white transition-all hover:bg-accent/90">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
