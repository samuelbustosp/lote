"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { InteractiveMap } from "@/components/dashboard/InteractiveMap";
import { LiaWidget } from "@/components/dashboard/LiaWidget";

export default function HomePage() {
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
