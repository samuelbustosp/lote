"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Sprout,
  Leaf,
  Wrench,
  DollarSign,
} from "lucide-react";
import { useStore } from "@/lib/supabase/store";
import { formatCurrency, formatHectares } from "@/lib/utils";

export function MetricCards() {
  const { lotes, labores, economia } = useStore();

  const totalLotes = lotes.length;
  const totalHectareas = lotes.reduce((acc, l) => acc + l.hectareas, 0);

  const lotesMaiz = lotes.filter(
    (l) => l.cultivo_actual.toLowerCase() === "maíz" || l.cultivo_actual.toLowerCase() === "maiz"
  );
  const haMaiz = lotesMaiz.reduce((acc, l) => acc + l.hectareas, 0);

  const lotesSoja = lotes.filter((l) => l.cultivo_actual.toLowerCase() === "soja");
  const haSoja = lotesSoja.reduce((acc, l) => acc + l.hectareas, 0);

  const laboresPendientes = labores.filter((l) => l.estado === "Pendiente" || l.estado === "En progreso");
  const haLaboresPendientes = laboresPendientes.reduce((acc, l) => acc + l.superficie_ha, 0);

  const cards = [
    {
      label: "Lotes totales",
      value: totalLotes.toString(),
      subtext: formatHectares(totalHectareas),
      icon: Layers,
      color: "bg-[#4F8A3F] text-white",
      href: "/lotes",
    },
    {
      label: "En maíz",
      value: lotesMaiz.length.toString(),
      subtext: formatHectares(haMaiz),
      icon: Sprout,
      color: "bg-[#4F8A3F] text-white",
      href: "/lotes?cultivo=Maíz",
    },
    {
      label: "En soja",
      value: lotesSoja.length.toString(),
      subtext: formatHectares(haSoja),
      icon: Leaf,
      color: "bg-[#4F8A3F] text-white",
      href: "/lotes?cultivo=Soja",
    },
    {
      label: "Labores pendientes",
      value: laboresPendientes.length.toString(),
      subtext: formatHectares(haLaboresPendientes),
      icon: Wrench,
      color: "bg-[#4F8A3F] text-white",
      href: "/labores",
    },
    {
      label: "Margen bruto",
      value: formatCurrency(economia.margen_bruto),
      subtext: "Campaña actual",
      icon: DollarSign,
      color: "bg-[#4F8A3F] text-white",
      href: "/economia",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#4F8A3F]/50 hover:shadow-[0_4px_12px_rgba(79,138,63,0.08)] transition-all duration-150 flex flex-col justify-between group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${card.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                {card.value}
              </span>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-tight group-hover:text-[#4F8A3F] transition-colors">
                {card.label}
              </p>
              <p className="text-[11px] sm:text-xs text-stone-500 font-normal mt-0.5">
                {card.subtext}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
