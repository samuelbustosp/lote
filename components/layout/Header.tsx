"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CloudRain,
  ChevronDown,
  LogOut,
  Building,
} from "lucide-react";
import { useStore } from "@/lib/supabase/store";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

/**
 * Top Application Header - streamlined, minimal and compact.
 */
export function Header({ title, subtitle }: HeaderProps) {
  const {
    user,
    isAuthenticated,
    signOut,
    rainfallRecords,
    farm,
  } = useStore();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const latestRain = rainfallRecords[0] || { milimetros: 0, fecha: "Sin registros" };

  const userDisplayName =
    user?.user_metadata?.full_name ||
    farm.titular ||
    user?.email?.split("@")[0] ||
    "Productor";

  const userInitials = userDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#F7F8F5]/90 backdrop-blur-md px-3.5 sm:px-8 py-2.5 sm:py-4 border-b border-stone-200/60">
      <div className="flex items-center justify-between gap-2.5 sm:gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="lg:hidden shrink-0">
            <Link href="/">
              <Logo size="sm" showText={false} />
            </Link>
          </div>

          <div className="min-w-0">
            <h1 className="text-base sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">
              {title || `Hola, ${userDisplayName.split(" ")[0]}`}
            </h1>
            <p className="text-[11px] sm:text-sm text-stone-500 font-normal truncate">
              {subtitle || `${farm.nombre} • ${farm.ubicacion}`}
            </p>
          </div>
        </div>

        {/* Right side widgets */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Weather Widget */}
          <Link
            href="/weather"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#4F8A3F]/50 transition-colors"
          >
            <div className="p-1 rounded-lg sm:rounded-xl bg-sky-50 text-sky-600">
              <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-stone-900 leading-none">
                {latestRain.milimetros} mm
              </span>
              <span className="text-[10px] text-stone-500 font-medium hidden sm:inline">
                {latestRain.fecha ? `Lluvia: ${latestRain.fecha}` : "Pluviómetro"}
              </span>
            </div>
          </Link>

          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#4F8A3F]/50 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-[#4F8A3F] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shadow-xs">
                  {userInitials || "GB"}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-stone-900 leading-tight">
                    {userDisplayName}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate max-w-[120px]">
                    {user?.email}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-stone-100 mb-1">
                    <p className="text-xs font-bold text-stone-900">{userDisplayName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    <p className="text-[10px] text-[#4F8A3F] font-semibold mt-1">
                      {farm.nombre}
                    </p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Building className="w-4 h-4 text-stone-400" />
                    <span>Configurar Establecimiento</span>
                  </Link>

                  <button
                    onClick={async () => {
                      setIsUserDropdownOpen(false);
                      await signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/login">
                <Button size="sm" variant="outline" className="rounded-xl sm:rounded-2xl font-semibold text-xs px-2.5 py-1 sm:px-3 sm:py-2">
                  Ingresar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-xl sm:rounded-2xl font-semibold shadow-xs text-xs px-2.5 py-1 sm:px-3 sm:py-2">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
