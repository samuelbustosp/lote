"use client";

import React from "react";
import {
  Sprout,
  Droplet,
  CloudRain,
  ShieldAlert,
  ThermometerSnowflake,
  FlaskConical,
  Wheat,
  Sparkles,
  User,
  Clock,
} from "lucide-react";
import { TimelineEvent } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface LoteTimelineProps {
  events: TimelineEvent[];
}

export function LoteTimeline({ events }: LoteTimelineProps) {
  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "siembra":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "fertilizacion":
        return <Droplet className="w-4 h-4 text-sky-600" />;
      case "lluvia":
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case "pulverizacion":
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case "helada":
        return <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />;
      case "fungicida":
        return <FlaskConical className="w-4 h-4 text-violet-600" />;
      case "cosecha":
        return <Wheat className="w-4 h-4 text-orange-600" />;
      case "informe_ia":
        return <Sparkles className="w-4 h-4 text-[#4F8A3F]" />;
      default:
        return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  const getEventBg = (tipo: string) => {
    switch (tipo) {
      case "siembra":
        return "bg-emerald-50 border-emerald-200";
      case "fertilizacion":
        return "bg-sky-50 border-sky-200";
      case "lluvia":
        return "bg-blue-50 border-blue-200";
      case "pulverizacion":
        return "bg-amber-50 border-amber-200";
      case "helada":
        return "bg-cyan-50 border-cyan-200";
      case "fungicida":
        return "bg-violet-50 border-violet-200";
      case "cosecha":
        return "bg-orange-50 border-orange-200";
      case "informe_ia":
        return "bg-[#EBF4E7] border-[#B6D88A]";
      default:
        return "bg-stone-50 border-stone-200";
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <p className="text-sm text-stone-500">
          No hay eventos registrados en la memoria de este lote todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-stone-200">
      {events.map((event) => (
        <div key={event.id} className="relative group">
          {/* Timeline Node Icon */}
          <div
            className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shadow-xs bg-white ${getEventBg(
              event.tipo
            )}`}
          >
            {getEventIcon(event.tipo)}
          </div>

          {/* Event Content Card */}
          <Card className="p-4 sm:p-5 border-stone-200/80 hover:border-[#4F8A3F]/40 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <span className="text-xs font-semibold text-stone-400 block mb-0.5">
                  {event.fecha}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                  {event.titulo}
                </h4>
              </div>

              {event.tipo === "informe_ia" && (
                <Badge variant="default" className="text-[10px]">
                  IA Insights
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
              {event.descripcion}
            </p>

            {/* Key Data Pills */}
            {event.datos_clave && event.datos_clave.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
                {event.datos_clave.map((d, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] font-medium text-stone-700"
                  >
                    <span className="text-stone-400 mr-1">{d.etiqueta}:</span>
                    <span className="font-semibold text-stone-800">{d.valor}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Author Footer */}
            {event.autor && (
              <div className="flex items-center gap-1.5 mt-3 pt-2 text-[11px] text-stone-400">
                <User className="w-3 h-3" />
                <span>{event.autor}</span>
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}
