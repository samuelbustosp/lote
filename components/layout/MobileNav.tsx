"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Wrench,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Lotes", href: "/fields", icon: Layers },
  { label: "Labores", href: "/activities", icon: Wrench },
  { label: "Economía", href: "/finances", icon: DollarSign },
  { label: "Lía", href: "/assistant", icon: Sparkles, highlight: true },
];

/**
 * Mobile Bottom Navigation - Full width floating pill with subtle screen padding (px-2).
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-0 z-40 px-2 pointer-events-none">
      <nav className="pointer-events-auto w-full bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-stone-200/80 px-2 py-2 flex items-center justify-around transition-all">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "p-2.5 rounded-full transition-all duration-200 relative flex items-center justify-center",
                isActive
                  ? "bg-[#EBF4E7] text-[#3E7031] shadow-2xs scale-105"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "stroke-[2.5px] text-[#3E7031]" : "text-stone-600"
                  )}
                />
                {item.highlight && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#4F8A3F]"></span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
