"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";

/**
 * Executive Agricultural Reports and Exportation page.
 */
export default function ReportsPage() {
  const { farm, selectedSeason } = useStore();
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloaded(reportName);
    setTimeout(() => setDownloaded(null), 3000);
  };

  const reports = [
    {
      id: "rep-1",
      title: "Informe Ejecutivo de Campaña",
      description: "Resumen agronómico, balance de hectáreas sembradas, lluvias e ISL promedio.",
      format: "PDF",
      size: "2.4 MB",
    },
    {
      id: "rep-2",
      title: "Balance Financiero y Márgenes Brutos",
      description: "Detalle discriminado de costos por insumos, labores contratadas y rentabilidad por hectárea.",
      format: "PDF / Excel",
      size: "1.8 MB",
    },
    {
      id: "rep-3",
      title: "Fichas de Trazabilidad y Memoria de Lotes",
      description: "Historial completo de labores, dosis aplicadas y eventos cronológicos de las parcelas.",
      format: "PDF",
      size: "4.1 MB",
    },
    {
      id: "rep-4",
      title: "Planilla de Labores & Insumos para Contratistas",
      description: "Órdenes de trabajo pendientes y ejecutadas con especificación de dosis y maquinaria.",
      format: "Excel (.xlsx)",
      size: "850 KB",
    },
  ];

  return (
    <AppShell
      title="Informes y Exportación"
      subtitle={`Documentos ejecutivos de ${farm.nombre} • ${selectedSeason.nombre}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <Card key={rep.id} className="p-5 border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2.5 rounded-2xl bg-[#EBF4E7] text-[#3E7031]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono font-medium">
                    {rep.format} • {rep.size}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-2">{rep.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{rep.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium">
                  {selectedSeason.nombre}
                </span>

                <Button
                  size="sm"
                  variant={downloaded === rep.title ? "secondary" : "outline"}
                  onClick={() => handleDownload(rep.title)}
                  className="text-xs"
                >
                  {downloaded === rep.title ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      <span>Generado</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span>Descargar</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
