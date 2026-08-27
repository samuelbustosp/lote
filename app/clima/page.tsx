"use client";

import React, { useState } from "react";
import {
  CloudRain,
  Plus,
  Droplets,
  Sun,
  Wind,
  Calendar,
  Thermometer,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RainModal } from "@/components/clima/RainModal";
import { useStore } from "@/lib/supabase/store";
import { formatDate } from "@/lib/utils";

export default function ClimaPage() {
  const { lluvias, establecimiento } = useStore();
  const [isRainModalOpen, setIsRainModalOpen] = useState(false);

  const totalMm = lluvias.reduce((acc, r) => acc + r.milimetros, 0);

  const forecast = [
    { day: "Hoy", temp: "28° / 17°", rain: "0 mm", icon: Sun },
    { day: "Jueves", temp: "29° / 18°", rain: "5 mm", icon: CloudRain },
    { day: "Viernes", temp: "26° / 16°", rain: "22 mm", icon: CloudRain },
    { day: "Sábado", temp: "24° / 14°", rain: "8 mm", icon: CloudRain },
    { day: "Domingo", temp: "27° / 15°", rain: "0 mm", icon: Sun },
  ];

  return (
    <AppShell
      title="Clima y Registro Pluviométrico"
      subtitle={`${establecimiento.ubicacion}`}
    >
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                {totalMm} mm acumulados
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Campaña 2025/26 (+14% sobre la media histórica)
              </p>
            </div>
          </div>

          <Button onClick={() => setIsRainModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Cargar Lluvia</span>
          </Button>
        </div>

        {/* Forecast Strip */}
        <Card className="p-5 border-stone-200/80">
          <CardHeader className="pb-2 mb-3">
            <CardTitle>Pronóstico 5 Días para {establecimiento.nombre}</CardTitle>
            <span className="text-xs text-stone-400">Actualizado hace 1 hora</span>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {forecast.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex flex-col items-center text-center"
                >
                  <span className="text-xs font-bold text-stone-700">{f.day}</span>
                  <Icon className="w-6 h-6 text-sky-600 my-2" />
                  <span className="text-xs font-bold text-stone-900">{f.temp}</span>
                  <span className="text-[11px] text-sky-600 font-semibold mt-0.5">
                    {f.rain}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Rainfalls List */}
        <Card className="p-5 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <CardTitle>Historial de Precipitaciones</CardTitle>
            <span className="text-xs text-stone-400">{lluvias.length} registros</span>
          </CardHeader>

          <div className="divide-y divide-stone-100">
            {lluvias.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between hover:bg-stone-50/60 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {item.milimetros}
                    <span className="text-[9px] font-normal ml-0.5">mm</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      {item.lote_nombre || "General Establecimiento"}
                    </h4>
                    <p className="text-xs text-stone-500">{item.observaciones}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-stone-400">
                  {formatDate(item.fecha)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal */}
        <RainModal isOpen={isRainModalOpen} onClose={() => setIsRainModalOpen(false)} />
      </div>
    </AppShell>
  );
}
