"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Lote } from "@/lib/supabase/types";
import { formatHectares, getCropColor, getISLColor } from "@/lib/utils";

interface LoteCardProps {
  lote: Lote;
}

export function LoteCard({ lote }: LoteCardProps) {
  const cropStyle = getCropColor(lote.cultivo_actual);
  const islStyle = getISLColor(lote.isl_score);

  return (
    <Link href={`/lotes/${lote.id}`} className="block group">
      <Card
        hoverEffect
        className="p-4 flex items-center justify-between border-stone-200/80 transition-all duration-200"
      >
        <div className="flex items-center gap-3.5">
          {/* Aerial Field Thumbnail Simulation */}
          <div className="w-14 h-14 rounded-xl bg-[#203622] flex items-center justify-center relative overflow-hidden shrink-0 border border-stone-200">
            {/* Green texture */}
            <div
              className="absolute inset-0 opacity-80"
              style={{
                backgroundColor: cropStyle.fill,
                opacity: 0.25,
              }}
            />
            {/* Furrow lines */}
            <svg
              viewBox="0 0 50 50"
              className="w-full h-full p-2 opacity-50 stroke-white fill-none"
              strokeWidth="2"
            >
              <line x1="5" y1="10" x2="45" y2="10" />
              <line x1="5" y1="20" x2="45" y2="20" />
              <line x1="5" y1="30" x2="45" y2="30" />
              <line x1="5" y1="40" x2="45" y2="40" />
            </svg>
            <span className="relative z-10 text-white font-bold text-sm drop-shadow">
              {lote.numero}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#4F8A3F] transition-colors">
                {lote.nombre}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cropStyle.badge}`}>
                {lote.cultivo_actual}
              </span>
            </div>

            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {formatHectares(lote.hectareas)}
              {lote.variedad_hibrido && ` • ${lote.variedad_hibrido}`}
            </p>

            <div className="flex items-center gap-1.5 mt-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold text-stone-700">
                ISL: <span className={islStyle.color}>{lote.isl_score}/100</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </Card>
    </Link>
  );
}
