"use client";

import React from "react";
import { Tractor, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/lib/supabase/store";

export default function MaquinariaPage() {
  const { maquinarias } = useStore();

  return (
    <AppShell
      title="Parque de Maquinaria"
      subtitle="Telemetría, estado de equipos y horas de labor"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maquinarias.map((maq) => (
            <Card key={maq.id} className="p-5 border-stone-200/80">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center shrink-0">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 leading-tight">
                      {maq.nombre}
                    </h3>
                    <p className="text-xs text-stone-500">{maq.modelo}</p>
                  </div>
                </div>

                <Badge
                  variant={
                    maq.estado === "Operativa" || maq.estado === "En labor"
                      ? "success"
                      : "warning"
                  }
                >
                  {maq.estado}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 font-medium">Horas de uso</span>
                  <p className="font-bold text-stone-800">{maq.horas_uso} hs</p>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Ubicación actual</span>
                  <p className="font-bold text-stone-800">{maq.ubicacion_actual}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
