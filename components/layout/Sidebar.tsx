"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Wrench,
  Map,
  FileText,
  DollarSign,
  Tractor,
  CloudRain,
  Sparkles,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/supabase/store";

export const NAV_ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Lotes", href: "/fields", icon: Layers },
  { label: "Labores", href: "/activities", icon: Wrench },
  { label: "Mapas", href: "/maps", icon: Map },
  { label: "Informes", href: "/reports", icon: FileText },
  { label: "Economía", href: "/finances", icon: DollarSign },
  { label: "Maquinaria", href: "/machinery", icon: Tractor },
  { label: "Clima", href: "/weather", icon: CloudRain },
  { label: "IA - Lía", href: "/assistant", icon: Sparkles, highlight: true },
  { label: "Ajustes", href: "/settings", icon: Settings },
];

/**
 * Desktop Sidebar Navigation.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { farm, user } = useStore();

  const userDisplayName =
    user?.user_metadata?.full_name || farm.titular || "Productor";

  const userInitials = userDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200/80 h-screen sticky top-0 px-4 py-5 justify-between select-none">
      {/* Brand Header */}
      <div className="flex flex-col gap-6">
        <Link href="/" className="px-2 py-1 block">
          <Logo size="md" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#EBF4E7] text-[#3E7031] font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-[#4F8A3F]"
                        : "text-stone-400 group-hover:text-stone-600"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.highlight && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#4F8A3F] text-white tracking-wider">
                    BETA
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-stone-100">
        <Link
          href="/settings"
          className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3E7031] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
              {userInitials || "GB"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[120px]">
                {userDisplayName}
              </span>
              <span className="text-[11px] text-stone-500 truncate max-w-[120px]">
                {farm.nombre}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
        </Link>
      </div>
    </aside>
  );
}
