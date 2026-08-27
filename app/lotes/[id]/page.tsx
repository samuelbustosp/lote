"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Layers,
  Sprout,
  Plus,
  Sparkles,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DoseHeatmap } from "@/components/lotes/DoseHeatmap";
import { LoteTimeline } from "@/components/lotes/LoteTimeline";
import { NewLaborModal } from "@/components/labores/NewLaborModal";
import { useStore } from "@/lib/supabase/store";
import {
  formatHectares,
  getCropColor,
  getISLColor,
  formatNumber,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LoteDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { lotes, timelineEvents } = useStore();
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);

  const lote = lotes.find((l) => l.id === resolvedParams.id);

  if (!lote) {
    return (
      <AppShell>
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto">
          <p className="text-sm font-bold text-stone-800">Lote no encontrado</p>
          <Link
            href="/lotes"
            className="text-xs text-[#4F8A3F] font-semibold mt-2 inline-block hover:underline"
          >
            Volver a la lista de lotes
          </Link>
        </div>
      </AppShell>
    );
  }

  const cropStyle = getCropColor(lote.cultivo_actual);
  const islStyle = getISLColor(lote.isl_score);
  const events = timelineEvents[lote.id] || [];

  return (
    <AppShell
      title={lote.nombre}
      subtitle={`${lote.cultivo_actual} • ${formatHectares(lote.hectareas)} • Campaña 2025/26`}
    >
      <div className="space-y-6">
        {/* Back navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/lotes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Lotes</span>
          </Link>

          <Button onClick={() => setIsLaborModalOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            <span>Registrar Labor</span>
          </Button>
        </div>

        {/* Lote Header Summary Card */}
        <Card className="p-6 border-stone-200/80">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Lote identity */}
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cropStyle.fill }}
                />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {lote.cultivo_actual}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {lote.nombre}
              </h2>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                {lote.variedad_hibrido || "Variedad no especificada"}
              </p>
            </div>

            {/* ISL Score Card */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EBF4E7] border border-[#B6D88A]/60 shrink-0 min-w-[80px]">
                  <span className="text-[10px] font-bold uppercase text-[#3E7031] tracking-wider">
                    ISL
                  </span>
                  <span className="text-2xl font-extrabold text-[#3E7031] leading-tight">
                    {lote.isl_score}
                  </span>
                  <span className="text-[9px] text-[#3E7031]/80">/ 100</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      Índice de Salud del Lote:
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${islStyle.badge}`}>
                      {islStyle.label}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lote.isl_resumen}
                  </p>
                  <p className="text-[11px] text-[#3E7031] font-medium pt-0.5">
                    💡 {lote.isl_recomendacion}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="md:col-span-1 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[11px] text-stone-400 font-medium">Superficie</span>
                <p className="text-base font-bold text-stone-900">
                  {formatHectares(lote.hectareas)}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 font-medium">Rinde Est.</span>
                <p className="text-base font-bold text-stone-900">
                  {lote.rendimiento_estimado || "--"} qq/ha
                </p>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 font-medium">Estado</span>
                <p className="text-xs font-semibold text-stone-800">
                  {lote.estado_fenologico || "Vegetativo"}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 font-medium">Histórico</span>
                <p className="text-xs font-semibold text-stone-800">
                  {lote.rendimiento_historico || "--"} qq/ha
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 2-Column Section: Dose Heatmap & Memoria del Campo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Map & Heatmap */}
          <div className="lg:col-span-6 space-y-6">
            <DoseHeatmap lote={lote} />
          </div>

          {/* Right Column: Memoria del Campo Infinite Timeline */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Memoria del campo
                </h3>
                <p className="text-xs text-stone-500">
                  Historial cronológico de labores, lluvias y análisis de IA
                </p>
              </div>

              <span className="text-xs font-semibold text-stone-400">
                {events.length} hitos registrados
              </span>
            </div>

            <LoteTimeline events={events} />
          </div>
        </div>

        {/* Modal */}
        <NewLaborModal
          isOpen={isLaborModalOpen}
          onClose={() => setIsLaborModalOpen(false)}
          defaultLoteId={lote.id}
        />
      </div>
    </AppShell>
  );
}
