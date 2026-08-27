"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  Droplet,
  ShieldAlert,
  Wheat,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useStore } from "@/lib/supabase/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export function RecentActivity() {
  const { labores } = useStore();

  const getLaborIcon = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "siembra":
        return <Sprout className="w-4 h-4 text-[#4F8A3F]" />;
      case "fertilización":
      case "fertilizacion":
        return <Droplet className="w-4 h-4 text-[#4F8A3F]" />;
      case "pulverización":
      case "pulverizacion":
        return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      case "cosecha":
        return <Wheat className="w-4 h-4 text-amber-600" />;
      default:
        return <Eye className="w-4 h-4 text-stone-500" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    if (estado === "Completada") {
      return (
        <Badge variant="success" className="text-[10px] py-0 px-2">
          Completada
        </Badge>
      );
    }
    if (estado === "En progreso") {
      return (
        <Badge variant="warning" className="text-[10px] py-0 px-2">
          En progreso
        </Badge>
      );
    }
    return (
      <Badge variant="muted" className="text-[10px] py-0 px-2">
        Pendiente
      </Badge>
    );
  };

  const recentList = labores.slice(0, 4);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-2 mb-3">
          <CardTitle>Actividad reciente</CardTitle>
          <Link
            href="/labores"
            className="text-xs font-semibold text-[#4F8A3F] hover:text-[#3E7031] hover:underline"
          >
            Ver todas
          </Link>
        </CardHeader>

        <div className="flex flex-col divide-y divide-stone-100">
          {recentList.map((labor) => (
            <Link
              key={labor.id}
              href={`/lotes/${labor.lote_id}`}
              className="py-3 flex items-center justify-between hover:bg-stone-50/80 px-2 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4E7] flex items-center justify-center shrink-0">
                  {getLaborIcon(labor.tipo)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900 group-hover:text-[#4F8A3F] transition-colors">
                    {labor.tipo}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {labor.lote_nombre}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-stone-400 font-medium">
                  {formatDate(labor.fecha)}
                </span>
                {getStatusBadge(labor.estado)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
