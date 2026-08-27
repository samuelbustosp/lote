"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Layers, PieChart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FinancialDonut } from "@/components/economia/FinancialDonut";
import { useStore } from "@/lib/supabase/store";
import { formatCurrency, formatHectares } from "@/lib/utils";

export default function EconomiaPage() {
  const { economia, lotes, selectedCampana } = useStore();

  return (
    <AppShell
      title="Economía y Rentabilidad"
      subtitle={`Balance financiero • ${selectedCampana.nombre}`}
    >
      <div className="space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">Ingresos Proyectados</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(economia.ingresos_totales)}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Cosecha + Contratos a futuro</p>
          </Card>

          <Card className="p-5 border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">Costos & Gastos</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(economia.gastos_totales)}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Insumos, labores, fletes</p>
          </Card>

          <Card className="p-5 border-stone-200/80 bg-[#EBF4E7]/40 border-[#B6D88A]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#3E7031]">Margen Bruto Total</span>
              <div className="p-2 rounded-xl bg-[#4F8A3F] text-white">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#3E7031]">
              {formatCurrency(economia.margen_bruto)}
            </p>
            <p className="text-[11px] text-[#3E7031]/80 mt-1">Rentabilidad neta del campo</p>
          </Card>

          <Card className="p-5 border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">Margen por Hectárea</span>
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(economia.margen_por_ha)}
              <span className="text-xs font-normal text-stone-500"> / ha</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Base 1.125 ha sembradas</p>
          </Card>
        </div>

        {/* 2-Column Section: Donut Chart & Margins per Crop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Donut Chart */}
          <div className="lg:col-span-6">
            <Card className="p-6 border-stone-200/80">
              <CardHeader className="pb-3 mb-4">
                <CardTitle>Distribución de gastos</CardTitle>
                <span className="text-xs text-stone-400">Por rubro agronómico</span>
              </CardHeader>

              <FinancialDonut
                categories={economia.distribucion_gastos}
                totalGastos={economia.gastos_totales}
              />
            </Card>
          </div>

          {/* Margen por Cultivo */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="p-6 border-stone-200/80">
              <CardHeader className="pb-3 mb-4">
                <CardTitle>Rentabilidad por cultivo</CardTitle>
                <span className="text-xs text-stone-400">Campaña 2025/26</span>
              </CardHeader>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Maíz (725 ha)</h4>
                    <p className="text-xs text-stone-500">11 lotes sembrados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-900">USD 228.400</p>
                    <p className="text-xs text-emerald-700 font-semibold">USD 315 / ha</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Soja (400 ha)</h4>
                    <p className="text-xs text-stone-500">7 lotes sembrados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-900">USD 96.180</p>
                    <p className="text-xs text-emerald-700 font-semibold">USD 240 / ha</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
