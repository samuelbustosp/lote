"use client";

import React, { useState } from "react";
import { ChevronDown, Info, Gauge, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Lote } from "@/lib/supabase/types";
import { formatNumber } from "@/lib/utils";

interface DoseHeatmapProps {
  lote: Lote;
}

export function DoseHeatmap({ lote }: DoseHeatmapProps) {
  const [selectedLayer, setSelectedLayer] = useState("siembra");

  const doseScale = [
    { value: "50.500", color: "#15803d" },
    { value: "48.000", color: "#22c55e" },
    { value: "43.400", color: "#a3e635" },
    { value: "40.100", color: "#facc15" },
    { value: "38.000", color: "#f97316" },
    { value: "34.300", color: "#dc2626" },
  ];

  const avgDose = lote.dose_data?.promedio_aplicado || 44100;
  const precision = lote.dose_data?.precision_porcentaje || 95.82;
  const unit = lote.dose_data?.unidad || "semillas/ha";

  return (
    <Card className="overflow-hidden p-0 border-stone-200/80 flex flex-col">
      {/* Top Filter Bar */}
      <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-900">Mapa de prescripción y dosis</h3>
        <div className="relative">
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 pr-8 appearance-none text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4F8A3F]"
          >
            <option value="siembra">Siembra - {lote.cultivo_actual} 2025/26</option>
            <option value="fertilizacion">Fertilización Nitrogenada</option>
            <option value="cosecha">Mapa de Rendimiento Real (qq/ha)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Heatmap Visual Container */}
      <div className="relative h-[320px] bg-[#1a2d1b] overflow-hidden flex items-center justify-center p-4">
        {/* Satellite Background Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#2d4b2e 15%, transparent 16%), radial-gradient(#1e3520 15%, transparent 16%)`,
            backgroundSize: "20px 20px",
            backgroundColor: "#162817",
          }}
        />

        {/* SVG Graphic with Gradient Masked Field Boundary */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-w-[340px] drop-shadow-2xl relative z-10"
        >
          <defs>
            {/* Field Polygon Clip Path */}
            <clipPath id="field-boundary-clip">
              <polygon points="20,15 80,10 90,75 35,90 15,65" />
            </clipPath>

            {/* Radial multi-spot heat gradients */}
            <radialGradient id="heat-spot-1" cx="45%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#facc15" stopOpacity="0.85" />
              <stop offset="90%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.75" />
            </radialGradient>

            <radialGradient id="heat-spot-2" cx="70%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0.8" />
            </radialGradient>

            <radialGradient id="heat-spot-3" cx="35%" cy="75%" r="45%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#84cc16" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Masked Heatmap Field Surface */}
          <g clipPath="url(#field-boundary-clip)">
            {/* Base lush green layer */}
            <rect x="0" y="0" width="100" height="100" fill="#15803d" />
            {/* High-yielding top corner */}
            <circle cx="70" cy="25" r="40" fill="url(#heat-spot-2)" />
            {/* Central low-yield zone */}
            <circle cx="48" cy="45" r="32" fill="url(#heat-spot-1)" />
            {/* Bottom-left recovery zone */}
            <circle cx="35" cy="75" r="30" fill="url(#heat-spot-3)" />

            {/* Fine furrow scanlines */}
            {Array.from({ length: 25 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 4}
                x2="100"
                y2={i * 4 + 10}
                stroke="#ffffff"
                strokeWidth="0.3"
                opacity="0.15"
              />
            ))}
          </g>

          {/* Border Outline */}
          <polygon
            points="20,15 80,10 90,75 35,90 15,65"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Legend Sidebar Scale on Map */}
        <div className="absolute right-3 top-3 bottom-3 bg-black/60 backdrop-blur-md rounded-2xl p-2.5 flex flex-col justify-between text-white z-20 border border-white/10 shadow-lg">
          <span className="text-[9px] font-semibold uppercase text-stone-300 tracking-wider">
            {unit}
          </span>
          <div className="flex flex-col gap-1.5">
            {doseScale.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] font-mono font-medium tracking-tight">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom KPI summary */}
      <div className="p-4 bg-white grid grid-cols-2 divide-x divide-stone-100 border-t border-stone-100">
        <div className="pr-4 flex flex-col">
          <span className="text-xs text-stone-500 font-medium">Promedio aplicado</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-stone-900">
              {formatNumber(avgDose)}
            </span>
            <span className="text-xs text-stone-500 font-medium">{unit}</span>
          </div>
        </div>

        <div className="pl-4 flex flex-col">
          <span className="text-xs text-stone-500 font-medium">Precisión de dosis</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-emerald-700">
              {formatNumber(precision, 2)} %
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>
      </div>
    </Card>
  );
}
