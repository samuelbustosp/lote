"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Layers, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FinancialDonut } from "@/components/finances/FinancialDonut";
import { NewTransactionModal } from "@/components/finances/NewTransactionModal";
import { useStore } from "@/lib/supabase/store";
import { formatCurrency, formatDate } from "@/lib/utils";

/**
 * Farm Finances & Gross Margin analysis page.
 */
export default function FinancesPage() {
  const { finances, transactions, deleteTransaction, selectedSeason, fields } = useStore();
  const [isNewTransOpen, setIsNewTransOpen] = useState(false);

  const totalHa = fields.reduce((acc, f) => acc + f.hectareas, 0);

  return (
    <AppShell
      title="Economía y Rentabilidad"
      subtitle={`Balance financiero • ${selectedSeason.nombre}`}
    >
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500 font-medium">
            {transactions.length} movimientos registrados en la campaña
          </p>

          <Button onClick={() => setIsNewTransOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Registrar Movimiento</span>
          </Button>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">Ingresos Totales</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(finances.ingresos_totales)}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Cosecha + Contratos</p>
          </Card>

          <Card className="p-5 border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">Costos & Gastos</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(finances.gastos_totales)}
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
              {formatCurrency(finances.margen_bruto)}
            </p>
            <p className="text-[11px] text-[#3E7031]/80 mt-1">Rentabilidad neta calculada</p>
          </Card>

          <Card className="p-5 border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">Margen por Hectárea</span>
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(finances.margen_por_ha)}
              <span className="text-xs font-normal text-stone-500"> / ha</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Base {totalHa} ha sembradas
            </p>
          </Card>
        </div>

        {/* 2-Column Section: Donut Chart & Transactions List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <Card className="p-6 border-stone-200/80">
              <CardHeader className="pb-3 mb-4">
                <CardTitle>Distribución de gastos</CardTitle>
                <span className="text-xs text-stone-400">Por rubro agronómico</span>
              </CardHeader>

              {finances.gastos_totales > 0 ? (
                <FinancialDonut
                  categories={finances.distribucion_gastos}
                  totalGastos={finances.gastos_totales}
                />
              ) : (
                <div className="p-8 text-center text-xs text-stone-400">
                  No hay gastos registrados aún en esta campaña.
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="p-6 border-stone-200/80">
              <CardHeader className="pb-3 mb-4">
                <CardTitle>Detalle de Movimientos Financieros</CardTitle>
                <span className="text-xs text-stone-400">{transactions.length} registros</span>
              </CardHeader>

              {transactions.length > 0 ? (
                <div className="divide-y divide-stone-100 max-h-[460px] overflow-y-auto pr-1">
                  {transactions.map((t) => (
                    <div
                      key={t.id}
                      className="py-3 flex items-center justify-between hover:bg-stone-50/60 px-2 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            t.tipo === "Ingreso"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {t.tipo === "Ingreso" ? "+" : "-"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                              {t.categoria}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                              {formatDate(t.fecha)}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">{t.descripcion || "Sin detalle"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-bold ${
                            t.tipo === "Ingreso" ? "text-emerald-700" : "text-stone-900"
                          }`}
                        >
                          {t.tipo === "Ingreso" ? "+" : "-"} {formatCurrency(t.monto)}
                        </span>

                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          title="Eliminar movimiento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                  <p>No hay ingresos o gastos registrados.</p>
                  <Button size="sm" variant="outline" onClick={() => setIsNewTransOpen(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Cargar Primer Gasto o Ingreso</span>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Modal */}
        <NewTransactionModal
          isOpen={isNewTransOpen}
          onClose={() => setIsNewTransOpen(false)}
        />
      </div>
    </AppShell>
  );
}
