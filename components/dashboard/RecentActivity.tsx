"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  Droplet,
  ShieldAlert,
  Wheat,
  Eye,
  Plus,
} from "lucide-react";
import { useStore } from "@/lib/supabase/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

/**
 * Recent Activity widget displaying the latest field tasks and operations.
 */
export function RecentActivity() {
  const { activities } = useStore();

  const getActivityIcon = (tipo: string) => {
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

  const recentList = activities.slice(0, 4);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-2 mb-3">
          <CardTitle>Actividad reciente</CardTitle>
          <Link
            href="/activities"
            className="text-xs font-semibold text-[#4F8A3F] hover:text-[#3E7031] hover:underline"
          >
            Ver todas
          </Link>
        </CardHeader>

        {recentList.length > 0 ? (
          <div className="flex flex-col divide-y divide-stone-100">
            {recentList.map((activity) => (
              <Link
                key={activity.id}
                href={activity.lote_id ? `/fields/${activity.lote_id}` : "/activities"}
                className="py-3 flex items-center justify-between hover:bg-stone-50/80 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF4E7] flex items-center justify-center shrink-0">
                    {getActivityIcon(activity.tipo)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 group-hover:text-[#4F8A3F] transition-colors">
                      {activity.tipo}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">
                      {activity.lote_nombre}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-stone-400 font-medium">
                    {formatDate(activity.fecha)}
                  </span>
                  {getStatusBadge(activity.estado)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-stone-400 space-y-2">
            <p>No hay labores cargadas en el campo.</p>
            <Link
              href="/activities"
              className="inline-flex items-center gap-1 text-[#4F8A3F] font-semibold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar labor</span>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
