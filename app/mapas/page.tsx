"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InteractiveMap } from "@/components/dashboard/InteractiveMap";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/supabase/store";
import { formatHectares } from "@/lib/utils";
import { Lote } from "@/lib/supabase/types";
import { DoseHeatmap } from "@/components/lotes/DoseHeatmap";

export default function MapasPage() {
  const { lotes, establecimiento } = useStore();
  const [selectedLote, setSelectedLote] = useState<Lote | null>(lotes[3] || lotes[0]); // default Lote 4

  return (
    <AppShell
      title="Visor Geoespacial de Lotes"
      subtitle={`Establecimiento ${establecimiento.nombre} • ${formatHectares(establecimiento.superficie_total)}`}
    >
      <div className="space-y-6">
        {/* Full interactive map with selected lote inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <InteractiveMap
              interactive
              selectedLoteId={selectedLote?.id}
              onSelectLote={(l) => setSelectedLote(l)}
              fullHeight
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            {selectedLote ? (
              <DoseHeatmap lote={selectedLote} />
            ) : (
              <Card className="p-8 text-center text-stone-500 text-xs">
                Seleccioná un lote en el mapa para inspeccionar sus capas satelitales y dosis.
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
