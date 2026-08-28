"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sprout,
  Droplet,
  ShieldAlert,
  Wheat,
  Eye,
  Wrench,
  Edit,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NewActivityModal } from "@/components/activities/NewActivityModal";
import { EditActivityModal } from "@/components/activities/EditActivityModal";
import { useStore } from "@/lib/supabase/store";
import { FieldActivity, ActivityStatus } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";

/**
 * Activities & Field Work orders management page.
 */
export default function ActivitiesPage() {
  const { activities, updateActivityStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<FieldActivity | null>(null);

  const statusFilters = ["Todos", "Pendiente", "En progreso", "Completada"];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.lote_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.insumo_principal &&
        activity.insumo_principal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (activity.operario &&
        activity.operario.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "Todos" ? true : activity.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  return (
    <AppShell
      title="Labores y Órdenes de Trabajo"
      subtitle="Planificación agronómica, aplicaciones y seguimiento a campo"
    >
      <div className="space-y-6">
        {/* Header Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por labor, lote, insumo u operario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200/90 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
            />
          </div>

          <Button onClick={() => setIsNewActivityOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Nueva Labor</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#4F8A3F] text-white shadow-xs"
                  : "bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {st}
            </button>
          ))}
          <span className="text-xs text-stone-400 font-medium ml-auto hidden sm:inline">
            {filteredActivities.length} labores
          </span>
        </div>

        {/* Activities List */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="p-5 border-stone-200/80 hover:border-[#4F8A3F]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#EBF4E7] flex items-center justify-center shrink-0 mt-0.5">
                      {getActivityIcon(activity.tipo)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-stone-900 leading-tight">
                          {activity.tipo} {activity.cultivo ? `• ${activity.cultivo}` : ""}
                        </h3>
                        <Badge
                          variant={
                            activity.estado === "Completada"
                              ? "success"
                              : activity.estado === "En progreso"
                              ? "warning"
                              : "muted"
                          }
                        >
                          {activity.estado}
                        </Badge>
                      </div>

                      <p className="text-xs text-stone-500 font-medium mt-1">
                        {activity.lote_nombre} • {formatDate(activity.fecha)}
                      </p>

                      {(activity.insumo_principal || activity.dosis) && (
                        <p className="text-xs text-stone-700 mt-1 font-semibold">
                          {activity.insumo_principal}{" "}
                          {activity.dosis ? `(${activity.dosis})` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Quick Switch */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {activity.estado !== "Completada" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateActivityStatus(activity.id, "Completada")}
                        className="text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span>Marcar lista</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateActivityStatus(activity.id, "Pendiente")}
                        className="text-xs"
                      >
                        <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
                        <span>Reabrir</span>
                      </Button>
                    )}

                    <button
                      onClick={() => setEditingActivity(activity)}
                      className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Editar labor"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
            <Wrench className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">No hay labores registradas</h3>
            <p className="text-xs text-stone-500">
              Registrá tus tareas de siembra, fertilización, pulverización o cosecha.
            </p>
            <Button onClick={() => setIsNewActivityOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              <span>Registrar Primera Labor</span>
            </Button>
          </div>
        )}

        {/* Modals */}
        <NewActivityModal
          isOpen={isNewActivityOpen}
          onClose={() => setIsNewActivityOpen(false)}
        />

        {editingActivity && (
          <EditActivityModal
            isOpen={Boolean(editingActivity)}
            onClose={() => setEditingActivity(null)}
            activity={editingActivity}
          />
        )}
      </div>
    </AppShell>
  );
}
