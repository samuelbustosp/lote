"use client";

import React, { useState } from "react";
import { Tractor, Plus, Edit } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NewMachineryModal } from "@/components/machinery/NewMachineryModal";
import { EditMachineryModal } from "@/components/machinery/EditMachineryModal";
import { useStore } from "@/lib/supabase/store";
import { Machinery } from "@/lib/supabase/types";

/**
 * Machinery fleet management and telemetries page.
 */
export default function MachineryPage() {
  const { machinery } = useStore();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingMachinery, setEditingMachinery] = useState<Machinery | null>(null);

  return (
    <AppShell
      title="Parque de Maquinaria"
      subtitle="Telemetría, estado de equipos y horas de labor"
    >
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500 font-medium">
            {machinery.length} equipos registrados
          </p>

          <Button onClick={() => setIsNewModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Nueva Maquinaria</span>
          </Button>
        </div>

        {machinery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machinery.map((item) => (
              <Card key={item.id} className="p-5 border-stone-200/80">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center shrink-0">
                      <Tractor className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 leading-tight">
                        {item.nombre}
                      </h3>
                      <p className="text-xs text-stone-500">{item.modelo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.estado === "Operativa" || item.estado === "En labor"
                          ? "success"
                          : "warning"
                      }
                    >
                      {item.estado}
                    </Badge>
                    <button
                      onClick={() => setEditingMachinery(item)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Editar equipo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">Horas de uso</span>
                    <p className="font-bold text-stone-800">{item.horas_uso} hs</p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Ubicación actual</span>
                    <p className="font-bold text-stone-800">{item.ubicacion_actual || "Galpón Principal"}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
            <Tractor className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">No hay maquinarias registradas</h3>
            <p className="text-xs text-stone-500">
              Registrá tus tractores, sembradoras, cosechadoras y equipos para controlar su mantenimiento y horas de uso.
            </p>
            <Button onClick={() => setIsNewModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              <span>Incorporar Primer Equipo</span>
            </Button>
          </div>
        )}

        {/* Modals */}
        <NewMachineryModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
        />

        {editingMachinery && (
          <EditMachineryModal
            isOpen={Boolean(editingMachinery)}
            onClose={() => setEditingMachinery(null)}
            machinery={editingMachinery}
          />
        )}
      </div>
    </AppShell>
  );
}
