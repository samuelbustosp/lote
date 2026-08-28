"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  History,
  FileSpreadsheet,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FieldTimeline } from "@/components/fields/FieldTimeline";
import { DoseHeatmap } from "@/components/fields/DoseHeatmap";
import { EditFieldModal } from "@/components/fields/EditFieldModal";
import { useStore } from "@/lib/supabase/store";
import { formatHectares, getCropColor, getISLColor } from "@/lib/utils";

interface FieldDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Field Detail view displaying telemetry, agronomic diagnosis, dose heatmap and timeline.
 */
export default function FieldDetailPage({ params }: FieldDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { fields, selectedSeason } = useStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const field = fields.find((f) => f.id === id);

  if (!field) {
    return (
      <AppShell title="Lote no encontrado" subtitle="El lote solicitado no existe o fue eliminado">
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">Lote no encontrado</h3>
          <p className="text-xs text-stone-500">
            Es posible que el lote haya sido eliminado o que el identificador sea incorrecto.
          </p>
          <Link href="/fields">
            <Button size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Volver al listado de lotes</span>
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const cropStyle = getCropColor(field.cultivo_actual);
  const islStyle = getISLColor(field.isl_score);

  return (
    <AppShell
      title={field.nombre}
      subtitle={`${field.cultivo_actual} • ${formatHectares(field.hectareas)} • ${selectedSeason.nombre}`}
    >
      <div className="space-y-6">
        {/* Navigation & Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/fields"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Lotes</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-stone-700"
            >
              <Edit className="w-4 h-4 mr-1.5 text-[#4F8A3F]" />
              <span>Editar Lote</span>
            </Button>
          </div>
        </div>

        {/* Top Summary Info Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cropStyle.fill }}
                />
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {field.cultivo_actual}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-semibold text-stone-600">
                  {field.variedad_hibrido || "Variedad no especificada"}
                </span>
                {field.estado_fenologico && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs font-semibold text-[#4F8A3F]">
                      {field.estado_fenologico}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {field.nombre}
              </h2>
            </div>

            {/* ISL Big Score Indicator */}
            <div className="flex items-center gap-4 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Índice de Salud (ISL)
                </span>
                <span className="text-xs font-bold text-stone-700">{islStyle.label}</span>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${islStyle.badge}`}
              >
                {field.isl_score}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-stone-100 text-xs">
            <div>
              <span className="text-stone-400 font-medium block mb-1">Superficie Total</span>
              <p className="text-base font-bold text-stone-900">
                {formatHectares(field.hectareas)}
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-medium block mb-1">Rendimiento Estimado</span>
              <p className="text-base font-bold text-stone-900">
                {field.rendimiento_estimado ? `${field.rendimiento_estimado} qq/ha` : "--"}
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-medium block mb-1">Rendimiento Histórico</span>
              <p className="text-base font-bold text-stone-900">
                {field.rendimiento_historico ? `${field.rendimiento_historico} qq/ha` : "--"}
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-medium block mb-1">Diferencial Proyectado</span>
              <p className="text-base font-bold text-emerald-700">
                {field.rendimiento_estimado && field.rendimiento_historico
                  ? `+${(field.rendimiento_estimado - field.rendimiento_historico).toFixed(1)} qq/ha`
                  : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Agronomic Diagnosis Banner */}
        <div className="bg-[#EBF4E7] border border-[#B6D88A]/60 rounded-3xl p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-[#4F8A3F] text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#3E7031]">
              Diagnóstico Agronómico & Recomendación de Lía
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {field.isl_resumen || "Monitoreo satelital regular y condición hídrica favorable."}
            </p>
            {field.isl_recomendacion && (
              <p className="text-xs font-semibold text-[#3E7031] pt-1">
                Recomendación: {field.isl_recomendacion}
              </p>
            )}
          </div>
        </div>

        {/* 2-Column Section: Heatmap & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6">
            <DoseHeatmap field={field} />
          </div>

          <div className="lg:col-span-6">
            <FieldTimeline field={field} />
          </div>
        </div>

        {/* Edit Modal */}
        <EditFieldModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          field={field}
          onDeleted={() => router.push("/fields")}
        />
      </div>
    </AppShell>
  );
}
