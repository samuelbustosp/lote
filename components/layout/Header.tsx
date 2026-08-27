"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CloudRain,
  ChevronDown,
  Bell,
  Sparkles,
  Layers,
  Wrench,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/supabase/store";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const {
    campanas,
    selectedCampanaId,
    setSelectedCampanaId,
    selectedCampana,
    lluvias,
    establecimiento,
  } = useStore();

  const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Latest rain summary
  const latestRain = lluvias[0] || { milimetros: 18, fecha: "hace 4 días" };

  return (
    <header className="sticky top-0 z-30 bg-[#F7F8F5]/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-stone-200/60">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Link href="/">
              <Logo size="sm" showText={false} />
            </Link>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {title || `¡Buenas tardes, ${establecimiento.titular.split(" ")[0]}!`}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              {subtitle || `Resumen general de ${establecimiento.nombre}`}
            </p>
          </div>
        </div>

        {/* Right side widgets */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Weather Widget */}
          <Link
            href="/clima"
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#4F8A3F]/50 transition-colors"
          >
            <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
              <CloudRain className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-stone-900 leading-none">
                {latestRain.milimetros} mm
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                Última lluvia hace 4 días
              </span>
            </div>
          </Link>

          {/* Campaign Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCampaignDropdownOpen(!isCampaignDropdownOpen)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-stone-300 transition-colors text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-stone-900 leading-tight">
                  {selectedCampana.nombre}
                </span>
                <span className="text-[10px] text-stone-500 hidden sm:inline">
                  {selectedCampana.fecha_inicio} - {selectedCampana.fecha_fin}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400" />
            </button>

            {/* Campaign dropdown menu */}
            {isCampaignDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[11px] font-semibold uppercase text-stone-400 tracking-wider">
                  Seleccionar Campaña
                </div>
                {campanas.map((camp) => (
                  <button
                    key={camp.id}
                    onClick={() => {
                      setSelectedCampanaId(camp.id);
                      setIsCampaignDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors text-left",
                      camp.id === selectedCampanaId &&
                        "bg-[#EBF4E7] text-[#3E7031] font-semibold"
                    )}
                  >
                    <div>
                      <p className="font-medium">{camp.nombre}</p>
                      <p className="text-[10px] text-stone-400">
                        {camp.fecha_inicio} - {camp.fecha_fin}
                      </p>
                    </div>
                    {camp.id === selectedCampanaId && (
                      <Check className="w-4 h-4 text-[#4F8A3F]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 rounded-2xl bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4F8A3F] ring-2 ring-white"></span>
            </button>

            {/* Notification Drawer Popover */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Notificaciones
                  </h4>
                  <span className="text-[10px] text-stone-400">3 nuevas</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        Labor pendiente en Lote 4
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Monitoreo programado de estrés hídrico.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        Diagnóstico Lía disponible
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Nuevo reporte de rinde y balance de nitrógeno.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5">
                    <CloudRain className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        Pronóstico de lluvia
                      </p>
                      <p className="text-[11px] text-stone-500">
                        25 mm estimados para este fin de semana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
