"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InteractiveMap } from "@/components/dashboard/InteractiveMap";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/supabase/store";
import { formatHectares } from "@/lib/utils";
import { Field } from "@/lib/supabase/types";
import { DoseHeatmap } from "@/components/fields/DoseHeatmap";

/**
 * Geospatial Map Viewer page.
 */
export default function MapsPage() {
  const { fields, farm } = useStore();
  const [selectedField, setSelectedField] = useState<Field | null>(fields[0] || null);

  useEffect(() => {
    if (!selectedField && fields.length > 0) {
      setSelectedField(fields[0]);
    }
  }, [fields, selectedField]);

  return (
    <AppShell
      title="Visor Geoespacial de Lotes"
      subtitle={`${farm.nombre} • ${formatHectares(farm.superficie_total)}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <InteractiveMap
              interactive
              selectedFieldId={selectedField?.id}
              onSelectField={(f) => setSelectedField(f)}
              fullHeight
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            {selectedField ? (
              <DoseHeatmap field={selectedField} />
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
