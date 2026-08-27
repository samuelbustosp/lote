"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sprout,
  Droplet,
  ShieldAlert,
  Wheat,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NewLaborModal } from "@/components/labores/NewLaborModal";
import { useStore } from "@/lib/supabase/store";
import { formatDate, formatCurrency, formatHectares } from "@/lib/utils";
import { EstadoLabor } from "@/lib/supabase/types";

export default function LaboresPage() {
  const { labores, updateLaborStatus } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewLaborOpen, setIsNewLaborOpen] = useState(false);

  const statusFilters = ["Todas", "Pendiente", "En progreso", "Completada"];

  const filteredLabores = labores.filter((labor) => {
    const matchesStatus =
      selectedStatus === "Todas" ? true : labor.estado === selectedStatus;
    const matchesSearch =
      labor.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      labor.lote_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (labor.insumo_principal &&
        labor.insumo_principal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (labor.operario &&
        labor.operario.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const getLaborIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "siembra":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "fertilización":
      case "fertilizacion":
        return <Droplet className="w-4 h-4 text-sky-600" />;
      case "pulverización":
      case "pulverizacion":
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case "cosecha":
        return <Wheat className="w-4 h-4 text-orange-600" />;
      default:
        return <Wrench className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <AppShell
      title="Labores y Tareas Agrícolas"
      subtitle="Registro, asignación y seguimiento de labores a campo"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por labor, lote u operario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200/90 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
            />
          </div>

          <Button onClick={() => setIsNewLaborOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Nueva Labor</span>
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === st
                  ? "bg-[#4F8A3F] text-white shadow-xs"
                  : "bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {st}
            </button>
          ))}
          <span className="text-xs text-stone-400 font-medium ml-auto hidden sm:inline">
            {filteredLabores.length} labores encontradas
          </span>
        </div>

        {/* Labores List Table / Cards */}
        <div className="space-y-3">
          {filteredLabores.map((labor) => (
            <Card
              key={labor.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-stone-200/80 hover:border-stone-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#EBF4E7] flex items-center justify-center shrink-0 mt-0.5">
                  {getLaborIcon(labor.tipo)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {labor.tipo} • {labor.lote_nombre}
                    </h3>
                    <Badge
                      variant={
                        labor.estado === "Completada"
                          ? "success"
                          : labor.estado === "En progreso"
                          ? "warning"
                          : "muted"
                      }
                      className="text-[10px]"
                    >
                      {labor.estado}
                    </Badge>
                  </div>

                  <p className="text-xs text-stone-600">
                    {labor.insumo_principal && (
                      <span className="font-semibold text-stone-800 mr-2">
                        {labor.insumo_principal} ({labor.dosis || "Dosis estándar"})
                      </span>
                    )}
                    {labor.observaciones && <span>— {labor.observaciones}</span>}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1 flex-wrap">
                    <span>📅 {formatDate(labor.fecha)}</span>
                    <span>📍 {formatHectares(labor.superficie_ha)}</span>
                    {labor.maquinaria && <span>🚜 {labor.maquinaria}</span>}
                    {labor.operario && <span>👤 {labor.operario}</span>}
                    {labor.costo_estimado && (
                      <span className="font-semibold text-stone-700">
                        💵 {formatCurrency(labor.costo_estimado)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Action Switcher */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto justify-end">
                <Link
                  href={`/lotes/${labor.lote_id}`}
                  className="text-xs font-semibold text-[#4F8A3F] hover:underline px-3 py-1.5"
                >
                  Ver Lote
                </Link>

                {labor.estado !== "Completada" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateLaborStatus(
                        labor.id,
                        labor.estado === "Pendiente" ? "En progreso" : "Completada"
                      )
                    }
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>
                      {labor.estado === "Pendiente" ? "Iniciar" : "Completar"}
                    </span>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <NewLaborModal isOpen={isNewLaborOpen} onClose={() => setIsNewLaborOpen(false)} />
      </div>
    </AppShell>
  );
}
