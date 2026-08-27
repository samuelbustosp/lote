"use client";

import React from "react";
import { GastoCategoria } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";

interface FinancialDonutProps {
  categories: GastoCategoria[];
  totalGastos: number;
}

export function FinancialDonut({ categories, totalGastos }: FinancialDonutProps) {
  // Compute SVG stroke-dasharray offsets for donut segments
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-2">
      {/* SVG Donut Chart */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {categories.map((cat, idx) => {
            const strokeDasharray = `${(cat.porcentaje / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += cat.porcentaje;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth="14"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:opacity-90 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Total
          </span>
          <span className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
            {formatCurrency(totalGastos)}
          </span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-50">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-semibold text-stone-700">{cat.categoria}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-stone-400 font-mono">{formatCurrency(cat.monto)}</span>
              <span className="font-bold text-stone-900 w-9 text-right font-mono">
                {cat.porcentaje}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
