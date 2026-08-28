"use client";

import React from "react";
import { ExpenseCategory } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";

interface FinancialDonutProps {
  categories: ExpenseCategory[];
  totalGastos: number;
}

/**
 * Visual Donut chart showing categorized agricultural expenses.
 */
export function FinancialDonut({ categories, totalGastos }: FinancialDonutProps) {
  let accumulatedAngle = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const validCategories = categories.filter((c) => c.monto > 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Donut Chart */}
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
          {validCategories.map((cat, idx) => {
            const startAngle = accumulatedAngle;
            const slicePercent = totalGastos > 0 ? cat.monto / totalGastos : 0;
            accumulatedAngle += slicePercent;
            const endAngle = accumulatedAngle;

            const [startX, startY] = getCoordinatesForPercent(startAngle);
            const [endX, endY] = getCoordinatesForPercent(endAngle);

            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(" ");

            return (
              <path
                key={idx}
                d={pathData}
                fill={cat.color}
                className="transition-all hover:opacity-90 cursor-pointer"
              />
            );
          })}

          {/* Inner cutout for donut style */}
          <circle cx="0" cy="0" r="0.65" fill="#ffffff" />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-stone-400">Total Gastos</span>
          <span className="text-sm font-extrabold text-stone-900 leading-tight">
            {formatCurrency(totalGastos)}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 flex flex-col gap-2.5 w-full">
        {validCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-semibold text-stone-700">{cat.categoria}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-900">{formatCurrency(cat.monto)}</span>
              <span className="text-stone-400 font-mono w-9 text-right">{cat.porcentaje}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
