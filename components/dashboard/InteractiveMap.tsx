"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ZoomIn,
  ZoomOut,
  Layers,
  ArrowRight,
  Info,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useStore } from "@/lib/supabase/store";
import { Lote } from "@/lib/supabase/types";
import { formatHectares, getCropColor } from "@/lib/utils";

interface InteractiveMapProps {
  interactive?: boolean;
  selectedLoteId?: string;
  onSelectLote?: (lote: Lote) => void;
  fullHeight?: boolean;
}

export function InteractiveMap({
  selectedLoteId,
  onSelectLote,
  fullHeight = false,
}: InteractiveMapProps) {
  const router = useRouter();
  const { lotes } = useStore();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<"cultivos" | "isl" | "rinde">("cultivos");
  const [hoveredLote, setHoveredLote] = useState<Lote | null>(null);

  const crops = [
    { name: "Maíz", color: "#4F8A3F" },
    { name: "Soja", color: "#10B981" },
    { name: "Trigo", color: "#F97316" },
    { name: "Girasol", color: "#EAB308" },
    { name: "Otros", color: "#78716C" },
  ];

  const getPolygonFill = (lote: Lote) => {
    if (activeLayer === "cultivos") {
      switch (lote.cultivo_actual.toLowerCase()) {
        case "maíz":
        case "maiz":
          return "rgba(79, 138, 63, 0.75)";
        case "soja":
          return "rgba(16, 185, 129, 0.75)";
        case "trigo":
          return "rgba(249, 115, 22, 0.75)";
        case "girasol":
          return "rgba(234, 179, 8, 0.75)";
        default:
          return "rgba(120, 113, 108, 0.75)";
      }
    } else if (activeLayer === "isl") {
      if (lote.isl_score >= 90) return "rgba(16, 185, 129, 0.8)";
      if (lote.isl_score >= 80) return "rgba(132, 204, 22, 0.8)";
      if (lote.isl_score >= 70) return "rgba(234, 179, 8, 0.8)";
      return "rgba(239, 68, 68, 0.8)";
    } else {
      // Rendimiento
      return (lote.rendimiento_estimado || 0) > 80
        ? "rgba(34, 197, 94, 0.8)"
        : "rgba(245, 158, 11, 0.8)";
    }
  };

  const handleLoteClick = (lote: Lote) => {
    if (onSelectLote) {
      onSelectLote(lote);
    } else {
      router.push(`/lotes/${lote.id}`);
    }
  };

  return (
    <Card className={`flex flex-col justify-between overflow-hidden p-0 relative ${fullHeight ? "h-[600px]" : "h-full"}`}>
      {/* Header bar over map */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-100 bg-white z-10">
        <div className="flex items-center gap-2">
          <CardTitle>Mapa de lotes</CardTitle>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-normal">
            Satelital
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              setActiveLayer(
                activeLayer === "cultivos"
                  ? "isl"
                  : activeLayer === "isl"
                  ? "rinde"
                  : "cultivos"
              )
            }
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-medium text-stone-700 transition-colors"
            title="Cambiar capa visual"
          >
            <Layers className="w-3.5 h-3.5 text-[#4F8A3F]" />
            <span className="capitalize">{activeLayer}</span>
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 bg-[#1a2e1d] min-h-[300px] overflow-hidden select-none">
        {/* Satellite Background pattern */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `radial-gradient(#2d4b2e 15%, transparent 16%), radial-gradient(#1e3520 15%, transparent 16%)`,
            backgroundSize: "24px 24px",
            backgroundColor: "#203622",
          }}
        />

        {/* SVG Parcels */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-w-[500px] max-h-[380px] drop-shadow-md"
          >
            {lotes.map((lote) => {
              const pointsStr = lote.map_coords.polygon
                .map((p) => `${p.x},${p.y}`)
                .join(" ");
              const isHovered = hoveredLote?.id === lote.id;
              const isSelected = selectedLoteId === lote.id;

              return (
                <g key={lote.id}>
                  <polygon
                    points={pointsStr}
                    fill={getPolygonFill(lote)}
                    stroke={isSelected ? "#FFFFFF" : isHovered ? "#FFFFFF" : "#32502E"}
                    strokeWidth={isSelected ? "1.5" : isHovered ? "1.2" : "0.7"}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredLote(lote)}
                    onMouseLeave={() => setHoveredLote(null)}
                    onClick={() => handleLoteClick(lote)}
                  />

                  {/* Parcel Number Tag */}
                  <text
                    x={lote.map_coords.center.x}
                    y={lote.map_coords.center.y}
                    fill="#FFFFFF"
                    fontSize="3.8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none drop-shadow"
                  >
                    {lote.numero}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 shadow-md overflow-hidden z-20">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="p-2 hover:bg-stone-100 text-stone-700 transition-colors border-b border-stone-100"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-2 hover:bg-stone-100 text-stone-700 transition-colors"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Tooltip info on hover */}
        {hoveredLote && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-stone-200/80 shadow-xl z-20 pointer-events-none animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCropColor(hoveredLote.cultivo_actual).fill }} />
              <p className="text-xs font-bold text-stone-900">{hoveredLote.nombre}</p>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              {hoveredLote.cultivo_actual} • {formatHectares(hoveredLote.hectareas)}
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
              ISL: {hoveredLote.isl_score}/100
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-stone-200/80 shadow-sm z-20 hidden sm:block">
          <p className="text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Cultivos
          </p>
          <div className="flex flex-col gap-1">
            {crops.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-500">18 lotes georreferenciados</span>
        <Link
          href="/mapas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F8A3F] hover:text-[#3E7031] hover:underline"
        >
          <span>Ver todos los lotes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
