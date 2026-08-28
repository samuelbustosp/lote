"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { InteractiveMap } from "@/components/dashboard/InteractiveMap";
import { LiaWidget } from "@/components/dashboard/LiaWidget";
import { LandingPage } from "@/components/landing/LandingPage";
import { useStore } from "@/lib/supabase/store";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F5] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#4F8A3F] text-white flex items-center justify-center animate-bounce shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-stone-500 animate-pulse">
          Cargando entorno agronómico...
        </p>
      </div>
    );
  }

  // If not authenticated, render the high-impact Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If authenticated, render the 100% Private Dashboard
  return (
    <AppShell>
      <div className="space-y-6">
        {/* KPI Metric Cards */}
        <MetricCards />

        {/* 3-Column Main Grid matching official mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column 1: Actividad Reciente */}
          <div className="lg:col-span-4 flex flex-col">
            <RecentActivity />
          </div>

          {/* Column 2: Mapa de Lotes */}
          <div className="lg:col-span-5 flex flex-col">
            <InteractiveMap />
          </div>

          {/* Column 3: Asistente Lía */}
          <div className="lg:col-span-3 flex flex-col">
            <LiaWidget />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
